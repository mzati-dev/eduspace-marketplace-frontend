// components/ScholarshipsPage.tsx
'use client';

import { GraduationCap, Calendar, DollarSign, Award, Globe, Users, BookOpen, Clock } from 'lucide-react';
import { useState } from 'react';

interface Scholarship {
    id: number;
    title: string;
    provider: string;
    amount: string;
    deadline: string;
    type: 'Merit-based' | 'Need-based' | 'Course-based' | 'Diversity' | 'International';
    level: 'Undergraduate' | 'Postgraduate' | 'PhD' | 'All Levels';
    description: string;
    requirements: string[];
    icon: string;
}

const scholarships: Scholarship[] = [
    {
        id: 1,
        title: "Tech Excellence Scholarship",
        provider: "Eduspace Foundation",
        amount: "Up to $5,000",
        deadline: "December 15, 2025",
        type: "Merit-based",
        level: "Undergraduate",
        description: "For students pursuing technology degrees with outstanding academic performance.",
        requirements: ["Minimum GPA 3.5", "Pursuing STEM degree", "Personal statement", "Two recommendations"],
        icon: "💻"
    },
    {
        id: 2,
        title: "Women in STEM Scholarship",
        provider: "Global Tech Initiative",
        amount: "$3,000",
        deadline: "January 30, 2026",
        type: "Diversity",
        level: "All Levels",
        description: "Supporting women pursuing careers in science, technology, engineering, and mathematics.",
        requirements: ["Female applicants only", "Enrolled in STEM program", "Essay on women in tech", "Academic transcript"],
        icon: "👩‍💻"
    },
    {
        id: 3,
        title: "Future Developers Fund",
        provider: "CodeLab Partners",
        amount: "$2,500",
        deadline: "Rolling Deadline",
        type: "Course-based",
        level: "All Levels",
        description: "For students enrolled in CodeLab courses. Covers certification fees and course materials.",
        requirements: ["Active CodeLab student", "Complete 3+ courses", "Portfolio submission", "Interview"],
        icon: "🎓"
    },
    {
        id: 4,
        title: "African Tech Leaders Scholarship",
        provider: "African Development Bank",
        amount: "$10,000",
        deadline: "March 15, 2026",
        type: "International",
        level: "Postgraduate",
        description: "Empowering African students to become leaders in technology and innovation.",
        requirements: ["African citizen", "Master's or PhD program", "Research proposal", "Leadership experience"],
        icon: "🌍"
    },
    {
        id: 5,
        title: "Cybersecurity Excellence Award",
        provider: "SecureNet Foundation",
        amount: "$4,000",
        deadline: "February 28, 2026",
        type: "Merit-based",
        level: "Undergraduate",
        description: "For students demonstrating exceptional skills and interest in cybersecurity.",
        requirements: ["Cybersecurity major", "CTF participation", "Minimum GPA 3.3", "Security project"],
        icon: "🛡️"
    },
    {
        id: 6,
        title: "First-Generation College Scholarship",
        provider: "Education Forward",
        amount: "$2,000",
        deadline: "April 15, 2026",
        type: "Need-based",
        level: "Undergraduate",
        description: "Supporting first-generation college students pursuing higher education.",
        requirements: ["First-generation student", "Financial need", "Personal essay", "Community involvement"],
        icon: "🌟"
    },
    {
        id: 7,
        title: "AI Research Fellowship",
        provider: "FutureAI Institute",
        amount: "$15,000",
        deadline: "May 1, 2026",
        type: "Merit-based",
        level: "PhD",
        description: "Full fellowship for PhD candidates conducting AI and machine learning research.",
        requirements: ["PhD enrollment", "Research proposal", "Publications preferred", "Faculty recommendation"],
        icon: "🤖"
    },
    {
        id: 8,
        title: "Community Impact Scholarship",
        provider: "Tech for Good",
        amount: "$3,500",
        deadline: "June 30, 2026",
        type: "Diversity",
        level: "All Levels",
        description: "For students using technology to make a positive impact in their communities.",
        requirements: ["Community project", "Portfolio", "Impact report", "Video submission"],
        icon: "❤️"
    }
];

const scholarshipTypes = ["All", "Merit-based", "Need-based", "Course-based", "Diversity", "International"];
const educationLevels = ["All", "Undergraduate", "Postgraduate", "PhD", "All Levels"];

export default function ScholarshipsPage({ onRequireLogin }: { onRequireLogin?: () => void }) {
    const [selectedType, setSelectedType] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredScholarships = scholarships.filter(scholarship => {
        const matchesType = selectedType === "All" || scholarship.type === selectedType;
        const matchesLevel = selectedLevel === "All" || scholarship.level === selectedLevel;
        const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesLevel && matchesSearch;
    });

    const handleApply = () => {
        if (onRequireLogin) {
            onRequireLogin();
        }
    };

    const getDeadlineStatus = (deadline: string) => {
        if (deadline === "Rolling Deadline") return "text-green-400";
        // Simple check - in real app you'd compare dates
        return "text-yellow-400";
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                    Scholarships
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Find scholarships to fund your education. Apply for opportunities from top organizations.
                </p>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Award className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">$50K+</div>
                    <div className="text-sm text-slate-400">Total Awards</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-sm text-slate-400">Scholarships</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">Global</div>
                    <div className="text-sm text-slate-400">Opportunities</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <GraduationCap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">All Levels</div>
                    <div className="text-sm text-slate-400">Education</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search scholarships by name, provider, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {scholarshipTypes.map(type => (
                            <option key={type} value={type}>Type: {type}</option>
                        ))}
                    </select>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {educationLevels.map(level => (
                            <option key={level} value={level}>Level: {level}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Scholarship Listings */}
            {filteredScholarships.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                    <GraduationCap className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Scholarships Found</h2>
                    <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    {filteredScholarships.map((scholarship) => (
                        <div
                            key={scholarship.id}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="text-4xl">{scholarship.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                                        {scholarship.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm">{scholarship.provider}</p>
                                </div>
                            </div>

                            {/* Amount and Deadline */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-green-400" />
                                    <span className="text-white font-semibold">{scholarship.amount}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-yellow-400" />
                                    <span className={`${getDeadlineStatus(scholarship.deadline)}`}>
                                        {scholarship.deadline}
                                    </span>
                                </div>
                            </div>

                            {/* Type and Level Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                    {scholarship.type}
                                </span>
                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                                    {scholarship.level}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-slate-400 text-sm mb-4">{scholarship.description}</p>

                            {/* Requirements */}
                            <div className="mb-4">
                                <p className="text-xs text-slate-500 mb-2">Requirements:</p>
                                <ul className="space-y-1">
                                    {scholarship.requirements.map((req, idx) => (
                                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                                            <span className="text-blue-400">•</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Apply Button */}
                            <button
                                onClick={handleApply}
                                className="w-full mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <BookOpen className="h-8 w-8 text-blue-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">How to Apply</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>• Read requirements carefully</li>
                        <li>• Prepare documents in advance</li>
                        <li>• Write a compelling personal statement</li>
                        <li>• Submit before deadline</li>
                    </ul>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <Award className="h-8 w-8 text-blue-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Tips for Success</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>• Start early, don't wait until last minute</li>
                        <li>• Tailor each application to the scholarship</li>
                        <li>• Get strong recommendation letters</li>
                        <li>• Proofread everything before submitting</li>
                    </ul>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <Clock className="h-8 w-8 text-blue-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Important Dates</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>• Most deadlines: December - March</li>
                        <li>• Rolling deadlines: Apply anytime</li>
                        <li>• Results: 2-3 months after deadline</li>
                        <li>• Renewal applications: Check annually</li>
                    </ul>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Don't Miss Out on Funding</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                    Create a scholarship alert and get notified when new opportunities match your profile.
                </p>
                <button
                    onClick={handleApply}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                    Create Scholarship Alert
                </button>
            </div>
        </div>
    );
}