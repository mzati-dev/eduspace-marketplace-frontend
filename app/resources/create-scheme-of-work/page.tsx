'use client';

import { useState } from 'react';

import { ArrowLeft, Save, Eye, Download, School, GraduationCap, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import SideMenu from '@/components/common/SideMenu';
import { useAppContext } from '@/context/AppContext';

type EducationLevel = 'primary' | 'secondary';
type PrimaryGrade = 'standard1' | 'standard2' | 'standard3' | 'standard4' | 'standard5' | 'standard6' | 'standard7' | 'standard8';
type SecondaryGrade = 'form1' | 'form2' | 'form3' | 'form4';
type Subject = 'Mathematics' | 'English' | 'Chichewa' | 'Science' | 'Social Studies' | 'Biology' | 'Physics' | 'Chemistry' | 'Physical Science' | 'History' | 'Geography';

interface WeekPlan {
    week: number;
    topic: string;
    objectives: string;
    activities: string;
    resources: string;
    assessment: string;
}

interface SchemeOfWork {
    id: string;
    title: string;
    level: EducationLevel;
    grade: PrimaryGrade | SecondaryGrade;
    subject: Subject;
    term: number;
    year: string;
    school: string;
    teacher: string;
    weeks: WeekPlan[];
}

export default function CreateSchemeOfWorkPage() {
    const { user } = useAppContext();
    const [isSideMenuOpen, setSideMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const [scheme, setScheme] = useState<Partial<SchemeOfWork>>({
        level: 'primary',
        grade: 'standard1',
        subject: 'Mathematics',
        term: 1,
        year: new Date().getFullYear().toString(),
        weeks: Array.from({ length: 13 }, (_, i) => ({
            week: i + 1,
            topic: '',
            objectives: '',
            activities: '',
            resources: '',
            assessment: ''
        }))
    });

    const primaryGrades = [
        'standard1', 'standard2', 'standard3', 'standard4', 'standard5', 'standard6', 'standard7', 'standard8'
    ] as const;

    const secondaryGrades = [
        'form1', 'form2', 'form3', 'form4'
    ] as const;

    const primarySubjects: Subject[] = ['Mathematics', 'English', 'Chichewa', 'Science', 'Social Studies'];
    const secondarySubjects: Subject[] = ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'];

    const getSubjects = () => {
        return scheme.level === 'primary' ? primarySubjects : secondarySubjects;
    };

    const getGradeLabel = (grade: string) => {
        if (grade.startsWith('standard')) return grade.replace('standard', 'Standard ');
        if (grade.startsWith('form')) return grade.replace('form', 'Form ');
        return grade;
    };

    const updateWeek = (index: number, field: keyof WeekPlan, value: string) => {
        const newWeeks = [...(scheme.weeks || [])];
        newWeeks[index] = { ...newWeeks[index], [field]: value };
        setScheme({ ...scheme, weeks: newWeeks });
    };

    const handleSave = () => {
        console.log('Saving scheme of work:', scheme);
        alert('Scheme of work saved successfully!');
    };

    const handleExport = () => {
        console.log('Exporting scheme of work:', scheme);
        alert('Scheme of work exported successfully!');
    };

    return (
        <>
            <SideMenu
                userRole={user?.role || 'teacher'}
                isOpen={isSideMenuOpen}
                onClose={() => setSideMenuOpen(false)}
                onMenuClick={() => setSideMenuOpen(true)}
                onCollapse={setIsCollapsed}
            />
            <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header onMenuClick={() => setSideMenuOpen(true)} />

                <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header with navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/resources"
                                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <h1 className="text-3xl font-bold">Scheme of Work Generator</h1>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    <Eye className="h-5 w-5" />
                                    {previewMode ? 'Edit' : 'Preview'}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    <Save className="h-5 w-5" />
                                    Save
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    <Download className="h-5 w-5" />
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-slate-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-slate-400 mb-2">Level</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setScheme({ ...scheme, level: 'primary', grade: 'standard1' })}
                                            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${scheme.level === 'primary'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                }`}
                                        >
                                            Primary
                                        </button>
                                        <button
                                            onClick={() => setScheme({ ...scheme, level: 'secondary', grade: 'form1' })}
                                            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${scheme.level === 'secondary'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                }`}
                                        >
                                            Secondary
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2">Grade/Form</label>
                                    <select
                                        value={scheme.grade}
                                        onChange={(e) => setScheme({ ...scheme, grade: e.target.value as any })}
                                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                    >
                                        {(scheme.level === 'primary' ? primaryGrades : secondaryGrades).map(grade => (
                                            <option key={grade} value={grade}>
                                                {grade.startsWith('standard') ? grade.replace('standard', 'Standard ') : grade.replace('form', 'Form ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2">Subject</label>
                                    <select
                                        value={scheme.subject}
                                        onChange={(e) => setScheme({ ...scheme, subject: e.target.value as Subject })}
                                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                    >
                                        {getSubjects().map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2">Term</label>
                                    <select
                                        value={scheme.term}
                                        onChange={(e) => setScheme({ ...scheme, term: parseInt(e.target.value) })}
                                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                    >
                                        <option value={1}>Term 1</option>
                                        <option value={2}>Term 2</option>
                                        <option value={3}>Term 3</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2">Academic Year</label>
                                    <input
                                        type="text"
                                        value={scheme.year}
                                        onChange={(e) => setScheme({ ...scheme, year: e.target.value })}
                                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2">School Name</label>
                                    <input
                                        type="text"
                                        value={scheme.school || ''}
                                        onChange={(e) => setScheme({ ...scheme, school: e.target.value })}
                                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2">Teacher Name</label>
                                    <input
                                        type="text"
                                        value={scheme.teacher || user?.name || ''}
                                        onChange={(e) => setScheme({ ...scheme, teacher: e.target.value })}
                                        className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {previewMode ? (
                            // Preview Mode
                            <div className="bg-white text-gray-900 rounded-lg p-8 shadow-xl">
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-blue-600">SCHEME OF WORK</h1>
                                    <p className="text-xl mt-2">{scheme.school || 'School Name'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p><span className="font-semibold">Subject:</span> {scheme.subject}</p>
                                        <p><span className="font-semibold">Class:</span> {getGradeLabel(scheme.grade || '')}</p>
                                        <p><span className="font-semibold">Teacher:</span> {scheme.teacher || user?.name || 'Teacher Name'}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-semibold">Term:</span> {scheme.term}</p>
                                        <p><span className="font-semibold">Year:</span> {scheme.year}</p>
                                    </div>
                                </div>

                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-blue-100">
                                            <th className="border border-gray-300 p-2">Week</th>
                                            <th className="border border-gray-300 p-2">Topic</th>
                                            <th className="border border-gray-300 p-2">Objectives</th>
                                            <th className="border border-gray-300 p-2">Activities</th>
                                            <th className="border border-gray-300 p-2">Resources</th>
                                            <th className="border border-gray-300 p-2">Assessment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(scheme.weeks || []).map((week) => (
                                            <tr key={week.week}>
                                                <td className="border border-gray-300 p-2 font-semibold">Week {week.week}</td>
                                                <td className="border border-gray-300 p-2">{week.topic || '-'}</td>
                                                <td className="border border-gray-300 p-2">{week.objectives || '-'}</td>
                                                <td className="border border-gray-300 p-2">{week.activities || '-'}</td>
                                                <td className="border border-gray-300 p-2">{week.resources || '-'}</td>
                                                <td className="border border-gray-300 p-2">{week.assessment || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // Edit Mode - Weekly Plans
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold">Weekly Plans (Term {scheme.term})</h2>
                                {(scheme.weeks || []).map((week, index) => (
                                    <div key={week.week} className="bg-slate-800 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-blue-400 mb-3">Week {week.week}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-slate-400 mb-1">Topic</label>
                                                <input
                                                    type="text"
                                                    value={week.topic}
                                                    onChange={(e) => updateWeek(index, 'topic', e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                    placeholder="Main topic for the week"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 mb-1">Learning Objectives</label>
                                                <input
                                                    type="text"
                                                    value={week.objectives}
                                                    onChange={(e) => updateWeek(index, 'objectives', e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                    placeholder="What students should learn"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 mb-1">Teaching Activities</label>
                                                <input
                                                    type="text"
                                                    value={week.activities}
                                                    onChange={(e) => updateWeek(index, 'activities', e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                    placeholder="Teacher and student activities"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 mb-1">Resources/Materials</label>
                                                <input
                                                    type="text"
                                                    value={week.resources}
                                                    onChange={(e) => updateWeek(index, 'resources', e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                    placeholder="Textbooks, handouts, etc."
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-slate-400 mb-1">Assessment Methods</label>
                                                <input
                                                    type="text"
                                                    value={week.assessment}
                                                    onChange={(e) => updateWeek(index, 'assessment', e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                    placeholder="How will learning be assessed?"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}