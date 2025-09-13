const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || './database.sqlite';

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create tables
const createTables = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    profile_picture_url TEXT,
                    language TEXT DEFAULT 'en',
                    role TEXT DEFAULT 'attendee',
                    verification_status TEXT DEFAULT 'unsubmitted',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Host profiles table
            db.run(`
                CREATE TABLE IF NOT EXISTS host_profiles (
                    user_id TEXT PRIMARY KEY,
                    business_name TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    website TEXT,
                    business_address TEXT NOT NULL,
                    organizer_type TEXT NOT NULL,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);

            // Cities table
            db.run(`
                CREATE TABLE IF NOT EXISTS cities (
                    id TEXT PRIMARY KEY,
                    name_en TEXT NOT NULL,
                    name_ar TEXT NOT NULL,
                    name_ku TEXT NOT NULL
                )
            `);

            // Categories table
            db.run(`
                CREATE TABLE IF NOT EXISTS categories (
                    id TEXT PRIMARY KEY,
                    translation_key TEXT NOT NULL,
                    icon TEXT NOT NULL,
                    sponsor_id TEXT
                )
            `);

            // Events table
            db.run(`
                CREATE TABLE IF NOT EXISTS events (
                    id TEXT PRIMARY KEY,
                    title_en TEXT NOT NULL,
                    title_ar TEXT NOT NULL,
                    title_ku TEXT NOT NULL,
                    description_en TEXT NOT NULL,
                    description_ar TEXT NOT NULL,
                    description_ku TEXT NOT NULL,
                    date DATETIME NOT NULL,
                    location_address TEXT NOT NULL,
                    location_lat REAL,
                    location_lng REAL,
                    image TEXT,
                    creator_id TEXT NOT NULL,
                    category_id TEXT NOT NULL,
                    city_id TEXT NOT NULL,
                    is_promoted BOOLEAN DEFAULT FALSE,
                    is_approved BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (creator_id) REFERENCES users(id),
                    FOREIGN KEY (category_id) REFERENCES categories(id),
                    FOREIGN KEY (city_id) REFERENCES cities(id)
                )
            `);

            // Event attendees junction table
            db.run(`
                CREATE TABLE IF NOT EXISTS event_attendees (
                    event_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (event_id, user_id),
                    FOREIGN KEY (event_id) REFERENCES events(id),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);

            // Messages table
            db.run(`
                CREATE TABLE IF NOT EXISTS messages (
                    id TEXT PRIMARY KEY,
                    sender_id TEXT NOT NULL,
                    receiver_id TEXT NOT NULL,
                    text TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_read BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (sender_id) REFERENCES users(id),
                    FOREIGN KEY (receiver_id) REFERENCES users(id)
                )
            `);

            // Sponsors table
            db.run(`
                CREATE TABLE IF NOT EXISTS sponsors (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    logo_url TEXT NOT NULL
                )
            `);

            // Banners table
            db.run(`
                CREATE TABLE IF NOT EXISTS banners (
                    id TEXT PRIMARY KEY,
                    sponsor_id TEXT NOT NULL,
                    image_url TEXT NOT NULL,
                    link_url TEXT,
                    target_city_id TEXT,
                    placement TEXT NOT NULL,
                    FOREIGN KEY (sponsor_id) REFERENCES sponsors(id),
                    FOREIGN KEY (target_city_id) REFERENCES cities(id)
                )
            `);

            resolve();
        });
    });
};

// Initialize with sample data
const initializeSampleData = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if data already exists
            db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row.count > 0) {
                    resolve();
                    return;
                }

                console.log('Initializing sample data...');

                // Hash password for sample users
                const hashedPassword = await bcrypt.hash('password123', 10);

                // Sample cities
                const cities = [
                    { id: 'city-1', name_en: 'Erbil', name_ar: 'أربيل', name_ku: 'هەولێر' },
                    { id: 'city-2', name_en: 'Sulaymaniyah', name_ar: 'السليمانية', name_ku: 'سلێمانی' },
                    { id: 'city-3', name_en: 'Duhok', name_ar: 'دهوك', name_ku: 'دهۆک' },
                    { id: 'city-4', name_en: 'Baghdad', name_ar: 'بغداد', name_ku: 'بەغدا' },
                ];

                // Sample categories
                const categories = [
                    { id: 'cat-1', translation_key: 'category.social', icon: 'Users' },
                    { id: 'cat-2', translation_key: 'category.music', icon: 'Music' },
                    { id: 'cat-3', translation_key: 'category.wellness', icon: 'HeartPulse' },
                    { id: 'cat-4', translation_key: 'category.sports', icon: 'Bike' },
                    { id: 'cat-5', translation_key: 'category.festivals', icon: 'Tent' },
                    { id: 'cat-9', translation_key: 'category.conferences', icon: 'Presentation' },
                    { id: 'cat-10', translation_key: 'category.art-culture', icon: 'Palette' },
                ];

                // Sample users
                const users = [
                    {
                        id: 'user-1',
                        name: 'Ahmed Mustafa',
                        email: 'ahmed@example.com',
                        password_hash: hashedPassword,
                        profile_picture_url: 'https://picsum.photos/seed/user1/100/100',
                        language: 'en',
                        role: 'host',
                        verification_status: 'approved'
                    },
                    {
                        id: 'user-2',
                        name: 'Lana Khalil',
                        email: 'lana@example.com',
                        password_hash: hashedPassword,
                        profile_picture_url: 'https://picsum.photos/seed/user2/100/100',
                        language: 'ku',
                        role: 'host',
                        verification_status: 'approved'
                    },
                    {
                        id: 'user-3',
                        name: 'Saman Ahmad',
                        email: 'saman@example.com',
                        password_hash: hashedPassword,
                        profile_picture_url: 'https://picsum.photos/seed/user3/100/100',
                        language: 'en',
                        role: 'attendee'
                    }
                ];

                // Insert sample data
                db.serialize(() => {
                    const cityStmt = db.prepare("INSERT INTO cities VALUES (?, ?, ?, ?)");
                    cities.forEach(city => {
                        cityStmt.run(city.id, city.name_en, city.name_ar, city.name_ku);
                    });
                    cityStmt.finalize();

                    const categoryStmt = db.prepare("INSERT INTO categories VALUES (?, ?, ?, ?)");
                    categories.forEach(category => {
                        categoryStmt.run(category.id, category.translation_key, category.icon, null);
                    });
                    categoryStmt.finalize();

                    const userStmt = db.prepare(`
                        INSERT INTO users (id, name, email, password_hash, profile_picture_url, language, role, verification_status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `);
                    users.forEach(user => {
                        userStmt.run(
                            user.id, user.name, user.email, user.password_hash,
                            user.profile_picture_url, user.language, user.role, user.verification_status
                        );
                    });
                    userStmt.finalize();

                    // Sample events
                    const eventStmt = db.prepare(`
                        INSERT INTO events (
                            id, title_en, title_ar, title_ku, description_en, description_ar, description_ku,
                            date, location_address, location_lat, location_lng, image, creator_id, category_id, city_id, is_promoted, is_approved
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    const sampleEvents = [
                        {
                            id: 'event-1',
                            title_en: 'Newroz Celebration in Erbil Citadel',
                            title_ar: 'احتفال نوروز في قلعة أربيل',
                            title_ku: 'ئاھەنگی نەورۆز لە قەڵای ھەولێر',
                            description_en: 'Join us for the annual Newroz celebration with fire, dance, and music at the historic Erbil Citadel.',
                            description_ar: 'انضم إلينا في احتفال نوروز السنوي بالنار والرقص والموسيقى في قلعة أربيل التاريخية.',
                            description_ku: 'بەشداربن لە ئاھەنگی ساڵانەی نەورۆز بە ئاگر و سەم و مۆسیقا لە قەڵای مێژوویی ھەولێر.',
                            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                            location_address: 'Erbil Citadel, Erbil, Iraq',
                            location_lat: 36.1911,
                            location_lng: 44.0094,
                            image: 'https://picsum.photos/seed/newroz/600/400',
                            creator_id: 'user-1',
                            category_id: 'cat-5',
                            city_id: 'city-1',
                            is_promoted: true,
                            is_approved: true
                        },
                        {
                            id: 'event-2',
                            title_en: 'Slemani Tech Conference 2024',
                            title_ar: 'مؤتمر السليمانية التقني 2024',
                            title_ku: 'کۆنفرانسی تەکنیکی سلێمانی ٢٠٢٤',
                            description_en: 'A gathering of the brightest minds in technology in Kurdistan. Workshops, talks, and networking opportunities.',
                            description_ar: 'ملتقى ألمع العقول في مجال التكنولوجيا في كردستان. ورش عمل ومحادثات وفرص للتواصل.',
                            description_ku: 'کۆبوونەوەی زیرەکترین کەسایەتییەکانی تەکنەلۆژیا لە کوردستان. وۆرکشۆپ و وتار و دەرفەتی تۆڕسازی.',
                            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                            location_address: 'Grand Millennium Sulaimani, Sulaymaniyah, Iraq',
                            location_lat: 35.5606,
                            location_lng: 45.4206,
                            image: 'https://picsum.photos/seed/tech/600/400',
                            creator_id: 'user-2',
                            category_id: 'cat-9',
                            city_id: 'city-2',
                            is_promoted: false,
                            is_approved: true
                        }
                    ];

                    sampleEvents.forEach(event => {
                        eventStmt.run(
                            event.id, event.title_en, event.title_ar, event.title_ku,
                            event.description_en, event.description_ar, event.description_ku,
                            event.date, event.location_address, event.location_lat, event.location_lng,
                            event.image, event.creator_id, event.category_id, event.city_id,
                            event.is_promoted, event.is_approved
                        );
                    });
                    eventStmt.finalize();

                    resolve();
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    db,
    createTables,
    initializeSampleData
};