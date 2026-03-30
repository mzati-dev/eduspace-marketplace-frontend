// components/CertificationsPage.tsx
'use client';

import { Award, Clock, Users, TrendingUp, Zap, Globe } from 'lucide-react';

interface Certification {
    id: number;
    title: string;
    icon: string;
    provider: string;
    description: string;
    duration: string;
    students: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    skills: string[];
    price: string;
}

const certifications: Certification[] = [
    {
        id: 1,
        title: "Full Stack Web Development",
        icon: "🎓",
        provider: "Meta",
        description: "Master front-end and back-end development. Build complete web applications.",
        duration: "6 months",
        students: "25,000+",
        level: "Beginner",
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        price: "$49/month"
    },
    {
        id: 2,
        title: "Data Science Professional",
        icon: "📊",
        provider: "IBM",
        description: "Learn data analysis, visualization, and machine learning techniques.",
        duration: "5 months",
        students: "18,000+",
        level: "Intermediate",
        skills: ["Python", "Pandas", "Matplotlib", "SQL", "Machine Learning"],
        price: "$59/month"
    },
    {
        id: 3,
        title: "AWS Cloud Practitioner",
        icon: "☁️",
        provider: "Amazon Web Services",
        description: "Understand cloud concepts and AWS core services.",
        duration: "3 months",
        students: "12,000+",
        level: "Beginner",
        skills: ["Cloud Computing", "AWS", "EC2", "S3", "Lambda"],
        price: "$39/month"
    },
    {
        id: 4,
        title: "CompTIA Security+",
        icon: "🛡️",
        provider: "CompTIA",
        description: "Master cybersecurity fundamentals and threat management.",
        duration: "4 months",
        students: "15,000+",
        level: "Intermediate",
        skills: ["Network Security", "Risk Management", "Cryptography", "Threat Analysis"],
        price: "$45/month"
    },
    {
        id: 5,
        title: "TensorFlow Developer",
        icon: "🤖",
        provider: "Google",
        description: "Build and deploy machine learning models using TensorFlow.",
        duration: "4 months",
        students: "8,500+",
        level: "Advanced",
        skills: ["Python", "TensorFlow", "Neural Networks", "Deep Learning", "Keras"],
        price: "$55/month"
    },
    {
        id: 6,
        title: "React Native Mobile Dev",
        icon: "📱",
        provider: "Meta",
        description: "Create cross-platform mobile apps with React Native.",
        duration: "3 months",
        students: "10,000+",
        level: "Intermediate",
        skills: ["React", "React Native", "JavaScript", "Redux", "Mobile UI"],
        price: "$49/month"
    },
    {
        id: 7,
        title: "Project Management Professional",
        icon: "📋",
        provider: "PMI",
        description: "Learn project management methodologies and leadership skills.",
        duration: "5 months",
        students: "20,000+",
        level: "Intermediate",
        skills: ["Agile", "Scrum", "Leadership", "Risk Management", "Communication"],
        price: "$65/month"
    },
    {
        id: 8,
        title: "Google IT Support",
        icon: "💻",
        provider: "Google",
        description: "Develop IT support skills and troubleshoot computer issues.",
        duration: "4 months",
        students: "30,000+",
        level: "Beginner",
        skills: ["Networking", "Operating Systems", "Security", "Troubleshooting"],
        price: "$39/month"
    },
    {
        id: 9,
        title: "AI & Machine Learning",
        icon: "🧠",
        provider: "Stanford Online",
        description: "Advanced AI concepts and machine learning algorithms.",
        duration: "6 months",
        students: "6,500+",
        level: "Advanced",
        skills: ["Python", "Machine Learning", "Neural Networks", "AI Ethics", "Deep Learning"],
        price: "$79/month"
    }
];

const levelColors = {
    Beginner: "bg-green-500/20 text-green-400",
    Intermediate: "bg-yellow-500/20 text-yellow-400",
    Advanced: "bg-red-500/20 text-red-400"
};

export default function CertificationsPage({ onRequireLogin }: { onRequireLogin?: () => void }) {
    const handleGetCertified = () => {
        if (onRequireLogin) {
            onRequireLogin();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                    Certifications
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Earn industry-recognized certifications and boost your career. Get certified by top companies.
                </p>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Award className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-slate-400">Certifications</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">100K+</div>
                    <div className="text-sm text-slate-400">Students Certified</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">40%</div>
                    <div className="text-sm text-slate-400">Salary Increase</div>
                </div>
            </div>

            {/* Certification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {certifications.map((cert) => (
                    <div
                        key={cert.id}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-4xl">{cert.icon}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${levelColors[cert.level]}`}>
                                {cert.level}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {cert.title}
                        </h3>
                        <p className="text-sm text-blue-400 mb-2">{cert.provider}</p>
                        <p className="text-slate-400 text-sm mb-4">{cert.description}</p>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Clock className="h-4 w-4" />
                                <span>{cert.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Users className="h-4 w-4" />
                                <span>{cert.students} students</span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2">What you'll learn:</p>
                            <div className="flex flex-wrap gap-1">
                                {cert.skills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {cert.skills.length > 3 && (
                                    <span className="text-xs text-slate-500">+{cert.skills.length - 3} more</span>
                                )}
                            </div>
                        </div>

                        {/* Price and Button */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                            <span className="text-xl font-bold text-white">{cert.price}</span>
                            <button
                                onClick={handleGetCertified}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                            >
                                Get Certified
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certification Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all">
                    <Zap className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Career Advancement</h3>
                    <p className="text-slate-400 text-sm">Certifications open doors to promotions and higher salaries.</p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all">
                    <Globe className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Global Recognition</h3>
                    <p className="text-slate-400 text-sm">Get recognized by employers worldwide with industry-standard certs.</p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all">
                    <TrendingUp className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Skill Validation</h3>
                    <p className="text-slate-400 text-sm">Prove your expertise and stand out in the job market.</p>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Start Your Certification Journey Today</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                    Get certified, boost your career, and join the community of certified professionals.
                </p>
                <button
                    onClick={handleGetCertified}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                    View All Certifications
                </button>
            </div>
        </div>
    );
}