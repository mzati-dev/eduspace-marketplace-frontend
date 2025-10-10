'use client';

import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
    ChevronRight,
    UserCircle,
    CreditCard,
    ShieldCheck,
    DatabaseZap,
    Trash2,
    FileText,
    Info
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';


const SettingsCategory = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-500 pl-3">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const SettingItem = ({ icon: Icon, title, description, href }: { icon: React.ElementType, title: string, description: string, href: string }) => (
    <Link
        href={href}
        className="flex items-center w-full text-left p-4 bg-slate-800 hover:bg-slate-700/50 transition-colors rounded-lg border border-slate-700/50"
    >
        <div className="p-3 bg-slate-700 rounded-full mr-4">
            <Icon className="h-6 w-6 text-blue-400" />
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-500" />
    </Link>
);

export default function SettingsPage() {
    const { user } = useAppContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                window.location.replace('/');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-10">Settings</h1>
                    <div className="space-y-12">


                        <SettingsCategory title="Account Management">
                            <SettingItem icon={UserCircle} title="Edit Profile" description="Update your name, bio, and personal information." href="/account" />
                            <SettingItem icon={ShieldCheck} title="Password & Security" description="Change your password and manage account security." href="/settings/security" />
                            <SettingItem icon={DatabaseZap} title="Manage Your Data" description="Download an archive of your information." href="/settings/data" />
                            <SettingItem icon={Trash2} title="Delete Account" description="Permanently delete your account and all data." href="/settings/delete-account" />
                        </SettingsCategory>

                        {/* Teacher-Only Payments */}
                        {/* {user.role === 'teacher' && (
                            <SettingsCategory title="Payments">
                                <SettingItem icon={CreditCard} title="Payout Details" description="Manage bank or mobile money details for payments." href="/settings/payouts" />
                            </SettingsCategory>
                        )} */}

                        {/* CORRECTED: A clean, simple place for reference docs */}
                        <SettingsCategory title="About & Legal">
                            <SettingItem icon={Info} title="About" description="View application version and company information." href="/settings/about" />
                            <SettingItem icon={FileText} title="Terms & Privacy Policy" description="Read our terms of service and privacy policy." href="/settings/legal" />
                        </SettingsCategory>

                    </div>
                </div>
            </main>
        </>
    );
}
