'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageCircle,
    User,
    Settings,
    BookOpen,
    LogOut,
    FileText,
    Info,
    Menu,
    ChevronLeft,
    ShoppingCart,
    GraduationCap,
    UserSearch,
    Library,
    BarChart
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function SideMenu({
    userRole,
    isOpen,
    onClose,
    onMenuClick,
    onCollapse
}: any) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useAppContext();

    const handleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) onCollapse(newState);
    };

    const studentMenuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Find Online Tutor', href: '/find-online-tutor', icon: UserSearch },
        { name: 'Library', href: '/resources', icon: Library },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
        { name: 'Profile', href: '/account', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Help & Support', href: '/help', icon: Info },
    ];

    const teacherMenuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Tutoring', href: '/find-online-tutor', icon: BarChart },
        { name: 'Library', href: '/resources', icon: Library },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
        { name: 'Profile', href: '/account', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Help & Support', href: '/help', icon: Info },
    ];

    const menuItems = userRole === 'student' ? studentMenuItems : teacherMenuItems;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Mobile Hamburger Button - STAYS HERE */}
            {!isOpen && (
                <button
                    onClick={onMenuClick}
                    className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white lg:hidden"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Side menu */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen bg-slate-800 border-r border-slate-700
                transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo/Header with desktop collapse button */}
                    <div className="p-6 border-b border-slate-700 relative">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-2`}>
                            <div className="relative h-10 w-10 flex-shrink-0">
                                <Image
                                    src="/edumarketplacelogo.png"
                                    alt="Eduspace Marketplace Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            {!isCollapsed && (
                                <h1 className="text-xl font-bold text-white">Eduspace Marketplace</h1>
                            )}
                        </div>
                        {/* Role text and hamburger button side by side */}
                        <div className="flex items-center justify-between">
                            {!isCollapsed && (
                                <p className="text-sm text-slate-400 capitalize">
                                    {userRole} Dashboard
                                </p>
                            )}

                            {/* Desktop hamburger button - next to role text */}
                            {/* <button
                                onClick={handleCollapse}
                                className="hidden lg:flex items-center justify-center w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full border border-slate-600 cursor-pointer"
                            >
                                <Menu size={20} className="text-white" />
                            </button> */}
                        </div>


                        {/* Desktop collapse button - THIS IS THE DESKTOP HAMBURGER */}
                        <button
                            onClick={handleCollapse}
                            className="hidden lg:flex absolute -right-3 top-8 bg-slate-700 hover:bg-slate-600 rounded-full p-1 border border-slate-600 cursor-pointer"
                        >
                            <ChevronLeft className={`h-4 w-4 text-white transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                        </button>


                    </div>

                    {/* Mobile close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white lg:hidden"
                    >
                        ✕
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 p-4  overflow-y-auto">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                flex items-center rounded-lg transition-colors duration-200
                                                ${isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-4 py-3'}
                                                ${isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                                }
                                            `}
                                            onClick={() => {
                                                if (window.innerWidth < 1024) onClose();
                                            }}
                                            title={isCollapsed ? item.name : ''}
                                        >
                                            <Icon size={20} />
                                            {!isCollapsed && <span>{item.name}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout button */}
                    <div className="p-4 border-t border-slate-700 mb-6">
                        <button
                            onClick={() => {
                                logout();
                            }}
                            className={`
                            flex items-center rounded-lg transition-colors duration-200 w-full
                            ${isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-4 py-3'}
                            text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer
                        `}>
                            <LogOut size={20} />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}