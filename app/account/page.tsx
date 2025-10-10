'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { User, Mail, Phone, Edit, Users, CalendarDays, PersonStanding } from 'lucide-react';
import Header from '@/components/common/Header';
import { userApiService } from '@/services/api/api';
import { API_BASE_URL } from '@/services/api/api.constants';


// Typed helper component
const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | undefined }) => (
    <div className="flex items-start py-4 border-b border-slate-700 last:border-b-0">
        <Icon className="h-6 w-6 text-slate-400 mt-1 mr-4 flex-shrink-0" />
        <div className="flex-grow">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-lg text-white font-medium">{value || 'Not provided'}</p>
        </div>
    </div>
);

export default function AccountPage() {
    const { user, setUser } = useAppContext();

    // --- START OF FIXES ---
    // 1. Explicitly type the state hooks to allow for 'File | null' and 'string | null'
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name,
        phone: user?.phone || '',
        dob: user?.dob ? user.dob.slice(0, 10) : '',
        gender: user?.gender || '',
    });



    const handleProfileUpdate = async () => {
        if (!user) return; // Guard against null user

        // checking to make sure the name is not empty.
        if (!formData.name) {
            setStatus('Name cannot be empty.');
            return; // Stop the function
        }

        // Create a new object that matches the required type.
        const payload = {
            name: formData.name,
            phone: formData.phone,
            dob: formData.dob,
            gender: formData.gender,
        };

        setStatus('Saving...');
        try {
            // send the new, safe 'payload' object to the API function.
            const updatedProfile = await userApiService.updateProfile(payload);

            if (setUser) {
                setUser({ ...user, ...updatedProfile });
            }

            setStatus('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setStatus(error instanceof Error ? error.message : 'Failed to update profile.');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            setStatus('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setStatus('Please select a file first.');
            return;
        }
        setStatus('Uploading...');
        try {
            const responseUser = await userApiService.uploadAvatar(selectedFile);
            const updatedUser = { ...user, ...responseUser };
            if (setUser) setUser(updatedUser);
            setStatus('Upload successful!');
            setImagePreview(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading image:', error);
            setStatus(error instanceof Error ? error.message : 'Error uploading image.');
        }
    };

    useEffect(() => {
        if (!user) {
            // A short delay to prevent flickering on fast reloads
            const timer = setTimeout(() => window.location.replace('/'), 100);
            return () => clearTimeout(timer);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading your profile...</p>
            </div>
        );
    }

    const fullProfileImageUrl = user.profileImageUrl
        ? `${API_BASE_URL}${user.profileImageUrl}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;

    const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">My Account</h1>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 bg-slate-800/50 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-shrink-0">
                                <img
                                    src={imagePreview || fullProfileImageUrl}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full object-cover border-4 border-slate-700"
                                />
                            </div>
                            <div className="flex-grow text-center sm:text-left">
                                <h2 className="text-3xl font-bold">{user.name}</h2>
                                <p className="text-slate-300">{user.email}</p>
                                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/png, image/jpeg"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer w-full sm:w-auto text-center px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-md transition"
                                    >
                                        Choose File
                                    </label>
                                    {selectedFile && (
                                        <button
                                            onClick={handleUpload}
                                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md font-semibold transition"
                                        >
                                            Upload Picture
                                        </button>
                                    )}
                                </div>
                                {status && <p className="mt-2 text-sm text-center sm:text-left">{status}</p>}
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                {isEditing ? (
                                    <>
                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            />
                                        </div>

                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            />
                                        </div>

                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            />
                                        </div>

                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Gender</label>
                                            <select

                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="prefer-not-to-say">Prefer not to say</option>
                                            </select>
                                        </div>

                                    </>
                                ) : (
                                    <>
                                        <ProfileDetail icon={User} label="Full Name" value={user.name} />
                                        <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />
                                        <ProfileDetail icon={CalendarDays} label="Date of Birth" value={user.dob?.slice(0, 10)} />
                                        <ProfileDetail icon={PersonStanding} label="Gender" value={user.gender} />
                                    </>
                                )}

                                <ProfileDetail icon={Mail} label="Email Address" value={user.email} />

                                <ProfileDetail icon={Users} label="Role" value={formattedRole} />

                            </div>
                        </div>

                        <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex justify-end">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
                                >
                                    <Edit className="h-5 w-5 mr-2" />
                                    Edit Profile
                                </button>
                            )}


                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}