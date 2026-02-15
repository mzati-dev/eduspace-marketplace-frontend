'use client';

import { API_BASE_URL } from '@/services/api/api.constants';
import { useAppContext } from '../../context/AppContext';
import { BookOpen, ShoppingCart, ChevronDown, ChevronUp, Search, ExternalLink, FileText, Compass, BarChart, SlidersHorizontal, MessageSquare, Bell, Menu, GraduationCap, Layout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationScreen from '@/components/communication/NotificationScreen';
import ChatScreen from '@/components/communication/ChatScreen';
import { chatApiService, notificationApiService } from '@/services/api/api';

// TO THIS:
export default function Header({ onCartClick, onMenuClick }: { onCartClick?: () => void; onMenuClick?: () => void }) {
    const { user, logout, cart, searchTerm, setSearchTerm, unreadMessageCount, setUnreadMessageCount, unreadNotificationCount, setUnreadNotificationCount } = useAppContext();
    const pathname = usePathname();
    const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);



    // V V V V V REPLACE YOUR OLD useEffect WITH THIS ONE V V V V V
    useEffect(() => {
        // If there is no user, reset the counts and do nothing.
        if (!user) {
            setUnreadMessageCount(0);
            setUnreadNotificationCount(0);
            return;
        }

        const fetchData = async () => {
            try {
                // Use Promise.all to fetch both counts at the same time for better performance.
                const [messageData, notificationData] = await Promise.all([
                    chatApiService.getTotalUnreadCount(),
                    notificationApiService.getUnreadCount() // <-- You'll need to create this in your api service
                ]);

                // Update both global states with the numbers from the API.
                setUnreadMessageCount(messageData.count);
                setUnreadNotificationCount(notificationData.count);

            } catch (error) {
                console.error("Failed to fetch initial counts for header:", error);
            }
        };

        fetchData();
        // The dependency array tells React to re-run this when the user logs in/out.
    }, [user, setUnreadMessageCount, setUnreadNotificationCount]);

    const isActive = (path: string) => pathname.startsWith(path);
    const isTutorFinderPage = pathname.startsWith('/find-online-tutor');
    const shouldShowSearchBar = user?.role === 'student' || (user?.role === 'teacher' && !isTutorFinderPage);
    // Add this logic right before the return statement
    const fullProfileImageUrl = user?.profileImageUrl
        ? `${API_BASE_URL}${user.profileImageUrl}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=2563eb&color=fff&rounded=true`;

    return (
        <>
            <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* ===== START: ADD MENU BUTTON FOR MOBILE ===== */}
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white lg:hidden mr-2"
                        >
                            <Menu size={24} />
                        </button>
                        {/* ===== END: ADD MENU BUTTON ===== */}
                        {/* Left - Logo */}
                        <div className="flex items-center">


                            {/* Explore Dropdown */}

                        </div>

                        {/* Center - Search bar (students and teachers) - UNCHANGED */}
                        {/* --- MODIFICATION START --- */}
                        {/* This condition now uses the new, correct logic */}
                        {shouldShowSearchBar && (
                            <div className="flex-1 max-w-md mx-8 hidden md:block">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-full">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder={
                                                // This logic remains, but it's now inside a correctly controlled container
                                                isTutorFinderPage
                                                    ? "Search tutors by subject"
                                                    : user.role === 'teacher'
                                                        ? "Search by subject or form..."
                                                        : "Search lessons by topic..."
                                            }
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-700 border border-slate-600 rounded-md pl-9 pr-4 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    {isTutorFinderPage && (
                                        <button className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1.5 px-4 rounded-md transition flex items-center justify-center text-sm">
                                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                                            Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* --- MODIFICATION END --- */}

                        {/* Right - Cart and user info */}
                        {user && (
                            <div className="flex items-center space-x-12">
                                {/* --- NEW: Message Icon --- */}
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="relative text-slate-300 hover:text-white transition-colors">
                                    <MessageSquare className="h-6 w-6 cursor-pointer " />
                                    {/* Example of a number badge for new messages */}
                                    {unreadMessageCount > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                            {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                                        </span>
                                    )}
                                </button>
                                {/* --- NEW: Notification Icon --- */}
                                <button
                                    onClick={() => setIsNotificationsOpen(true)}
                                    className="relative text-slate-300 hover:text-white transition-colors">
                                    <Bell className="h-6 w-6 cursor-pointer " />
                                    {/* You can add a badge for new notifications */}
                                    {/* {unreadNotificationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                        </span>
                                    )} */}
                                    {/* V V V V V THIS IS THE CORRECTED BADGE CODE V V V V V */}
                                    {unreadNotificationCount > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                                        </span>
                                    )}
                                    {/* ^ ^ ^ ^ ^ END OF THE CORRECTED BADGE CODE ^ ^ ^ ^ ^ */}
                                </button>

                                {/* Cart icon (students only) - UNCHANGED */}
                                {user.role === 'student' && onCartClick && (
                                    <button onClick={onCartClick} className="relative text-slate-300 hover:text-white transition-colors">
                                        <ShoppingCart className="h-6 w-6 cursor-pointer " />
                                        {cart.length > 0 && (
                                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                                {cart.length}
                                            </span>
                                        )}
                                    </button>
                                )}

                                {/* User Dropdown */}
                                <div
                                    // MODIFICATION: Added padding-top to bridge the gap
                                    className="relative pt-2"
                                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                                >
                                    <button
                                        onMouseEnter={() => setIsUserDropdownOpen(true)}
                                        className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
                                    >
                                        {/* <span className="font-semibold text-white">{user.name}</span> */}
                                        <img
                                            src={fullProfileImageUrl} // Use the new variable here
                                            alt="User profile"
                                            className="h-10 w-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500"
                                        />
                                        {/* {isUserDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} */}
                                    </button>





                                    {/* <div
                                            // MODIFICATION: Removed margin-top (mt-2)
                                            className="absolute right-0 w-40 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700"
                                            onClick={() => setIsUserDropdownOpen(false)}
                                        > */}
                                    {/* <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
                                                <div className="text-xs text-blue-400 capitalize">{user.role}</div>
                                            </div> */}

                                    {/* Profile link */}
                                    {/* <Link
                                                href="/account"
                                                className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                            >
                                                Profile
                                            </Link> */}

                                    {/* Settings link */}
                                    {/* <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                            >
                                                Settings
                                            </Link> */}
                                    {/* <Link
                                                href="/help"
                                                className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                            >
                                                Help & Support
                                            </Link> */}

                                    {/* <button
                                                onClick={() => {
                                                    logout();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                            >
                                                Logout
                                            </button> */}
                                    {/* </div> */}

                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation - UNCHANGED */}
                    {/* --- MODIFICATION START --- */}
                    {/* This condition for the mobile view is also updated with the correct logic */}
                    {shouldShowSearchBar && (
                        <div className="flex md:hidden justify-center border-t border-slate-700 pt-2 pb-1 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
                            {/* Mobile Search */}
                            <div className="relative w-full max-w-md mb-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder={
                                        isTutorFinderPage
                                            ? "Search tutors by subject"
                                            : user.role === 'teacher'
                                                ? "Search your lessons..."
                                                : "Search lessons by topic..."
                                    }
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-md pl-9 pr-4 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                    {/* --- MODIFICATION END --- */}
                </div>
            </header>
            {isNotificationsOpen && <NotificationScreen onClose={() => setIsNotificationsOpen(false)} />}
            {isChatOpen && <ChatScreen onClose={() => setIsChatOpen(false)} />}
        </>
    );
}

