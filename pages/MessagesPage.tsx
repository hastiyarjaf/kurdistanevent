import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { Message, User } from '../types';
import { getConversation, sendMessage, getUserById, subscribeToMessages } from '../services/api';
import Button from '../components/Button';
import { ArrowLeft, Send } from 'lucide-react';

const MessagesPage: React.FC = () => {
    const { userId: otherUserId } = useParams<{ userId: string }>();
    const { user: currentUser } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        if (!otherUserId) return;

        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const otherUserData = await getUserById(otherUserId);
                setOtherUser(otherUserData || null);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
        
        // Subscribe to real-time message updates
        const handleNewMessages = (conversationData: Message[]) => {
            setMessages(conversationData);
        };
        
        // Initial fetch of messages
        getConversation(otherUserId).then(handleNewMessages);
        
        const unsubscribe = subscribeToMessages(otherUserId, handleNewMessages);

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [otherUserId]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !otherUserId) return;

        setIsSending(true);
        try {
            await sendMessage(otherUserId, newMessage);
            setNewMessage('');
            // The subscription will handle updating the messages
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsSending(false);
        }
    };

    const isFromCurrentUser = (message: Message) => message.sender_id === currentUser?.id;
    
    const pageTitle = otherUser?.role === 'admin' 
        ? t('messages.adminTitle')
        : t('messages.title', { name: otherUser?.name || '...' });


    if (isLoading) {
        return <div className="text-center">{/* Loading... */}</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto bg-surface dark:bg-dark-surface rounded-xl shadow-2xl overflow-hidden">
            <header className="flex items-center p-4 border-b border-border dark:border-dark-border">
                 <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="me-2 p-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                {otherUser && (
                    <img src={otherUser.profile_picture} alt={otherUser.name} className="h-10 w-10 rounded-full me-3" />
                )}
                <h1 className="text-xl font-display font-bold">{pageTitle}</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-text-secondary">{t('messages.noMessages')}</p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex ${isFromCurrentUser(msg) ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isFromCurrentUser(msg) ? 'bg-primary text-white' : 'bg-background dark:bg-dark-background'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${isFromCurrentUser(msg) ? 'text-white/70' : 'text-text-secondary/70'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                 <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t border-border dark:border-dark-border">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('messages.inputPlaceholder')}
                        className="flex-1 w-full px-4 py-2 border border-border rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background dark:bg-dark-background dark:border-dark-border dark:text-dark-text-primary"
                        autoComplete="off"
                    />
                    <Button type="submit" isLoading={isSending} disabled={!newMessage.trim()} className="rounded-full p-3">
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </footer>
        </div>
    );
};

export default MessagesPage;
