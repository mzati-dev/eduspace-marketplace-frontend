'use client';

import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Header from '@/components/common/Header';
import SideMenu from '@/components/common/SideMenu';
import ChatScreen from '@/components/communication/ChatScreen';

export default function MessagesPage() {
    const { user } = useAppContext();
    const [isSideMenuOpen, setSideMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); // ===== ADD THIS =====
    const [showChat, setShowChat] = useState(true);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <SideMenu
                userRole={user.role}
                isOpen={isSideMenuOpen}
                onClose={() => setSideMenuOpen(false)}
                onMenuClick={() => setSideMenuOpen(true)}  // ===== ADD THIS =====
                onCollapse={setIsCollapsed}                // ===== ADD THIS =====
            />

            <div className={`transition-all duration-300 min-h-screen ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header
                    onMenuClick={() => setSideMenuOpen(true)}
                />
                <main className="h-[calc(100vh-4rem)] ">
                    {/* <ChatScreen onClose={() => { }} /> */}
                    {showChat && <ChatScreen onClose={() => setShowChat(false)} />}

                </main>
            </div>
            {/* Optional: button to reopen chat */}
            {!showChat && (
                <button
                    onClick={() => setShowChat(true)}
                    className="fixed bottom-5 right-5 p-3 bg-blue-600 rounded-full cursor-pointer"
                >
                    Open Chat
                </button>
            )}
        </div>
    );
}