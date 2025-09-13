require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { db, createTables, initializeSampleData } = require('./database');

const app = express();
const port = process.env.PORT || 3000;

// Logging middleware
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'http://localhost:5173',
            'http://localhost:3000'
        ];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const token = req.cookies.session_token;
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user from database
        db.get(
            'SELECT id, name, email, profile_picture_url, language, role, verification_status FROM users WHERE id = ?',
            [decoded.userId],
            (err, user) => {
                if (err || !user) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
                req.user = user;
                next();
            }
        );
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    const token = req.cookies.session_token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            db.get(
                'SELECT id, name, email, profile_picture_url, language, role, verification_status FROM users WHERE id = ?',
                [decoded.userId],
                (err, user) => {
                    if (!err && user) {
                        req.user = user;
                    }
                    next();
                }
            );
        } catch (err) {
            next();
        }
    } else {
        next();
    }
};

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array() 
        });
    }
    next();
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/auth/register', [
    body('name').isLength({ min: 2 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['attendee', 'host'])
], handleValidationErrors, async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (existingUser) {
                return res.status(409).json({ error: 'User with this email already exists' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);
            const userId = uuidv4();

            // Insert user
            db.run(
                `INSERT INTO users (id, name, email, password_hash, language, role) 
                 VALUES (?, ?, ?, ?, 'en', ?)`,
                [userId, name, email, passwordHash, role],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create user' });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                        { userId, role },
                        process.env.JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    // Set secure cookie
                    res.cookie('session_token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });

                    // Return user data (no sensitive info)
                    res.status(201).json({
                        user: {
                            id: userId,
                            name,
                            email,
                            role,
                            language: 'en',
                            verification_status: 'unsubmitted'
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/api/auth/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
], handleValidationErrors, async (req, res) => {
    const { email, password } = req.body;

    try {
        db.get(
            'SELECT id, name, email, password_hash, role, language, verification_status FROM users WHERE email = ?',
            [email],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Check password
                const isValidPassword = await bcrypt.compare(password, user.password_hash);
                if (!isValidPassword) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Generate JWT token
                const token = jwt.sign(
                    { userId: user.id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                // Set secure cookie
                res.cookie('session_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                // Return user data (no password)
                const { password_hash, ...userData } = user;
                res.json({ user: userData });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('session_token');
    res.json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// ==========================================
// EVENT ROUTES
// ==========================================

// Get all events
app.get('/api/events', optionalAuth, (req, res) => {
    const { city_id, category_id, search, page = 1, limit = 20 } = req.query;
    
    let query = `
        SELECT e.*, 
               c.name_en as city_name_en, c.name_ar as city_name_ar, c.name_ku as city_name_ku,
               cat.translation_key, cat.icon,
               u.name as creator_name, u.profile_picture_url as creator_avatar
        FROM events e
        JOIN cities c ON e.city_id = c.id
        JOIN categories cat ON e.category_id = cat.id
        JOIN users u ON e.creator_id = u.id
        WHERE e.is_approved = 1
    `;
    
    const params = [];
    
    if (city_id) {
        query += ' AND e.city_id = ?';
        params.push(city_id);
    }
    
    if (category_id) {
        query += ' AND e.category_id = ?';
        params.push(category_id);
    }
    
    if (search) {
        query += ' AND (e.title_en LIKE ? OR e.title_ar LIKE ? OR e.title_ku LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY e.is_promoted DESC, e.date ASC';
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, events) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Transform the data to match the expected format
        const transformedEvents = events.map(event => ({
            id: event.id,
            title: {
                en: event.title_en,
                ar: event.title_ar,
                ku: event.title_ku
            },
            description: {
                en: event.description_en,
                ar: event.description_ar,
                ku: event.description_ku
            },
            date: event.date,
            location_address: event.location_address,
            location_latLng: event.location_lat && event.location_lng ? 
                `${event.location_lat},${event.location_lng}` : null,
            image: event.image,
            creator_id: event.creator_id,
            category_id: event.category_id,
            city_id: event.city_id,
            is_promoted: Boolean(event.is_promoted),
            creator: {
                id: event.creator_id,
                name: event.creator_name,
                profile_picture: event.creator_avatar
            },
            category: {
                id: event.category_id,
                translation_key: event.translation_key,
                icon: event.icon
            },
            city: {
                id: event.city_id,
                name: {
                    en: event.city_name_en,
                    ar: event.city_name_ar,
                    ku: event.city_name_ku
                }
            }
        }));

        res.json(transformedEvents);
    });
});

// Get event by ID
app.get('/api/events/:id', optionalAuth, (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT e.*, 
               c.name_en as city_name_en, c.name_ar as city_name_ar, c.name_ku as city_name_ku,
               cat.translation_key, cat.icon,
               u.name as creator_name, u.profile_picture_url as creator_avatar
        FROM events e
        JOIN cities c ON e.city_id = c.id
        JOIN categories cat ON e.category_id = cat.id
        JOIN users u ON e.creator_id = u.id
        WHERE e.id = ? AND e.is_approved = 1
    `;

    db.get(query, [id], (err, event) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Get attendees
        db.all(`
            SELECT u.id, u.name, u.profile_picture_url
            FROM event_attendees ea
            JOIN users u ON ea.user_id = u.id
            WHERE ea.event_id = ?
        `, [id], (err, attendees) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const transformedEvent = {
                id: event.id,
                title: {
                    en: event.title_en,
                    ar: event.title_ar,
                    ku: event.title_ku
                },
                description: {
                    en: event.description_en,
                    ar: event.description_ar,
                    ku: event.description_ku
                },
                date: event.date,
                location_address: event.location_address,
                location_latLng: event.location_lat && event.location_lng ? 
                    `${event.location_lat},${event.location_lng}` : null,
                image: event.image,
                creator_id: event.creator_id,
                category_id: event.category_id,
                city_id: event.city_id,
                is_promoted: Boolean(event.is_promoted),
                creator: {
                    id: event.creator_id,
                    name: event.creator_name,
                    profile_picture: event.creator_avatar
                },
                category: {
                    id: event.category_id,
                    translation_key: event.translation_key,
                    icon: event.icon
                },
                city: {
                    id: event.city_id,
                    name: {
                        en: event.city_name_en,
                        ar: event.city_name_ar,
                        ku: event.city_name_ku
                    }
                },
                attendees: attendees.map(a => ({
                    id: a.id,
                    name: a.name,
                    profile_picture: a.profile_picture_url
                })),
                attendee_ids: attendees.map(a => a.id)
            };

            res.json(transformedEvent);
        });
    });
});

// Create event
app.post('/api/events', authenticateToken, [
    body('title.en').isLength({ min: 1 }).trim(),
    body('title.ar').isLength({ min: 1 }).trim(),
    body('title.ku').isLength({ min: 1 }).trim(),
    body('description.en').isLength({ min: 1 }).trim(),
    body('description.ar').isLength({ min: 1 }).trim(),
    body('description.ku').isLength({ min: 1 }).trim(),
    body('date').isISO8601(),
    body('location_address').isLength({ min: 1 }).trim(),
    body('category_id').isLength({ min: 1 }),
    body('city_id').isLength({ min: 1 })
], handleValidationErrors, (req, res) => {
    const { title, description, date, location_address, location_latLng, image, category_id, city_id } = req.body;
    
    // Check if user is host and verified
    if (req.user.role === 'host' && req.user.verification_status !== 'approved') {
        return res.status(403).json({ error: 'Host account must be verified to create events' });
    }
    
    const eventId = uuidv4();
    let location_lat = null;
    let location_lng = null;
    
    if (location_latLng) {
        const [lat, lng] = location_latLng.split(',');
        location_lat = parseFloat(lat);
        location_lng = parseFloat(lng);
    }

    db.run(`
        INSERT INTO events (
            id, title_en, title_ar, title_ku, description_en, description_ar, description_ku,
            date, location_address, location_lat, location_lng, image, creator_id, category_id, city_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        eventId, title.en, title.ar, title.ku, description.en, description.ar, description.ku,
        date, location_address, location_lat, location_lng, image, req.user.id, category_id, city_id
    ], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to create event' });
        }

        res.status(201).json({
            id: eventId,
            title,
            description,
            date,
            location_address,
            location_latLng,
            image,
            creator_id: req.user.id,
            category_id,
            city_id,
            is_promoted: false,
            attendee_ids: []
        });
    });
});

// Toggle event attendance
app.post('/api/events/:id/attend', authenticateToken, (req, res) => {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    // Check if user is already attending
    db.get(
        'SELECT * FROM event_attendees WHERE event_id = ? AND user_id = ?',
        [eventId, userId],
        (err, attendance) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (attendance) {
                // Remove attendance
                db.run(
                    'DELETE FROM event_attendees WHERE event_id = ? AND user_id = ?',
                    [eventId, userId],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to update attendance' });
                        }
                        res.json({ attending: false });
                    }
                );
            } else {
                // Add attendance
                db.run(
                    'INSERT INTO event_attendees (event_id, user_id) VALUES (?, ?)',
                    [eventId, userId],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to update attendance' });
                        }
                        res.json({ attending: true });
                    }
                );
            }
        }
    );
});

// ==========================================
// UTILITY ROUTES
// ==========================================

// Get cities
app.get('/api/cities', (req, res) => {
    db.all('SELECT * FROM cities', (err, cities) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const transformedCities = cities.map(city => ({
            id: city.id,
            name: {
                en: city.name_en,
                ar: city.name_ar,
                ku: city.name_ku
            }
        }));

        res.json(transformedCities);
    });
});

// Get categories
app.get('/api/categories', (req, res) => {
    db.all('SELECT * FROM categories', (err, categories) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(categories);
    });
});

// Simple translations endpoint
app.get('/api/translations/:lang', (req, res) => {
    const { lang } = req.params;
    
    // This is a simplified version - in production you'd want a proper translations table
    const translations = {
        en: {
            'category.social': 'Social Events',
            'category.music': 'Live Music',
            'category.wellness': 'Yoga & Wellness',
            'category.sports': 'Sports & Fitness',
            'category.festivals': 'Festivals',
            'category.conferences': 'Conferences',
            'category.art-culture': 'Art & Culture',
        },
        ar: {
            'category.social': 'فعاليات اجتماعية',
            'category.music': 'موسيقى حية',
            'category.wellness': 'يوجا وصحة',
            'category.sports': 'رياضة ولياقة',
            'category.festivals': 'مهرجانات',
            'category.conferences': 'مؤتمرات',
            'category.art-culture': 'فن وثقافة',
        },
        ku: {
            'category.social': 'چاڵاکی کۆمەڵایەتی',
            'category.music': 'مۆسیقای ڕاستەوخۆ',
            'category.wellness': 'یۆگا و تەندروستی',
            'category.sports': 'وەرزش و لەشجوانی',
            'category.festivals': 'فیستیڤاڵەکان',
            'category.conferences': 'کۆنفرانسەکان',
            'category.art-culture': 'هونەر و ڕۆشنبیری',
        }
    };

    res.json(translations[lang] || translations.en);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    if (error.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS policy violation' });
    }
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
async function startServer() {
    try {
        await createTables();
        await initializeSampleData();
        
        app.listen(port, () => {
            console.log(`Kurdistan Events API server running on port ${port}`);
            console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();