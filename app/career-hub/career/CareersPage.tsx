// components/CareersPage.tsx
'use client';

import { Briefcase, Users, TrendingUp, Award, Globe, Cloud } from 'lucide-react';

interface CareerPath {
    id: number;
    title: string;
    icon: string;
    description: string;
    demand: string;
    salary: string;
    skills: string[];
}

const careerPaths: CareerPath[] = [
    {
        id: 1,
        title: "Software Developer",
        icon: "💻",
        description: "Build applications, websites, and digital solutions that power the modern world.",
        demand: "Very High",
        salary: "$60,000 - $120,000",
        skills: ["JavaScript", "Python", "React", "Node.js", "Git"]
    },
    {
        id: 2,
        title: "Data Analyst",
        icon: "📊",
        description: "Turn raw data into actionable insights that drive business decisions.",
        demand: "High",
        salary: "$55,000 - $95,000",
        skills: ["SQL", "Python", "Tableau", "Excel", "Statistics"]
    },
    {
        id: 3,
        title: "Cybersecurity Specialist",
        icon: "🛡️",
        description: "Protect organizations from cyber threats and security breaches.",
        demand: "Very High",
        salary: "$70,000 - $130,000",
        skills: ["Network Security", "Ethical Hacking", "Risk Assessment", "Python", "Firewalls"]
    },
    {
        id: 4,
        title: "Mobile App Developer",
        icon: "📱",
        description: "Create innovative iOS and Android applications used by millions.",
        demand: "High",
        salary: "$65,000 - $110,000",
        skills: ["Swift", "Kotlin", "React Native", "Flutter", "UI/UX"]
    },
    {
        id: 5,
        title: "AI/ML Engineer",
        icon: "🤖",
        description: "Build intelligent systems and machine learning models that learn from data.",
        demand: "Emerging",
        salary: "$80,000 - $150,000",
        skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "Statistics"]
    },
    {
        id: 6,
        title: "Cloud Architect",
        icon: "☁️",
        description: "Design and manage cloud infrastructure for scalable applications.",
        demand: "Very High",
        salary: "$85,000 - $140,000",
        skills: ["AWS", "Azure", "Docker", "Kubernetes", "DevOps"]
    }
];

export default function CareersPage({ onRequireLogin }: { onRequireLogin?: () => void }) {
    const handleExplore = () => {
        if (onRequireLogin) {
            onRequireLogin();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                    Careers
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Explore exciting career paths in technology and beyond. Find your passion and build your future.
                </p>
            </div>

            {/* Career Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {careerPaths.map((career) => (
                    <div
                        key={career.id}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="text-4xl mb-4">{career.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {career.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">{career.description}</p>

                        {/* Demand and Salary */}
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="text-green-400">🔥 {career.demand} Demand</span>
                            <span className="text-blue-400">💰 {career.salary}</span>
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                            <p className="text-xs text-slate-500 mb-2">Key Skills:</p>
                            <div className="flex flex-wrap gap-2">
                                {career.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleExplore}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                        >
                            Explore Path
                        </button>
                    </div>
                ))}
            </div>

            {/* Career Resources Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all">
                    <Briefcase className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Job Search Tips</h3>
                    <p className="text-slate-400 text-sm">Learn how to find and land your dream job in tech.</p>
                    <button onClick={handleExplore} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Learn more →</button>
                </div>

                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all">
                    <Award className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Resume Guide</h3>
                    <p className="text-slate-400 text-sm">Create a standout resume that gets noticed by employers.</p>
                    <button onClick={handleExplore} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Learn more →</button>
                </div>

                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all">
                    <Users className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Interview Prep</h3>
                    <p className="text-slate-400 text-sm">Master technical interviews and ace your next job interview.</p>
                    <button onClick={handleExplore} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Learn more →</button>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Ready to Start Your Career Journey?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                    Join thousands of students who have launched successful careers in tech. Get started today!
                </p>
                <button
                    onClick={handleExplore}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}