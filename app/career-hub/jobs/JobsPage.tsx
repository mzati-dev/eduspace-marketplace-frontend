// components/JobsPage.tsx
'use client';

import { Briefcase, MapPin, Clock, DollarSign, Building, Calendar, Filter, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
    salary: string;
    posted: string;
    description: string;
    skills: string[];
    logo: string;
}

const jobs: Job[] = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp Inc.",
        location: "Remote",
        type: "Full-time",
        salary: "$60,000 - $80,000",
        posted: "2 days ago",
        description: "Looking for a skilled Frontend Developer with React experience to join our growing team.",
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        logo: "🚀"
    },
    {
        id: 2,
        title: "Data Analyst",
        company: "DataWorks Solutions",
        location: "Hybrid",
        type: "Full-time",
        salary: "$55,000 - $75,000",
        posted: "3 days ago",
        description: "Seeking a Data Analyst to turn data into insights and drive business decisions.",
        skills: ["Python", "SQL", "Power BI", "Excel"],
        logo: "📊"
    },
    {
        id: 3,
        title: "Cybersecurity Intern",
        company: "SecureNet Solutions",
        location: "On-site",
        type: "Internship",
        salary: "$25,000 - $35,000",
        posted: "1 week ago",
        description: "Paid internship opportunity for students interested in cybersecurity.",
        skills: ["Network Security", "Risk Assessment", "Firewalls"],
        logo: "🛡️"
    },
    {
        id: 4,
        title: "Full Stack Developer",
        company: "InnovateLabs",
        location: "Remote",
        type: "Contract",
        salary: "$70,000 - $90,000",
        posted: "5 days ago",
        description: "Experienced Full Stack Developer needed for exciting new projects.",
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        logo: "💻"
    },
    {
        id: 5,
        title: "AI/ML Engineer",
        company: "FutureAI",
        location: "Remote",
        type: "Full-time",
        salary: "$90,000 - $120,000",
        posted: "1 day ago",
        description: "Join our AI team to build cutting-edge machine learning models.",
        skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
        logo: "🤖"
    },
    {
        id: 6,
        title: "Cloud Architect",
        company: "CloudTech Solutions",
        location: "Hybrid",
        type: "Full-time",
        salary: "$100,000 - $140,000",
        posted: "4 days ago",
        description: "Design and implement cloud infrastructure for enterprise clients.",
        skills: ["AWS", "Azure", "Docker", "Kubernetes"],
        logo: "☁️"
    }
];

const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Remote", "Internship"];

export default function JobsPage({ onRequireLogin }: { onRequireLogin?: () => void }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = selectedType === "All" || job.type === selectedType;
        return matchesSearch && matchesType;
    });

    const handleApply = () => {
        if (onRequireLogin) {
            onRequireLogin();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                    Jobs
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Find your next career opportunity. Browse jobs from top companies.
                </p>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Briefcase className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">150+</div>
                    <div className="text-sm text-slate-400">Open Positions</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <Building className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-slate-400">Companies Hiring</div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">Weekly</div>
                    <div className="text-sm text-slate-400">New Jobs Added</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search jobs by title, company, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {jobTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                    <Briefcase className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Jobs Found</h2>
                    <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <div className="space-y-4 mb-12">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                {/* Left Section */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-3xl">{job.logo}</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-slate-400">{job.company}</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-3">{job.description}</p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {job.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" />
                                            {job.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            {job.salary}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {job.posted}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="flex flex-col gap-2 min-w-[120px]">
                                    <button
                                        onClick={handleApply}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
                                    >
                                        Apply Now
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition"
                                    >
                                        Save Job
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">💡 Job Application Tips</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>• Tailor your resume to each job description</li>
                        <li>• Highlight relevant skills and experience</li>
                        <li>• Research the company before applying</li>
                        <li>• Follow up after submitting your application</li>
                    </ul>
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">🚀 Interview Preparation</h3>
                    <ul className="space-y-2 text-slate-400 text-sm">
                        <li>• Practice common technical interview questions</li>
                        <li>• Prepare questions to ask the interviewer</li>
                        <li>• Review your portfolio and projects</li>
                        <li>• Dress professionally and be on time</li>
                    </ul>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Not Finding What You're Looking For?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                    Create a job alert and get notified when new positions match your skills.
                </p>
                <button
                    onClick={handleApply}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                    Create Job Alert
                </button>
            </div>
        </div>
    );
}