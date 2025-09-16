// app/admin/users/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { AdminApiService } from '@/services/api/admin-api.service';

type UserRole = 'teacher' | 'student' | 'admin';

interface UserFormData {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    password: string;
    role: UserRole;
}

export default function ManageUsersPage() {
    const adminApiService = new AdminApiService();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<UserRole | 'all'>('all');
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        password: '',
        role: 'teacher',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            console.log('Fetching users from backend...');
            const userList = await adminApiService.getAllUsers();
            console.log('Users fetched successfully:', userList);
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please check your connection and try again.');
            alert('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'role') {
            setFormData({ ...formData, [name]: value as UserRole });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            console.log('Creating user with data:', formData);
            const createdUser = await adminApiService.createUser(formData);
            console.log('User created successfully:', createdUser);
            alert('User created successfully!');
            fetchUsers(); // Refresh the list
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                dob: '',
                gender: '',
                password: '',
                role: 'teacher'
            });
        } catch (error: any) {
            console.error('Error creating user:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create user. Email may already be in use.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter users based on active tab
    const filteredUsers = activeTab === 'all'
        ? users
        : users.filter(user => user.role === activeTab);

    // Count users by role
    const userCounts = {
        all: users.length,
        admin: users.filter(user => user.role === 'admin').length,
        teacher: users.filter(user => user.role === 'teacher').length,
        student: users.filter(user => user.role === 'student').length,
    };

    return (
        <div className="container mx-auto p-8 pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create User Form */}
                <div className="lg:col-span-1">
                    <h1 className="text-3xl font-bold mb-6 text-slate-900">Create New User</h1>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full p-2 border rounded text-slate-900" />
                        <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-2 border rounded text-slate-900" />
                        <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full p-2 border rounded text-slate-900" />
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required className="w-full p-2 border rounded text-slate-900" />
                        <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required className="w-full p-2 border rounded text-slate-900" />
                        <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full p-2 border rounded text-slate-900">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select name="role" value={formData.role} onChange={handleInputChange} required className="w-full p-2 border rounded text-slate-900">
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold mb-6 text-slate-900">All Users</h1>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-200 mb-6">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All ({userCounts.all})
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'admin' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                            onClick={() => setActiveTab('admin')}
                        >
                            Admins ({userCounts.admin})
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'teacher' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                            onClick={() => setActiveTab('teacher')}
                        >
                            Teachers ({userCounts.teacher})
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'student' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                            onClick={() => setActiveTab('student')}
                        >
                            Students ({userCounts.student})
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {isLoading ? (
                            <p>Loading users...</p>
                        ) : filteredUsers.length === 0 ? (
                            <p>No {activeTab === 'all' ? '' : activeTab} users found.</p>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="p-2 border-b border-slate-300 text-slate-800">Name</th>
                                        <th className="p-2 border-b border-slate-300 text-slate-800">Email</th>
                                        <th className="p-2 border-b border-slate-300 text-slate-800">Role</th>
                                        <th className="p-2 border-b border-slate-300 text-slate-800">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td className="p-2 border-b border-slate-200 text-slate-700">{user.name}</td>
                                            <td className="p-2 border-b border-slate-200 text-slate-700">{user.email}</td>
                                            <td className="p-2 border-b border-slate-200 text-slate-700 capitalize">{user.role}</td>
                                            <td className="p-2 border-b border-slate-200 text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


// // app/admin/users/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { UserProfile } from '@/types';
// import { AdminApiService } from '@/services/api/admin-api.service';

// type UserRole = 'teacher' | 'student' | 'admin';

// interface UserFormData {
//     name: string;
//     email: string;
//     phone: string;
//     dob: string;
//     gender: string;
//     password: string;
//     role: UserRole;
// }

// export default function ManageUsersPage() {
//     const adminApiService = new AdminApiService();
//     const [users, setUsers] = useState<UserProfile[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [formData, setFormData] = useState<UserFormData>({
//         name: '',
//         email: '',
//         phone: '',
//         dob: '',
//         gender: '',
//         password: '',
//         role: 'teacher',
//     });

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             setIsLoading(true);
//             setError(null);
//             console.log('Fetching users from backend...');
//             const userList = await adminApiService.getAllUsers();
//             console.log('Users fetched successfully:', userList);
//             setUsers(userList);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setError('Failed to fetch users. Please check your connection and try again.');
//             alert('Failed to fetch users.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         if (name === 'role') {
//             setFormData({ ...formData, [name]: value as UserRole });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null);

//         try {
//             console.log('Creating user with data:', formData);
//             const createdUser = await adminApiService.createUser(formData);
//             console.log('User created successfully:', createdUser);
//             alert('User created successfully!');
//             fetchUsers(); // Refresh the list
//             // Reset form
//             setFormData({
//                 name: '',
//                 email: '',
//                 phone: '',
//                 dob: '',
//                 gender: '',
//                 password: '',
//                 role: 'teacher'
//             });
//         } catch (error: any) {
//             console.error('Error creating user:', error);
//             const errorMessage = error.response?.data?.message || 'Failed to create user. Email may already be in use.';
//             setError(errorMessage);
//             alert(errorMessage);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="container mx-auto p-8 pt-20">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Create User Form */}
//                 <div className="lg:col-span-1">
//                     <h1 className="text-3xl font-bold mb-6 text-slate-900">Create New User</h1>
//                     {error && (
//                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                             {error}
//                         </div>
//                     )}
//                     {/* <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
//                         <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full p-2 border rounded" />
//                         <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-2 border rounded" />
//                         <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full p-2 border rounded" />
//                         <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required className="w-full p-2 border rounded" />
//                         <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required className="w-full p-2 border rounded" />
//                         <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             <option value="">Select Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                         </select>
//                         <select name="role" value={formData.role} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             <option value="teacher">Teacher</option>
//                             <option value="student">Student</option>
//                             <option value="admin">Admin</option>
//                         </select>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
//                         >
//                             {isSubmitting ? 'Creating...' : 'Create User'}
//                         </button>
//                     </form> */}
//                     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
//                         <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full p-2 border rounded text-slate-900" />
//                         <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-2 border rounded text-slate-900" />
//                         <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full p-2 border rounded text-slate-900" />
//                         <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required className="w-full p-2 border rounded text-slate-900" />
//                         <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required className="w-full p-2 border rounded text-slate-900" />
//                         <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full p-2 border rounded text-slate-900">
//                             <option value="">Select Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                         </select>
//                         <select name="role" value={formData.role} onChange={handleInputChange} required className="w-full p-2 border rounded text-slate-900">
//                             <option value="teacher">Teacher</option>
//                             <option value="student">Student</option>
//                             <option value="admin">Admin</option>
//                         </select>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
//                         >
//                             {isSubmitting ? 'Creating...' : 'Create User'}
//                         </button>
//                     </form>
//                 </div>

//                 {/* Users List */}
//                 <div className="lg:col-span-2">
//                     <h1 className="text-3xl font-bold mb-6 text-slate-900">All Users</h1>
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         {isLoading ? (
//                             <p>Loading users...</p>
//                         ) : users.length === 0 ? (
//                             <p>No users found.</p>
//                         ) : (
//                             <table className="w-full text-left">
//                                 <thead>
//                                     <tr>
//                                         {/* Added text-slate-800 for dark text and border-slate-300 for a darker border */}
//                                         <th className="p-2 border-b border-slate-300 text-slate-800">Name</th>
//                                         <th className="p-2 border-b border-slate-300 text-slate-800">Email</th>
//                                         <th className="p-2 border-b border-slate-300 text-slate-800">Role</th>
//                                         <th className="p-2 border-b border-slate-300 text-slate-800">Joined</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {users.map(user => (
//                                         <tr key={user.id}>
//                                             {/* Added text-slate-700 for dark text and border-slate-200 for a darker border */}
//                                             <td className="p-2 border-b border-slate-200 text-slate-700">{user.name}</td>
//                                             <td className="p-2 border-b border-slate-200 text-slate-700">{user.email}</td>
//                                             <td className="p-2 border-b border-slate-200 text-slate-700 capitalize">{user.role}</td>
//                                             <td className="p-2 border-b border-slate-200 text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // app/admin/users/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { UserProfile } from '@/types';
// import { AdminApiService } from '@/services/api/admin-api.service';

// type UserRole = 'teacher' | 'student' | 'admin';

// interface UserFormData {
//     name: string;
//     email: string;
//     phone: string;
//     dob: string;
//     gender: string;
//     password: string;
//     role: UserRole;
// }

// export default function ManageUsersPage() {
//     const adminApiService = new AdminApiService();
//     const [users, setUsers] = useState<UserProfile[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [formData, setFormData] = useState<UserFormData>({
//         name: '',
//         email: '',
//         phone: '',
//         dob: '',
//         gender: '',
//         password: '',
//         role: 'teacher',
//     });

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             setIsLoading(true);
//             const userList = await adminApiService.getAllUsers();
//             setUsers(userList);
//         } catch (error) {
//             alert('Failed to fetch users.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         if (name === 'role') {
//             setFormData({ ...formData, [name]: value as UserRole });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await adminApiService.createUser(formData);
//             alert('User created successfully!');
//             fetchUsers();
//             setFormData({ name: '', email: '', phone: '', dob: '', gender: '', password: '', role: 'teacher' });
//         } catch (error) {
//             alert('Failed to create user. Email may already be in use.');
//         }
//     };

//     return (
//         <div className="container mx-auto p-8 pt-20">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Create User Form */}
//                 <div className="lg:col-span-1">
//                     <h1 className="text-3xl font-bold mb-6 text-slate-900">Create New User</h1>
//                     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
//                         <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full p-2 border rounded" />
//                         <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-2 border rounded" />
//                         <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full p-2 border rounded" />
//                         <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required className="w-full p-2 border rounded" />
//                         <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required className="w-full p-2 border rounded" />
//                         <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             <option value="">Select Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                         </select>
//                         <select name="role" value={formData.role} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             <option value="teacher">Teacher</option>
//                             <option value="student">Student</option>
//                             <option value="admin">Admin</option>
//                         </select>
//                         <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">Create User</button>
//                     </form>
//                 </div>

//                 {/* Users List */}
//                 <div className="lg:col-span-2">
//                     <h1 className="text-3xl font-bold mb-6 text-slate-900">All Users</h1>
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         {isLoading ? <p>Loading users...</p> : (
//                             <table className="w-full text-left">
//                                 <thead>
//                                     <tr>
//                                         <th className="p-2 border-b">Name</th>
//                                         <th className="p-2 border-b">Email</th>
//                                         <th className="p-2 border-b">Role</th>
//                                         <th className="p-2 border-b">Joined</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {users.map(user => (
//                                         <tr key={user.id}>
//                                             <td className="p-2 border-b">{user.name}</td>
//                                             <td className="p-2 border-b">{user.email}</td>
//                                             <td className="p-2 border-b capitalize">{user.role}</td>
//                                             <td className="p-2 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // app/admin/users/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { UserProfile } from '@/types';
// import { AdminApiService } from '@/services/api/admin-api.service';

// // --- 1. DEFINE A SPECIFIC TYPE FOR THE USER ROLE ---
// type UserRole = 'teacher' | 'student' | 'admin';

// // --- 2. DEFINE AN INTERFACE FOR THE FORM'S DATA ---
// interface UserFormData {
//     name: string;
//     email: string;
//     phone: string;
//     dob: string;
//     gender: string;
//     password: string;
//     role: UserRole;
// }

// export default function ManageUsersPage() {
//     const adminApiService = new AdminApiService();
//     const [users, setUsers] = useState<UserProfile[]>([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // --- 3. APPLY THE NEW TYPE TO YOUR FORMDATA STATE ---
//     const [formData, setFormData] = useState<UserFormData>({
//         name: '',
//         email: '',
//         phone: '',
//         dob: '',
//         gender: '',
//         password: '',
//         role: 'teacher', // Default role
//     });

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             setIsLoading(true);
//             const userList = await adminApiService.getAllUsers();
//             setUsers(userList);
//         } catch (error) {
//             alert('Failed to fetch users.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         // This ensures the 'role' value is correctly typed
//         if (name === 'role') {
//             setFormData({ ...formData, [name]: value as UserRole });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await adminApiService.createUser(formData);
//             alert('User created successfully!');
//             fetchUsers(); // Refresh the user list
//             // Reset form
//             setFormData({ name: '', email: '', phone: '', dob: '', gender: '', password: '', role: 'teacher' });
//         } catch (error) {
//             alert('Failed to create user. Email may already be in use.');
//         }
//     };

//     return (
//         <div className="container mx-auto p-8 pt-20">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Create User Form */}
//                 <div className="lg:col-span-1">
//                     <h1 className="text-3xl font-bold mb-6 text-slate-900">Create New User</h1>
//                     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
//                         <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full p-2 border rounded" />
//                         <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-2 border rounded" />
//                         <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full p-2 border rounded" />
//                         <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required className="w-full p-2 border rounded" />
//                         <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required className="w-full p-2 border rounded" />
//                         <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             <option value="">Select Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                         </select>
//                         <select name="role" value={formData.role} onChange={handleInputChange} required className="w-full p-2 border rounded">
//                             <option value="teacher">Teacher</option>
//                             <option value="student">Student</option>
//                             <option value="admin">Admin</option>
//                         </select>
//                         <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">Create User</button>
//                     </form>
//                 </div>

//                 {/* Users List */}
//                 <div className="lg:col-span-2">
//                     <h1 className="text-3xl font-bold mb-6 text-slate-900">All Users</h1>
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         {isLoading ? <p>Loading users...</p> : (
//                             <table className="w-full text-left">
//                                 <thead>
//                                     <tr>
//                                         <th className="p-2 border-b">Name</th>
//                                         <th className="p-2 border-b">Email</th>
//                                         <th className="p-2 border-b">Role</th>
//                                         <th className="p-2 border-b">Joined</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {users.map(user => (
//                                         <tr key={user.id}>
//                                             <td className="p-2 border-b">{user.name}</td>
//                                             <td className="p-2 border-b">{user.email}</td>
//                                             <td className="p-2 border-b capitalize">{user.role}</td>
//                                             <td className="p-2 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }