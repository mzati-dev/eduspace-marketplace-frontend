// components/CodeLabPage.tsx
'use client';

import { useState } from 'react';
import { Code2, Brain, Monitor, BookOpen, Rocket, Briefcase, Sparkles, Shield, Globe } from 'lucide-react';

interface Course {
    icon: string;
    title: string;
    description: string;
    topics: string[];
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const programmingCourses: Course[] = [
    {
        icon: "🌱",
        title: "Beginner Programming",
        description: "No experience needed. Learn the fundamentals of programming.",
        topics: ["What is programming?", "HTML & CSS basics", "JavaScript fundamentals", "Build your first website"],
        level: "Beginner"
    },
    {
        icon: "🚀",
        title: "Intermediate Programming",
        description: "Build real-world projects and deepen your skills.",
        topics: ["React & Next.js", "Backend with Node.js", "Databases & APIs", "Full-stack projects"],
        level: "Intermediate"
    },
    {
        icon: "💼",
        title: "Advanced & Career",
        description: "Master complex concepts and launch your tech career.",
        topics: ["System design & architecture", "Mobile app development", "Cloud computing & DevOps", "Freelancing & job prep"],
        level: "Advanced"
    }
];

const aiCourses: Course[] = [
    {
        icon: "🤖",
        title: "AI Fundamentals",
        description: "Understand the basics of artificial intelligence.",
        topics: ["What is AI & Machine Learning?", "Neural networks explained", "AI ethics & responsible AI", "Build your first AI model"],
        level: "Beginner"
    },
    {
        icon: "🧠",
        title: "Machine Learning",
        description: "Build intelligent systems that learn from data.",
        topics: ["Supervised & Unsupervised learning", "TensorFlow & PyTorch", "Computer vision & NLP", "Real-world ML projects"],
        level: "Intermediate"
    },
    {
        icon: "💬",
        title: "Generative AI & LLMs",
        description: "Master ChatGPT, Claude, and other AI tools.",
        topics: ["Prompt engineering", "Building AI-powered apps", "Fine-tuning language models", "AI automation & agents"],
        level: "Advanced"
    },
    {
        icon: "🚀",
        title: "AI Career Path",
        description: "Become an AI engineer or data scientist.",
        topics: ["AI engineer roadmap", "Data science portfolio projects", "AI job interview prep", "AI freelancing & consulting"],
        level: "Advanced"
    }
];

const digitalSkillsCourses: Course[] = [
    {
        icon: "💻",
        title: "Computer Basics",
        description: "Essential computer skills for beginners.",
        topics: ["File management & organization", "Internet & email essentials", "Keyboard shortcuts", "Computer security basics"],
        level: "Beginner"
    },
    {
        icon: "🌐",
        title: "Digital Literacy",
        description: "Navigate the digital world with confidence.",
        topics: ["Online safety & privacy", "Using AI tools (ChatGPT, etc.)", "Digital communication", "Remote work essentials"],
        level: "Beginner"
    }
];

const levelColors = {
    Beginner: "bg-green-500/20 text-green-400",
    Intermediate: "bg-yellow-500/20 text-yellow-400",
    Advanced: "bg-red-500/20 text-red-400"
};

export default function CodeLabPage({ onRequireLogin }: { onRequireLogin?: () => void }) {
    const [activeTab, setActiveTab] = useState<'programming' | 'ai' | 'digital'>('programming');

    const handleStartLearning = () => {
        if (onRequireLogin) {
            onRequireLogin();
        }
    };

    const renderCourses = (courses: Course[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {courses.map((course, index) => (
                <div
                    key={index}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group"
                >
                    <div className="text-4xl mb-4">{course.icon}</div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {course.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${levelColors[course.level]}`}>
                            {course.level}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                    <ul className="text-slate-400 text-sm space-y-2 mb-6">
                        {course.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                {topic}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleStartLearning}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                    >
                        Start Learning
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-4">
                    <Code2 className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-blue-400">Learn to Code</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                    CodeLab
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Learn programming, AI, and digital skills. Start your journey today.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8 border-b border-slate-700 pb-4">
                <button
                    onClick={() => setActiveTab('programming')}
                    className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${activeTab === 'programming'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    <Code2 className="h-4 w-4" />
                    Programming
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${activeTab === 'ai'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    <Brain className="h-4 w-4" />
                    AI & Machine Learning
                </button>
                <button
                    onClick={() => setActiveTab('digital')}
                    className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${activeTab === 'digital'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    <Monitor className="h-4 w-4" />
                    Digital Skills
                </button>
            </div>

            {/* Programming Tab */}
            {activeTab === 'programming' && renderCourses(programmingCourses)}

            {/* AI & Machine Learning Tab */}
            {activeTab === 'ai' && renderCourses(aiCourses)}

            {/* Digital Skills Tab */}
            {activeTab === 'digital' && renderCourses(digitalSkillsCourses)}

            {/* How CodeLab Works */}
            <div className="text-center py-12 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                <h2 className="text-3xl font-bold mb-8">How CodeLab Works</h2>
                <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
                    <div className="flex-1 max-w-xs mx-auto">
                        <div className="text-3xl font-bold text-blue-400 mb-2">1.</div>
                        <h3 className="text-xl font-semibold mb-2">Choose Your Path</h3>
                        <p className="text-slate-400">Select Programming, AI, or Digital Skills from the tabs above.</p>
                    </div>
                    <div className="flex-1 max-w-xs mx-auto">
                        <div className="text-3xl font-bold text-blue-400 mb-2">2.</div>
                        <h3 className="text-xl font-semibold mb-2">Learn by Doing</h3>
                        <p className="text-slate-400">Hands-on projects, real code, and practical exercises.</p>
                    </div>
                    <div className="flex-1 max-w-xs mx-auto">
                        <div className="text-3xl font-bold text-blue-400 mb-2">3.</div>
                        <h3 className="text-xl font-semibold mb-2">Level Up</h3>
                        <p className="text-slate-400">Build skills, get certified, and advance your career.</p>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">100+</div>
                    <div className="text-xs text-slate-400">Hours of Content</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Rocket className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">30+</div>
                    <div className="text-xs text-slate-400">Projects</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Briefcase className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">10+</div>
                    <div className="text-xs text-slate-400">Career Paths</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Sparkles className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">Certificates</div>
                    <div className="text-xs text-slate-400">Upon Completion</div>
                </div>
            </div>
        </div>
    );
}