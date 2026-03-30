'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, GraduationCap, Briefcase, X, EyeOff, Eye, Search, Laptop, Users, Library as LibraryIcon, ChevronRight, ChevronDown, Menu, DollarSign, Star, ShoppingCart, Clock, PlayCircle, MessageSquare, Code2, School } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { AuthApiService } from '@/services/auth.service';
import { UserProfile } from '@/types';
import { API_BASE_URL } from '@/services/api/api.constants';
import { lessonsApiService } from '@/services/api/api';
import { ProfileApiService } from '@/services/api/profile-api.service';
import ResourcesPage from './resources/page';
import PublicLibrary from './resources/public-library/PublicLibrary';
import CareersPage from './career-hub/career/CareersPage';
import CertificationsPage from './career-hub/certification/CertificationsPage';
import JobsPage from './career-hub/jobs/JobsPage';
import ScholarshipsPage from './career-hub/scholarship/ScholarshipsPage';
import CodeLabPage from './learn/CodeLabPage';
import GadgetsPage from './learn/GadgetsPage';

type AuthView = 'login' | 'signup' | 'forgotPassword' | 'none';
type SignupStage = 'role-selection' | 'form';
// type TabView = 'library' | 'codeLab' | 'careers' | 'certifications' | 'gadgets' | 'primary' | 'secondary' | 'tutors' | 'jobs' | 'scholarships' | 'lessons';
type TabView = 'library' | 'codeLab' | 'careers' | 'certifications' | 'gadgets' | 'primaryLessons' | 'secondaryLessons' | 'primaryTutors' | 'secondaryTutors' | 'tutors' | 'jobs' | 'scholarships' | 'lessons';
export default function App() {
    const [authView, setAuthView] = useState<AuthView>('none');
    const [activeTab, setActiveTab] = useState<TabView>('lessons');
    const [expandedMenu, setExpandedMenu] = useState<TabView | null>('lessons');
    const [selectedLevel, setSelectedLevel] = useState<string>(''); // Added state to make dropdowns "work"

    const [signupData, setSignupData] = useState({
        name: '', email: '', phone: '', dob: '', gender: '', password: '', confirmPassword: ''
    });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
    const [signupStage, setSignupStage] = useState<SignupStage>('role-selection');
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [lessons, setLessons] = useState<any[]>([]);
    const [lessonsLoading, setLessonsLoading] = useState(true);
    const [tutors, setTutors] = useState<any[]>([]);
    const [tutorsLoading, setTutorsLoading] = useState(true);
    const [libraryLevel, setLibraryLevel] = useState<'primary' | 'secondary'>('primary');

    const [careerHubTab, setCareerHubTab] = useState<'careers' | 'certifications' | 'jobs' | 'scholarships'>('careers');
    const [codelabTrack, setCodelabTrack] = useState<'programming' | 'ai' | 'digital'>('programming');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { login, user, addToCart } = useAppContext();
    const authService = new AuthApiService();
    const router = useRouter();




    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLessonsLoading(true);
                const data = await lessonsApiService.getAllLessons();
                setLessons(data);
            } catch (error) {
                console.error('Failed to fetch lessons:', error);
                setLessons([]);
            } finally {
                setLessonsLoading(false);
            }
        };

        fetchLessons();
    }, []);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                setTutorsLoading(true);
                const profileService = new ProfileApiService();
                const data = await profileService.getAllTutors();
                setTutors(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch tutors:', error);
                setTutors([]);
            } finally {
                setTutorsLoading(false);
            }
        };
        fetchTutors();
    }, []);

    useEffect(() => {
        const handleRedirect = (profile: UserProfile) => {
            if (profile.role === 'admin') {
                router.replace('/admin/reviews');
            } else {
                router.replace('/dashboard');
            }
        };

        const token = localStorage.getItem('token');
        if (token && !user) {
            authService.getProfile()
                .then(profile => {
                    login(profile);
                    handleRedirect(profile);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setLoading(false);
                });
        } else if (user) {
            handleRedirect(user);
        } else {
            setLoading(false);
        }
    }, [user]);

    const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        if (typeof error === 'string') return error;
        return 'An unexpected error occurred';
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            await authService.register({
                ...signupData,
                role: selectedRole
            });
            setAuthView('login');
            setSignupStage('role-selection');
            setSignupData({
                name: '', email: '', phone: '', dob: '', gender: '', password: '', confirmPassword: ''
            });
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const loginResponse = await authService.login(loginData.email, loginData.password);
            localStorage.setItem('token', loginResponse.token);
            const userProfile = await authService.getProfile();
            login(userProfile);
        } catch (error) {
            alert(getErrorMessage(error));
        } finally {
            setLoginLoading(false);
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(forgotEmail);
            alert(`Password reset link sent to ${forgotEmail}`);
            setAuthView('login');
        } catch (error) {
            alert(getErrorMessage(error));
        } finally {
            setLoginLoading(false);
        }
    };

    const requireLogin = () => {
        setAuthView('login');
    };

    const sharedInputClasses = "w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm";

    const mainMenus = [

        {
            id: 'marketplace',
            label: 'Marketplace',
            icon: ShoppingCart,
            items: [
                { id: 'primaryLessons', label: 'Primary', icon: School },
                { id: 'secondaryLessons', label: 'Secondary', icon: GraduationCap },
            ]
        },
        {
            id: 'tutorsMenu',
            label: 'Find a Tutor',
            icon: Users,
            items: [
                { id: 'primaryTutors', label: 'Primary', icon: School },
                { id: 'secondaryTutors', label: 'Secondary', icon: GraduationCap },
            ]
        },

        {
            id: 'learn',
            label: 'Learn',
            icon: BookOpen,
            items: [
                { id: 'library', label: 'Library', icon: LibraryIcon },
                { id: 'codeLab', label: 'CodeLab', icon: Code2, isNew: true },
                { id: 'gadgets', label: 'Get a Device', icon: Laptop },
            ]
        },
        {
            id: 'careerHubMenu',
            label: 'Career Hub',
            icon: Briefcase,
            items: [
                { id: 'careers', label: 'Careers', icon: Briefcase },
                { id: 'certifications', label: 'Certifications', icon: GraduationCap },
                { id: 'jobs', label: 'Jobs', icon: Briefcase },
                { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
            ]
        },
    ];

    const [expandedMainMenu, setExpandedMainMenu] = useState<string | null>('learn');

    const educationLevels = ['Primary School', 'Secondary', 'Tertiary', 'Vocational'];

    const toggleSidebarMenu = (id: TabView) => {
        setActiveTab(id);
        // Toggle dropdown open/close logic
        if (expandedMenu === id) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(id);
        }
    };

    const handleLevelSelect = (level: string) => {
        setSelectedLevel(level);
        // Here you could also trigger a data fetch based on the selected level
    };

    const renderAuthContent = () => {
        switch (authView) {
            case 'forgotPassword':
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-center mb-2 text-white">Reset Password</h2>
                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                            <input type="email" placeholder="Email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className={sharedInputClasses} required />
                            <button type="submit" className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition">Send Reset Link</button>
                            <button type="button" onClick={() => setAuthView('login')} className="w-full px-8 py-3 border-2 border-blue-500 hover:bg-blue-500/20 rounded-lg font-semibold shadow-lg transition">Back to Login</button>
                        </form>
                    </div>
                );
            case 'login':
                return (
                    <>
                        <div className="flex justify-center mb-6 border-b border-slate-700/50">
                            <button onClick={() => setAuthView('login')} className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}>Login</button>
                            <button onClick={() => setAuthView('signup')} className="px-6 py-2 text-lg font-semibold text-slate-300 transition-colors">Sign Up</button>
                        </div>
                        <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                            <input type="email" placeholder="Email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} className={sharedInputClasses} required />
                            <div className="relative">
                                <input type={showLoginPassword ? "text" : "password"} placeholder="Password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} className={`${sharedInputClasses} pr-10`} required />
                                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                                    {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="text-right">
                                <button type="button" onClick={() => setAuthView('forgotPassword')} className="text-sm text-blue-400 hover:underline cursor-pointer">Forgot Password?</button>
                            </div>
                            <button type="submit" className={`w-full px-8 py-3 rounded-lg font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition ${loginLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`} disabled={loginLoading}>
                                {loginLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </>
                );
            case 'signup':
                if (signupStage === 'role-selection') {
                    return (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-center mb-6 text-white">Select Your Role</h2>
                            <div className="space-y-4 mb-6">
                                <label className="flex items-center space-x-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="role" checked={selectedRole === 'student'} onChange={() => setSelectedRole('student')} className="h-5 w-5 text-blue-500" />
                                    <div className="flex items-center"><GraduationCap className="h-6 w-6 mr-2" /><span className="font-medium">Student</span></div>
                                </label>
                                <label className="flex items-center space-x-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700 transition">
                                    <input type="radio" name="role" checked={selectedRole === 'teacher'} onChange={() => setSelectedRole('teacher')} className="h-5 w-5 text-blue-500" />
                                    <div className="flex items-center"><Briefcase className="h-6 w-6 mr-2" /><span className="font-medium">Teacher</span></div>
                                </label>
                            </div>
                            <button onClick={() => setSignupStage('form')} className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition cursor-pointer">Continue</button>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-center mb-4 border-b border-slate-700/50">
                                <button onClick={() => setAuthView('login')} className="px-6 py-2 text-lg font-semibold text-slate-300">Login</button>
                                <button onClick={() => setAuthView('signup')} className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'signup' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}>Sign Up</button>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2">
                                <form onSubmit={handleSignupSubmit} className="space-y-4 pb-4">
                                    <input type="text" placeholder="Full Name" value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })} className={sharedInputClasses} required />
                                    <input type="email" placeholder="Email" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} className={sharedInputClasses} required />
                                    <input type="tel" placeholder="Phone Number" value={signupData.phone} onChange={e => setSignupData({ ...signupData, phone: e.target.value })} className={sharedInputClasses} required />
                                    <input type="date" value={signupData.dob} onChange={e => setSignupData({ ...signupData, dob: e.target.value })} className={sharedInputClasses} required />
                                    <select value={signupData.gender} onChange={e => setSignupData({ ...signupData, gender: e.target.value })} className={sharedInputClasses} required>
                                        <option value="" className="bg-slate-800">Select Gender</option>
                                        <option value="male" className="bg-slate-800">Male</option>
                                        <option value="female" className="bg-slate-800">Female</option>
                                        <option value="other" className="bg-slate-800">Other</option>
                                        <option value="prefer-not-to-say" className="bg-slate-800">Prefer not to say</option>
                                    </select>
                                    <div className="relative">
                                        <input type={showSignupPassword ? "text" : "password"} placeholder="Password" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} className={`${sharedInputClasses} pr-10`} required />
                                        <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                                            {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={signupData.confirmPassword} onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })} className={`${sharedInputClasses} pr-10`} required />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <button type="submit" onClick={handleSignupSubmit} className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition mt-4 cursor-pointer">Create Account</button>
                        </div>
                    );
                }
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
    }

    const TutorCard = ({ tutor }: { tutor: any }) => {
        const fullAvatarUrl = tutor.user?.profileImageUrl ? `${API_BASE_URL}${tutor.user.profileImageUrl}` : null;
        const nameParts = tutor.name?.split(' ') || [];
        const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

        const handleContact = () => {
            requireLogin(); // Show login modal for public users
        };

        return (
            <div className="bg-slate-800 border border-slate-700 flex rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="p-6 flex flex-col h-full w-full">
                    <div className="flex items-center mb-4">
                        {fullAvatarUrl ? (
                            <img
                                src={fullAvatarUrl}
                                alt={tutor.name}
                                className="h-16 w-16 rounded-full object-cover flex-shrink-0 mr-4"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
                                {tutor.name?.split(' ').pop()?.[0] || '?'}
                            </div>
                        )}

                        <div>
                            <h3 className="text-xl font-bold text-white">{`${tutor.title || ''} ${surname}`}</h3>
                            <div className="flex items-center text-sm text-yellow-400 mt-1">
                                {/* Rating stars - uncomment when you have rating data */}
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{tutor.bio || 'Experienced tutor'}</p>

                    <div className='mt-auto'>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tutor.subjects?.map((subject: string) => (
                                <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {subject}
                                </span>
                            ))}
                        </div>

                        {tutor.monthlyRate && (
                            <div className="border-t border-slate-700 pt-4 my-4">
                                <div className="flex justify-center items-center gap-2 text-slate-300">
                                    <span className="text-sm font-bold text-white">
                                        <span className="h-5 w-5 text-green-400">MWK </span>
                                        {tutor.monthlyRate.toLocaleString()}
                                    </span>
                                    <span className="text-slate-400">monthly / subject</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleContact}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-lg font-semibold shadow-lg transition flex items-center justify-center"
                        >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact {`${tutor.title || ''} ${surname}`}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (

        <div className="h-screen overflow-hidden bg-slate-900 text-white font-sans relative">

            {/* PUBLIC NAVBAR W/ SEARCH IN HEADER */}
            <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 h-[80px] flex items-center">
                <div className="w-full px-6 flex justify-between items-center gap-6">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2 min-w-max">
                        <Menu
                            className="h-6 w-6 text-slate-400 md:hidden cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                        {/* <BookOpen className="h-8 w-8 text-blue-500" />  //edumarketplacelogo.png */}
                        <img
                            src="/edumarketplacelogo.png"
                            alt="Eduspace Marketplace Logo"
                            className="h-12 w-12 object-contain"
                        />
                        <h1 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight whitespace-nowrap">
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                EduSpace
                            </span>
                            <span className="text-orange-400"> Hub</span>
                        </h1>
                    </div>

                    {/* RESTORED: Beautiful Glassmorphism Search Bar */}
                    <div className="flex-1 max-w-2xl hidden md:block">
                        <div className="w-full flex items-center bg-slate-800/80 border border-slate-600/50 hover:border-slate-500 rounded-full p-1.5 shadow-xl backdrop-blur-md focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
                            <Search className="text-slate-400 ml-3 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search for subjects, tutors, or gadgets..."
                                className="flex-1 bg-transparent border-none text-white px-3 py-2 text-sm md:text-base focus:outline-none placeholder-slate-500"
                            />
                            <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-bold shadow-lg transition cursor-pointer text-sm">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4 min-w-max">
                        <button onClick={() => setAuthView('login')} className="font-semibold text-sm text-slate-300 hover:text-white transition cursor-pointer">Log In</button>
                        <button onClick={() => { setAuthView('signup'); setSignupStage('role-selection'); }} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition cursor-pointer">Sign Up</button>
                    </div>
                </div>
            </nav>

            {/* MAIN LAYOUT WRAPPER (SIDEBAR + CONTENT) */}
            <div className="flex flex-1 h-[calc(100vh-80px)]">








                {/* SIDEBAR */}

                {/* Mobile Overlay Background */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}


                {/* SIDEBAR */}
                <aside className={`
    fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    md:relative md:translate-x-0 md:flex
    w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto custom-scrollbar
`}>
                    <div className="p-4 space-y-2 flex-1">
                        {mainMenus.map((menu) => (
                            <div key={menu.id} className="space-y-1">
                                <button
                                    //   onClick={() => setExpandedMainMenu(expandedMainMenu === menu.id ? null : menu.id)}  
                                    onClick={() => {
                                        setExpandedMainMenu(expandedMainMenu === menu.id ? null : menu.id);
                                        if (menu.id === 'marketplace') {
                                            setActiveTab('primaryLessons');
                                        }
                                        if (menu.id === 'tutorsMenu') {
                                            setActiveTab('primaryTutors');
                                        }
                                        if (menu.id === 'learn') {
                                            setActiveTab('library');
                                        }
                                        if (menu.id === 'careerHubMenu') {
                                            setActiveTab('careers');
                                        }
                                    }}
                                    className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors cursor-pointer text-slate-300 hover:bg-slate-800`}
                                >
                                    <div className="flex items-center gap-3">
                                        <menu.icon className="h-5 w-5 text-slate-400" />
                                        <span className="font-medium">{menu.label}</span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMainMenu === menu.id ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedMainMenu === menu.id && (
                                    <div className="pl-11 pr-3 py-2 space-y-1 animate-fade-in border-l-2 border-slate-800 ml-4">
                                        {menu.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id as TabView)}
                                                className={`w-full text-left text-sm py-2 px-2 rounded-md transition-all cursor-pointer ${activeTab === item.id ? 'text-blue-400 bg-blue-500/10 font-medium translate-x-1' : 'text-slate-400 hover:text-white hover:bg-slate-800 hover:translate-x-1'}`}
                                            >
                                                {item.label}
                                                {item.isNew && <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-blue-500/30 ml-2">New</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Teach & Earn button - separate, not in dropdown */}
                        <button
                            onClick={() => {
                                setAuthView('signup');
                                setSignupStage('role-selection');
                                setSelectedRole('teacher');
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white font-medium mt-4 border border-green-500/30"
                        >
                            <GraduationCap className="h-5 w-5 text-green-500" />
                            Teach & Earn
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 relative overflow-y-auto custom-scrollbar">

                    {/* BACKGROUND GLOW */}
                    <div className="absolute top-0 left-0 w-full h-[600px] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="pb-20">


                        {/* DYNAMIC CONTENT AREA */}
                        <div className="relative z-10 min-h-[400px] px-6">

                            {/* LESSONS VIEW */}
                            {/* LESSONS VIEW */}
                            {/* LESSONS VIEW */}
                            {/* LESSONS VIEW */}
                            {(activeTab === 'lessons' || activeTab === 'primaryLessons') && (
                                <>
                                    <div className="text-center pt-4">
                                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                                            Unlock Your Full Potential
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">

                                        {lessonsLoading ? (
                                            <div className="col-span-2 text-center py-10 text-slate-400">Loading lessons...</div>
                                        ) : lessons.length === 0 ? (
                                            <div className="col-span-2 text-center py-10 text-slate-400">No lessons available</div>
                                        ) : (
                                            lessons.map((lesson) => {
                                                // Format teacher name - FIXED
                                                const teacherName = lesson.teacherName || lesson.teacher?.name || 'Instructor';
                                                const nameParts = teacherName.split(' ');
                                                let formattedTeacherName = teacherName;
                                                if (nameParts.length > 1) {
                                                    const firstNameInitial = nameParts[0][0];
                                                    const surname = nameParts[nameParts.length - 1];
                                                    formattedTeacherName = `${firstNameInitial}. ${surname}`;
                                                }

                                                return (
                                                    <div key={lesson.id} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 flex flex-col">
                                                        {/* Lesson content */}
                                                        <div className="p-5 flex-grow">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                                                                {lesson.averageRating && (
                                                                    <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-xs text-yellow-400 flex-shrink-0">
                                                                        <Star className="w-3 h-3 fill-current" />
                                                                        <span>{lesson.averageRating.toFixed(1)}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{lesson.description || lesson.subject}</p>

                                                            {/* Lesson tags */}
                                                            <div className="flex justify-between items-center mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                                                        {lesson.subject}
                                                                    </span>
                                                                    <span className="text-slate-500">|</span>
                                                                    <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                                                        {lesson.form}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                                                    By {formattedTeacherName}
                                                                </span>
                                                            </div>

                                                            {/* Duration and price */}
                                                            <div className="flex justify-between items-center text-sm text-slate-300 border-t border-slate-700 pt-3 mt-auto">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{lesson.durationMinutes || 60} min</span>
                                                                </div>
                                                                <span className="text-xl font-bold text-white">
                                                                    <span className="h-5 w-5 text-green-400">MWK </span>{(typeof lesson.price === 'number' ? lesson.price : Number(lesson.price) || 0).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Action buttons - Show for everyone (not just students) */}
                                                        <div className="p-3 bg-slate-900/50">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        const token = localStorage.getItem('token');
                                                                        if (token && user) {
                                                                            addToCart(lesson);
                                                                        } else {
                                                                            requireLogin();
                                                                        }
                                                                    }}
                                                                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition flex items-center justify-center cursor-pointer"
                                                                >
                                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                                    Add to Cart
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const token = localStorage.getItem('token');
                                                                        if (token && user) {
                                                                            addToCart(lesson);
                                                                            router.push(`/lesson/${lesson.id}`);
                                                                        } else {
                                                                            requireLogin();
                                                                        }
                                                                    }}
                                                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition flex items-center justify-center cursor-pointer"
                                                                >
                                                                    Buy Now
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </>
                            )}

                            {(activeTab === 'lessons' || activeTab === 'secondaryLessons') && (
                                <>
                                    <div className="text-center pt-4">
                                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                                            Unlock Your Full Potential
                                        </h1>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">

                                        {lessonsLoading ? (
                                            <div className="col-span-2 text-center py-10 text-slate-400">Loading lessons...</div>
                                        ) : lessons.length === 0 ? (
                                            <div className="col-span-2 text-center py-10 text-slate-400">No lessons available</div>
                                        ) : (
                                            lessons.map((lesson) => {
                                                // Format teacher name - FIXED
                                                const teacherName = lesson.teacherName || lesson.teacher?.name || 'Instructor';
                                                const nameParts = teacherName.split(' ');
                                                let formattedTeacherName = teacherName;
                                                if (nameParts.length > 1) {
                                                    const firstNameInitial = nameParts[0][0];
                                                    const surname = nameParts[nameParts.length - 1];
                                                    formattedTeacherName = `${firstNameInitial}. ${surname}`;
                                                }

                                                return (
                                                    <div key={lesson.id} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 flex flex-col">
                                                        {/* Lesson content */}
                                                        <div className="p-5 flex-grow">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                                                                {lesson.averageRating && (
                                                                    <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-xs text-yellow-400 flex-shrink-0">
                                                                        <Star className="w-3 h-3 fill-current" />
                                                                        <span>{lesson.averageRating.toFixed(1)}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{lesson.description || lesson.subject}</p>

                                                            {/* Lesson tags */}
                                                            <div className="flex justify-between items-center mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                                                        {lesson.subject}
                                                                    </span>
                                                                    <span className="text-slate-500">|</span>
                                                                    <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                                                        {lesson.form}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                                                    By {formattedTeacherName}
                                                                </span>
                                                            </div>

                                                            {/* Duration and price */}
                                                            <div className="flex justify-between items-center text-sm text-slate-300 border-t border-slate-700 pt-3 mt-auto">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{lesson.durationMinutes || 60} min</span>
                                                                </div>
                                                                <span className="text-xl font-bold text-white">
                                                                    <span className="h-5 w-5 text-green-400">MWK </span>{(typeof lesson.price === 'number' ? lesson.price : Number(lesson.price) || 0).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Action buttons - Show for everyone (not just students) */}
                                                        <div className="p-3 bg-slate-900/50">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        const token = localStorage.getItem('token');
                                                                        if (token && user) {
                                                                            addToCart(lesson);
                                                                        } else {
                                                                            requireLogin();
                                                                        }
                                                                    }}
                                                                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition flex items-center justify-center cursor-pointer"
                                                                >
                                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                                    Add to Cart
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const token = localStorage.getItem('token');
                                                                        if (token && user) {
                                                                            addToCart(lesson);
                                                                            router.push(`/lesson/${lesson.id}`);
                                                                        } else {
                                                                            requireLogin();
                                                                        }
                                                                    }}
                                                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition flex items-center justify-center cursor-pointer"
                                                                >
                                                                    Buy Now
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </>
                            )}

                            {/* TUTORS VIEW */}
                            {/* {activeTab === 'tutors' && (
                                <div className="animate-fade-in text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                                    <Users className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold mb-2">Find Your Perfect Tutor</h2>
                                    <p className="text-slate-400 max-w-md mx-auto mb-6">Connect with vetted experts for 1-on-1 virtual or in-person sessions.</p>
                                    <button onClick={requireLogin} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition cursor-pointer">
                                        Browse Tutor Directory
                                    </button>
                                </div>
                            )} */}
                            {/* TUTORS VIEW */}
                            {(activeTab === 'tutors' || activeTab === 'primaryTutors') && (
                                <div>
                                    <div className="text-center pt-4">
                                        <h1 className="text-2xl md:text-4xl font-extrabold mb-3">Find Your Perfect Tutor</h1>
                                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Search for qualified tutors by subject and connect with them for online lessons.</p>
                                    </div>

                                    {tutorsLoading ? (
                                        <div className="text-center py-20 text-slate-400">Loading tutors...</div>
                                    ) : tutors.length === 0 ? (
                                        <div className="text-center py-20 text-slate-400">No tutors available</div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                                            {tutors.map((tutor) => (
                                                <TutorCard key={tutor.id} tutor={tutor} />
                                            ))}
                                        </div>
                                    )}

                                    {/* How It Works Section */}
                                    <div className="text-center mt-20 py-12 bg-slate-800/50 rounded-lg">
                                        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                                        <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
                                            <div className="flex-1 max-w-xs mx-auto">
                                                <div className="text-3xl font-bold text-blue-400 mb-2">1.</div>
                                                <h3 className="text-xl font-semibold mb-2">Search & Find</h3>
                                                <p className="text-slate-400">Find tutors who specialize in the subject you need help with.</p>
                                            </div>
                                            <div className="flex-1 max-w-xs mx-auto">
                                                <div className="text-3xl font-bold text-blue-400 mb-2">2.</div>
                                                <h3 className="text-xl font-semibold mb-2">Contact & Schedule</h3>
                                                <p className="text-slate-400">Message a tutor and arrange a time that works for you.</p>
                                            </div>
                                            <div className="flex-1 max-w-xs mx-auto">
                                                <div className="text-3xl font-bold text-blue-400 mb-2">3.</div>
                                                <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
                                                <p className="text-slate-400">Meet your tutor and start improving your skills.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'tutors' || activeTab === 'secondaryTutors') && (
                                <div>
                                    <div className="text-center pt-4">
                                        <h1 className="text-2xl md:text-4xl font-extrabold mb-3">Find Your Perfect Tutor</h1>
                                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Search for qualified tutors by subject and connect with them for online lessons.</p>
                                    </div>

                                    {tutorsLoading ? (
                                        <div className="text-center py-20 text-slate-400">Loading tutors...</div>
                                    ) : tutors.length === 0 ? (
                                        <div className="text-center py-20 text-slate-400">No tutors available</div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                                            {tutors.map((tutor) => (
                                                <TutorCard key={tutor.id} tutor={tutor} />
                                            ))}
                                        </div>
                                    )}

                                    {/* How It Works Section */}
                                    <div className="text-center mt-20 py-12 bg-slate-800/50 rounded-lg">
                                        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                                        <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
                                            <div className="flex-1 max-w-xs mx-auto">
                                                <div className="text-3xl font-bold text-blue-400 mb-2">1.</div>
                                                <h3 className="text-xl font-semibold mb-2">Search & Find</h3>
                                                <p className="text-slate-400">Find tutors who specialize in the subject you need help with.</p>
                                            </div>
                                            <div className="flex-1 max-w-xs mx-auto">
                                                <div className="text-3xl font-bold text-blue-400 mb-2">2.</div>
                                                <h3 className="text-xl font-semibold mb-2">Contact & Schedule</h3>
                                                <p className="text-slate-400">Message a tutor and arrange a time that works for you.</p>
                                            </div>
                                            <div className="flex-1 max-w-xs mx-auto">
                                                <div className="text-3xl font-bold text-blue-400 mb-2">3.</div>
                                                <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
                                                <p className="text-slate-400">Meet your tutor and start improving your skills.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* LIBRARY VIEW */}
                            {/* {activeTab === 'library' && (
                                <div className="animate-fade-in text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                                    <BookOpen className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold mb-2">Digital Library</h2>
                                    <p className="text-slate-400 max-w-md mx-auto mb-6">Access thousands of past papers, study guides, and digital textbooks.</p>
                                    <button onClick={requireLogin} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition cursor-pointer">
                                        Access Library
                                    </button>
                                </div>
                            )} */}
                            {activeTab === 'library' && (
                                <PublicLibrary selectedLevel={libraryLevel} />
                            )}


                            {/* CODELAB VIEW */}
                            {/* CODELAB VIEW */}
                            {activeTab === 'codeLab' && (
                                <CodeLabPage onRequireLogin={requireLogin} />
                            )}

                            {/* CAREERS VIEW */}
                            {activeTab === 'careers' && (
                                <CareersPage onRequireLogin={requireLogin} />
                            )}

                            {/* CERTIFICATIONS VIEW */}
                            {activeTab === 'certifications' && (
                                <CertificationsPage onRequireLogin={requireLogin} />
                            )}

                            {/* JOBS VIEW */}
                            {activeTab === 'jobs' && (
                                <JobsPage onRequireLogin={requireLogin} />
                            )}

                            {/* SCHOLARSHIPS VIEW */}
                            {activeTab === 'scholarships' && (
                                <ScholarshipsPage onRequireLogin={requireLogin} />
                            )}
                            {/* GADGETS VIEW */}
                            {activeTab === 'gadgets' && (
                                <GadgetsPage onRequireLogin={requireLogin} />
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* UPGRADED GLASSMORPHISM AUTH MODAL */}
            {authView !== 'none' && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="relative w-full max-w-md bg-slate-800/80 backdrop-blur-2xl border border-slate-600/50 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.4)] p-6 animate-fade-in max-h-[90vh] flex flex-col">
                        <button
                            onClick={() => { setAuthView('none'); setSignupStage('role-selection'); }}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full focus:outline-none bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="text-center mb-4 mt-2">
                            {/* <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> */}
                            <img
                                src="/edumarketplacelogo.png"
                                alt="Eduspace Marketplace Logo"
                                className="h-12 w-12 mx-auto mb-2 object-contain"
                            />
                            <h1 className="text-2xl font-bold text-white tracking-tight">Eduspace Hub</h1>
                            <p className="text-slate-400 text-sm mt-1">Join to access this feature</p>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {renderAuthContent()}
                        </div>
                    </div>
                </div>
            )}
            <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500 relative z-10 bg-slate-900/50">
                © {new Date().getFullYear()} Mzatinova. All rights reserved.
            </footer>
        </div>
    );
}