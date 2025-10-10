'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { userApiService } from '@/services/api/api';


export default function DeleteAccountPage() {
    const { user, logout } = useAppContext();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState('');

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();


        if (confirmation !== user?.email) {
            setError(`Please type your email "${user?.email}" to confirm.`);
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {

            await userApiService.deleteAccount();


            if (logout) logout();
            window.location.replace('/');

        } catch (err: any) {
            setError(err.message || 'Failed to delete account.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-slate-900"></div>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Delete Account</h1>

                    <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 text-red-400 mt-1" />
                        <div>
                            <h2 className="font-bold text-lg text-red-300">This action is irreversible.</h2>
                            <p className="text-red-400 mt-1">
                                When you delete your account, all of your data will be permanently removed. This cannot be undone.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleDelete}>

                        <label htmlFor="confirmation" className="block font-semibold text-slate-300 mb-2">
                            To confirm, please type your email:
                            <span className="font-bold text-white ml-2">{user.email}</span>
                        </label>
                        <input
                            type="email"
                            id="confirmation"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md px-4 py-2 mb-6"

                            placeholder="Type your email here"
                        />

                        <button
                            type="submit"

                            disabled={isDeleting || confirmation !== user.email}
                            className="w-full bg-red-600 hover:bg-red-700 font-semibold py-3 px-5 rounded-md transition flex items-center justify-center disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Deleting Account...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-5 w-5 mr-2" />
                                    Permanently Delete My Account
                                </>
                            )}
                        </button>
                        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                    </form>
                </div>
            </main>
        </>
    );
}
