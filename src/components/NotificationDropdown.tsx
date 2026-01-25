import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAllAsRead, markAsRead, Notification } from '../api/notification';
import { getErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';

const NotificationDropdown: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
            setHasUnread(data.some(n => !n.isRead));
        } catch {
            // Silent catch
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        } else {
            fetchNotifications();
        }
    }, [isOpen]);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleRefresh = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isRefreshing) return;
        setIsRefreshing(true);
        await fetchNotifications();
        setTimeout(() => setIsRefreshing(false), 500); // Visual feedback delay
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setHasUnread(false);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        setIsOpen(false);

        if (!notification.isRead) {
            try {
                await markAsRead(notification.id);
                setNotifications(prev => prev.map(n =>
                    n.id === notification.id ? { ...n, isRead: true } : n
                ));
                const stillHasUnread = notifications.some(n => n.id !== notification.id && !n.isRead);
                setHasUnread(stillHasUnread);
            } catch {
                // Silent catch for background fetch
            }
        }

        if (notification.loginId && notification.repositoryName && notification.prNumber) {
            navigate(`/repos/${notification.loginId}/${notification.repositoryName}/pulls/${notification.prNumber}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0f1117] animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="fixed sm:absolute top-[72px] sm:top-auto left-4 right-4 sm:left-auto sm:right-0 sm:mt-2 sm:w-80 bg-[#161b22] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-2 px-3 border-b border-white/5 flex justify-between items-center bg-[#0d1117]">
                        <h3 className="text-[11px] font-bold text-slate-400 tracking-widest">NOTIFICATIONS</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleRefresh}
                                className={`text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 ${isRefreshing ? 'animate-spin' : ''}`}
                                title="알림 새로고침"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}
                                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                            >
                                모두 읽음
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-xs">
                                알림이 없습니다
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-2.5 px-3 border-b border-white/5 cursor-pointer hover:bg-white/10 transition-colors ${!notification.isRead ? 'bg-blue-500/5' : ''}`}
                                >
                                    <div className="flex items-center space-x-2.5">
                                        <div className="flex-shrink-0">
                                            {notification.type === 'NEW_PR' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            )}
                                            {notification.type === 'REVIEW_COMPLETE' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                            )}
                                            {notification.type === 'REVIEW_FAILED' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between space-x-2">
                                                <p className={`text-[13px] truncate ${!notification.isRead ? 'text-white font-semibold' : 'text-slate-400'}`} title={notification.repositoryName}>
                                                    <span className={`text-[10px] font-bold mr-1.5 ${notification.type === 'NEW_PR' ? 'text-green-400' :
                                                        notification.type === 'REVIEW_COMPLETE' ? 'text-blue-400' :
                                                            'text-red-400'
                                                        }`}>
                                                        {notification.type === 'NEW_PR' && '새로운 PR'}
                                                        {notification.type === 'REVIEW_COMPLETE' && '리뷰완료'}
                                                        {notification.type === 'REVIEW_FAILED' && '리뷰실패'}
                                                    </span>
                                                    {notification.repositoryName || 'Unknown'}
                                                </p>
                                                <span className="text-[9px] text-slate-600 flex-shrink-0">
                                                    {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0 mx-1"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
