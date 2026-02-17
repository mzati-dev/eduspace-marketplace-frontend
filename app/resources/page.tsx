'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FileText, Book, Youtube, PenSquare, FilePlus2, Download, UploadCloud, GraduationCap, School, Filter, Calendar } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import SideMenu from '@/components/common/SideMenu';

// --- TYPE DEFINITIONS ---
type EducationLevel = 'primary' | 'secondary';
type PrimaryGrade = 'standard1' | 'standard2' | 'standard3' | 'standard4' | 'standard5' | 'standard6' | 'standard7' | 'standard8';
type SecondaryGrade = 'form1' | 'form2' | 'form3' | 'form4';
type ResourceType = 'textbooks' | 'pamphlets' | 'schemes' | 'syllabus' | 'pastPapers';
type PaperType = 'pslce' | 'jce' | 'msce' | 'mock' | 'general';
type Subject = 'Mathematics' | 'English' | 'Chichewa' | 'Science' | 'Social Studies' | 'Biology' | 'Physics' | 'Chemistry' | 'Physical Science' | 'History' | 'Geography' | 'All Subjects';
type Term = 1 | 2 | 3;

interface Resource {
    id: string;
    title: string;
    author: string;
    subject: Subject;
    year?: string; // For past papers
    paperType?: PaperType; // For past papers (pslce, jce, msce, mock, general)
    term?: Term; // For schemes of work
    type: ResourceType;
    level: EducationLevel;
    grade: PrimaryGrade | SecondaryGrade;
}

// --- AVAILABLE YEARS ---
const availableYears = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

// --- SUBJECTS BY LEVEL AND GRADE ---
const primarySubjects: Subject[] = ['Mathematics', 'English', 'Chichewa', 'Science', 'Social Studies'];
const form2Subjects: Subject[] = ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'];
const form4Subjects: Subject[] = ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'];

// --- MOCK DATA STRUCTURED BY LEVEL, GRADE, AND TYPE ---
const mockData: Resource[] = [
    // PRIMARY SCHOOL - Standard 1-7 (No past papers)
    ...(['standard1', 'standard2', 'standard3', 'standard4', 'standard5', 'standard6', 'standard7'] as PrimaryGrade[]).flatMap(grade => [
        // Textbooks
        ...primarySubjects.map((subject, index) => ({
            id: `p_${grade}_textbook_${index + 1}`,
            title: `${subject} Textbook ${grade.toUpperCase()}`,
            author: 'Malawi Institute of Education',
            subject,
            type: 'textbooks' as ResourceType,
            level: 'primary' as EducationLevel,
            grade
        })),

        // Pamphlets
        ...primarySubjects.map((subject, index) => ({
            id: `p_${grade}_pamphlet_${index + 1}`,
            title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
            author: 'Popular Publications',
            subject,
            type: 'pamphlets' as ResourceType,
            level: 'primary' as EducationLevel,
            grade
        })),

        // Schemes of Work (with terms)
        ...primarySubjects.flatMap((subject, index) => [
            {
                id: `p_${grade}_scheme_${index + 1}_t1`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
                author: 'DEMB',
                subject,
                term: 1 as Term,
                type: 'schemes' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            },
            {
                id: `p_${grade}_scheme_${index + 1}_t2`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 2`,
                author: 'DEMB',
                subject,
                term: 2 as Term,
                type: 'schemes' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            },
            {
                id: `p_${grade}_scheme_${index + 1}_t3`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 3`,
                author: 'DEMB',
                subject,
                term: 3 as Term,
                type: 'schemes' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            }
        ]).flat(),

        // Syllabus (no subject filter needed)
        {
            id: `p_${grade}_syllabus_1`,
            title: `Primary School Syllabus ${grade.toUpperCase()}`,
            author: 'Malawi Institute of Education',
            subject: 'All Subjects' as Subject,
            type: 'syllabus' as ResourceType,
            level: 'primary' as EducationLevel,
            grade
        }
    ]),

    // PRIMARY SCHOOL - Standard 8 (With PSLCE, Mock, and General papers)
    ...(['standard8'] as PrimaryGrade[]).flatMap(grade => [
        // Textbooks
        ...primarySubjects.map((subject, index) => ({
            id: `p_${grade}_textbook_${index + 1}`,
            title: `${subject} Textbook ${grade.toUpperCase()}`,
            author: 'Malawi Institute of Education',
            subject,
            type: 'textbooks' as ResourceType,
            level: 'primary' as EducationLevel,
            grade
        })),

        // Pamphlets
        ...primarySubjects.map((subject, index) => ({
            id: `p_${grade}_pamphlet_${index + 1}`,
            title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
            author: 'Popular Publications',
            subject,
            type: 'pamphlets' as ResourceType,
            level: 'primary' as EducationLevel,
            grade
        })),

        // Schemes of Work (with terms)
        ...primarySubjects.flatMap((subject, index) => [
            {
                id: `p_${grade}_scheme_${index + 1}_t1`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
                author: 'DEMB',
                subject,
                term: 1 as Term,
                type: 'schemes' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            },
            {
                id: `p_${grade}_scheme_${index + 1}_t2`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 2`,
                author: 'DEMB',
                subject,
                term: 2 as Term,
                type: 'schemes' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            },
            {
                id: `p_${grade}_scheme_${index + 1}_t3`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 3`,
                author: 'DEMB',
                subject,
                term: 3 as Term,
                type: 'schemes' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            }
        ]).flat(),

        // Syllabus (no subject filter needed)
        {
            id: `p_${grade}_syllabus_1`,
            title: `Primary School Syllabus ${grade.toUpperCase()}`,
            author: 'Malawi Institute of Education',
            subject: 'All Subjects' as Subject,
            type: 'syllabus' as ResourceType,
            level: 'primary' as EducationLevel,
            grade
        },

        // PSLCE Past Papers (MANEB - Standard 8 only)
        ...availableYears.flatMap(year =>
            primarySubjects.map((subject, index) => ({
                id: `p_${grade}_pslce_${year}_${index + 1}`,
                title: `PSLCE ${subject} Paper ${year}`,
                author: 'MANEB',
                subject,
                year,
                paperType: 'pslce' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            }))
        ),

        // Mock Examinations (Standard 8)
        ...availableYears.flatMap(year =>
            primarySubjects.map((subject, index) => ({
                id: `p_${grade}_mock_${year}_${index + 1}`,
                title: `Mock ${subject} Paper ${year}`,
                author: 'District Education Office',
                subject,
                year,
                paperType: 'mock' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            }))
        ),

        // General Papers (Standard 8)
        ...availableYears.flatMap(year =>
            primarySubjects.map((subject, index) => ({
                id: `p_${grade}_general_${year}_${index + 1}`,
                title: `General ${subject} Paper ${year}`,
                author: 'Various Schools',
                subject,
                year,
                paperType: 'general' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'primary' as EducationLevel,
                grade
            }))
        )
    ]),

    // SECONDARY SCHOOL - Form 1 & 3 (No past papers)
    ...(['form1', 'form3'] as SecondaryGrade[]).flatMap(grade => [
        // Textbooks
        ...(grade === 'form1' ?
            ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'] as Subject[] :
            ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'] as Subject[]
        ).map((subject, index) => ({
            id: `s_${grade}_textbook_${index + 1}`,
            title: `${subject} Textbook ${grade.toUpperCase()}`,
            author: grade === 'form1' ? 'Longman Malawi' : 'Oxford University Press',
            subject,
            type: 'textbooks' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        })),

        // Pamphlets
        ...(grade === 'form1' ?
            ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'] as Subject[] :
            ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'] as Subject[]
        ).map((subject, index) => ({
            id: `s_${grade}_pamphlet_${index + 1}`,
            title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
            author: 'MK Publications',
            subject,
            type: 'pamphlets' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        })),

        // Schemes of Work (with terms)
        ...(grade === 'form1' ?
            ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'] as Subject[] :
            ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'] as Subject[]
        ).flatMap((subject, index) => [
            {
                id: `s_${grade}_scheme_${index + 1}_t1`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
                author: 'MoEST',
                subject,
                term: 1 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            },
            {
                id: `s_${grade}_scheme_${index + 1}_t2`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 2`,
                author: 'MoEST',
                subject,
                term: 2 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            },
            {
                id: `s_${grade}_scheme_${index + 1}_t3`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 3`,
                author: 'MoEST',
                subject,
                term: 3 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }
        ]).flat(),

        // Syllabus (no subject filter needed)
        {
            id: `s_${grade}_syllabus_1`,
            title: `Secondary School Syllabus ${grade.toUpperCase()}`,
            author: 'Malawi Institute of Education',
            subject: 'All Subjects' as Subject,
            type: 'syllabus' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        }
    ]),

    // SECONDARY SCHOOL - Form 2 (With JCE, Mock, and General papers)
    ...(['form2'] as SecondaryGrade[]).flatMap(grade => [
        // Textbooks
        ...form2Subjects.map((subject, index) => ({
            id: `s_${grade}_textbook_${index + 1}`,
            title: `${subject} Textbook ${grade.toUpperCase()}`,
            author: 'Longman Malawi',
            subject,
            type: 'textbooks' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        })),

        // Pamphlets
        ...form2Subjects.map((subject, index) => ({
            id: `s_${grade}_pamphlet_${index + 1}`,
            title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
            author: 'MK Publications',
            subject,
            type: 'pamphlets' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        })),

        // Schemes of Work (with terms)
        ...form2Subjects.flatMap((subject, index) => [
            {
                id: `s_${grade}_scheme_${index + 1}_t1`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
                author: 'MoEST',
                subject,
                term: 1 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            },
            {
                id: `s_${grade}_scheme_${index + 1}_t2`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 2`,
                author: 'MoEST',
                subject,
                term: 2 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            },
            {
                id: `s_${grade}_scheme_${index + 1}_t3`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 3`,
                author: 'MoEST',
                subject,
                term: 3 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }
        ]).flat(),

        // Syllabus (no subject filter needed)
        {
            id: `s_${grade}_syllabus_1`,
            title: `Secondary School Syllabus ${grade.toUpperCase()}`,
            author: 'Malawi Institute of Education',
            subject: 'All Subjects' as Subject,
            type: 'syllabus' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        },

        // JCE Past Papers (MANEB - Form 2 only)
        ...availableYears.flatMap(year =>
            form2Subjects.map((subject, index) => ({
                id: `s_${grade}_jce_${year}_${index + 1}`,
                title: `JCE ${subject} Paper ${year}`,
                author: 'MANEB',
                subject,
                year,
                paperType: 'jce' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }))
        ),

        // Mock Examinations (Form 2)
        ...availableYears.flatMap(year =>
            form2Subjects.map((subject, index) => ({
                id: `s_${grade}_mock_${year}_${index + 1}`,
                title: `Mock ${subject} Paper ${year}`,
                author: 'District Education Office',
                subject,
                year,
                paperType: 'mock' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }))
        ),

        // General Papers (Form 2)
        ...availableYears.flatMap(year =>
            form2Subjects.map((subject, index) => ({
                id: `s_${grade}_general_${year}_${index + 1}`,
                title: `General ${subject} Paper ${year}`,
                author: 'Various Schools',
                subject,
                year,
                paperType: 'general' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }))
        )
    ]),

    // SECONDARY SCHOOL - Form 4 (With MSCE, Mock, and General papers)
    ...(['form4'] as SecondaryGrade[]).flatMap(grade => [
        // Textbooks
        ...form4Subjects.map((subject, index) => ({
            id: `s_${grade}_textbook_${index + 1}`,
            title: `${subject} Textbook ${grade.toUpperCase()}`,
            author: 'Oxford University Press',
            subject,
            type: 'textbooks' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        })),

        // Pamphlets
        ...form4Subjects.map((subject, index) => ({
            id: `s_${grade}_pamphlet_${index + 1}`,
            title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
            author: 'MK Publications',
            subject,
            type: 'pamphlets' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        })),

        // Schemes of Work (with terms)
        ...form4Subjects.flatMap((subject, index) => [
            {
                id: `s_${grade}_scheme_${index + 1}_t1`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
                author: 'MoEST',
                subject,
                term: 1 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            },
            {
                id: `s_${grade}_scheme_${index + 1}_t2`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 2`,
                author: 'MoEST',
                subject,
                term: 2 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            },
            {
                id: `s_${grade}_scheme_${index + 1}_t3`,
                title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 3`,
                author: 'MoEST',
                subject,
                term: 3 as Term,
                type: 'schemes' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }
        ]).flat(),

        // Syllabus (no subject filter needed)
        {
            id: `s_${grade}_syllabus_1`,
            title: `Secondary School Syllabus ${grade.toUpperCase()}`,
            author: 'Malawi Institute of Education',
            subject: 'All Subjects' as Subject,
            type: 'syllabus' as ResourceType,
            level: 'secondary' as EducationLevel,
            grade
        },

        // MSCE Past Papers (MANEB - Form 4 only)
        ...availableYears.flatMap(year =>
            form4Subjects.map((subject, index) => ({
                id: `s_${grade}_msce_${year}_${index + 1}`,
                title: `MSCE ${subject} Paper ${year}`,
                author: 'MANEB',
                subject,
                year,
                paperType: 'msce' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }))
        ),

        // Mock Examinations (Form 4)
        ...availableYears.flatMap(year =>
            form4Subjects.map((subject, index) => ({
                id: `s_${grade}_mock_${year}_${index + 1}`,
                title: `Mock ${subject} Paper ${year}`,
                author: 'District Education Office',
                subject,
                year,
                paperType: 'mock' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }))
        ),

        // General Papers (Form 4)
        ...availableYears.flatMap(year =>
            form4Subjects.map((subject, index) => ({
                id: `s_${grade}_general_${year}_${index + 1}`,
                title: `General ${subject} Paper ${year}`,
                author: 'Various Schools',
                subject,
                year,
                paperType: 'general' as PaperType,
                type: 'pastPapers' as ResourceType,
                level: 'secondary' as EducationLevel,
                grade
            }))
        )
    ])
].flat();

// --- ICON MAPPING FOR RESOURCE TYPES ---
const resourceIcons = {
    textbooks: Book,
    pamphlets: FileText,
    schemes: FilePlus2,
    syllabus: GraduationCap,
    pastPapers: FileText
};

const resourceLabels = {
    textbooks: 'Textbooks',
    pamphlets: 'Pamphlets',
    schemes: 'Schemes of Work',
    syllabus: 'Syllabus',
    pastPapers: 'Past Papers'
};

const paperTypeLabels = {
    pslce: 'PSLCE (MANEB)',
    jce: 'JCE (MANEB)',
    msce: 'MSCE (MANEB)',
    mock: 'Mock Examinations',
    general: 'General Papers'
};

// --- REUSABLE COMPONENTS ---
const ResourceCard = ({ icon: Icon, title, subtitle, year, paperType, term }: { icon: React.ElementType, title: string, subtitle: string, year?: string, paperType?: string, term?: number }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300">
        <Icon className="h-8 w-8 text-blue-400 flex-shrink-0" />
        <div className="flex-grow">
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400">{subtitle}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
                {year && <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded">Year: {year}</span>}
                {paperType && paperTypeLabels[paperType as keyof typeof paperTypeLabels] && (
                    <span className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded">
                        {paperTypeLabels[paperType as keyof typeof paperTypeLabels]}
                    </span>
                )}
                {term && <span className="text-xs bg-green-900 text-green-200 px-2 py-0.5 rounded">Term {term}</span>}
            </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
            <Download className="h-5 w-5" />
        </button>
    </div>
);

const GradeSection = ({
    level,
    grade,
    label,
    selectedType,
    selectedYear,
    selectedSubject,
    selectedPaperType,
    selectedGrade,
    selectedTerm
}: {
    level: EducationLevel,
    grade: string,
    label: string,
    selectedType: ResourceType,
    selectedYear?: string,
    selectedSubject?: Subject,
    selectedPaperType?: PaperType,
    selectedGrade?: string,
    selectedTerm?: string
}) => {
    let resources = mockData.filter(r => r.level === level && r.grade === grade && r.type === selectedType);

    // Apply filters based on resource type
    if (selectedType === 'textbooks' || selectedType === 'pamphlets') {
        // Textbooks and pamphlets: filter by subject and grade
        if (selectedSubject && selectedSubject !== 'All Subjects') {
            resources = resources.filter(r => r.subject === selectedSubject);
        }
        if (selectedGrade && selectedGrade !== 'all') {
            resources = resources.filter(r => r.grade === selectedGrade);
        }
    }

    if (selectedType === 'schemes') {
        // Schemes of work: filter by subject, grade, and term
        if (selectedSubject && selectedSubject !== 'All Subjects') {
            resources = resources.filter(r => r.subject === selectedSubject);
        }
        if (selectedGrade && selectedGrade !== 'all') {
            resources = resources.filter(r => r.grade === selectedGrade);
        }
        if (selectedTerm && selectedTerm !== 'all') {
            resources = resources.filter(r => r.term === parseInt(selectedTerm));
        }
    }

    if (selectedType === 'syllabus') {
        // Syllabus: filter by grade only
        if (selectedGrade && selectedGrade !== 'all') {
            resources = resources.filter(r => r.grade === selectedGrade);
        }
    }

    if (selectedType === 'pastPapers') {
        // Past papers: filter by year, subject, and paper type (no grade filter)
        if (selectedYear) {
            resources = resources.filter(r => r.year === selectedYear);
        }
        if (selectedSubject && selectedSubject !== 'All Subjects') {
            resources = resources.filter(r => r.subject === selectedSubject);
        }
        if (selectedPaperType) {
            resources = resources.filter(r => r.paperType === selectedPaperType);
        }
        // Note: No grade filtering for past papers
    }

    if (resources.length === 0) return null;

    // Group past papers by paper type for better organization
    if (selectedType === 'pastPapers' && !selectedPaperType) {
        const papersByType = resources.reduce((acc, resource) => {
            const type = resource.paperType || 'general';
            if (!acc[type]) acc[type] = [];
            acc[type].push(resource);
            return acc;
        }, {} as Record<string, Resource[]>);

        return (
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 bg-slate-800 p-2 rounded-lg border-l-4 border-yellow-500">
                    {label}
                </h4>
                {Object.entries(papersByType).map(([paperType, paperResources]) => (
                    <div key={paperType} className="mb-4">
                        <h5 className="text-md font-semibold text-blue-400 mb-2 ml-2">
                            {paperTypeLabels[paperType as keyof typeof paperTypeLabels]}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {paperResources.map(resource => (
                                <ResourceCard
                                    key={resource.id}
                                    icon={resourceIcons[resource.type]}
                                    title={resource.title}
                                    subtitle={resource.author}
                                    year={resource.year}
                                    paperType={resource.paperType}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3 bg-slate-800 p-2 rounded-lg border-l-4 border-yellow-500">
                {label}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resources.map(resource => (
                    <ResourceCard
                        key={resource.id}
                        icon={resourceIcons[resource.type]}
                        title={resource.title}
                        subtitle={resource.author}
                        year={resource.year}
                        paperType={resource.paperType}
                        term={resource.term}
                    />
                ))}
            </div>
        </div>
    );
};

const TeacherToolCard = ({ icon: Icon, title, description, href, ctaText = "Create New", className = "bg-green-600 hover:bg-green-700" }: { icon: React.ElementType, title: string, description: string, href: string, ctaText?: string, className?: string }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
        <div className="flex items-center mb-3">
            <Icon className="h-7 w-7 text-green-400 mr-3" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 flex-grow mb-4">{description}</p>
        <Link href={href} className={`mt-auto text-center text-white font-bold py-2 px-4 rounded-lg transition-colors ${className}`}>
            {ctaText}
        </Link>
    </div>
);

// --- MAIN PAGE COMPONENT ---
export default function ResourcesPage() {
    const { user } = useAppContext();
    const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('primary');
    const [selectedType, setSelectedType] = useState<ResourceType>('textbooks');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<Subject>('All Subjects');
    const [selectedPaperType, setSelectedPaperType] = useState<PaperType | ''>('');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedTerm, setSelectedTerm] = useState<string>('all');
    const [isSideMenuOpen, setSideMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Security Guard
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) { window.location.replace('/'); }
        }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading resources...</p>
            </div>
        );
    }

    const primaryGrades = [
        { value: 'standard1' as PrimaryGrade, label: 'Standard 1' },
        { value: 'standard2' as PrimaryGrade, label: 'Standard 2' },
        { value: 'standard3' as PrimaryGrade, label: 'Standard 3' },
        { value: 'standard4' as PrimaryGrade, label: 'Standard 4' },
        { value: 'standard5' as PrimaryGrade, label: 'Standard 5' },
        { value: 'standard6' as PrimaryGrade, label: 'Standard 6' },
        { value: 'standard7' as PrimaryGrade, label: 'Standard 7' },
        { value: 'standard8' as PrimaryGrade, label: 'Standard 8' }
    ];

    const secondaryGrades = [
        { value: 'form1' as SecondaryGrade, label: 'Form 1' },
        { value: 'form2' as SecondaryGrade, label: 'Form 2' },
        { value: 'form3' as SecondaryGrade, label: 'Form 3' },
        { value: 'form4' as SecondaryGrade, label: 'Form 4' }
    ];

    // Get current grades based on selected level
    const currentGrades = selectedLevel === 'primary' ? primaryGrades : secondaryGrades;

    // Resource types - filter out 'schemes' for students
    const allResourceTypes: { value: ResourceType; label: string }[] = [
        { value: 'textbooks', label: 'Textbooks' },
        { value: 'pamphlets', label: 'Pamphlets' },
        { value: 'schemes', label: 'Schemes of Work' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'pastPapers', label: 'Past Papers' }
    ];

    // For students, remove the 'schemes' option completely
    const resourceTypes = user.role === 'student'
        ? allResourceTypes.filter(type => type.value !== 'schemes')
        : allResourceTypes;

    const paperTypes: { value: PaperType; label: string }[] = [
        { value: 'pslce', label: 'PSLCE (MANEB)' },
        { value: 'jce', label: 'JCE (MANEB)' },
        { value: 'msce', label: 'MSCE (MANEB)' },
        { value: 'mock', label: 'Mock Examinations' },
        { value: 'general', label: 'General Papers' }
    ];

    // Get available subjects based on selected level and grade
    const getAvailableSubjects = (): Subject[] => {
        if (selectedLevel === 'primary') {
            return primarySubjects;
        } else {
            if (selectedPaperType === 'jce' || selectedPaperType === 'mock' || selectedPaperType === 'general') {
                return form2Subjects;
            } else if (selectedPaperType === 'msce') {
                return form4Subjects;
            }
            return ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'];
        }
    };

    // Get available paper types based on selected level
    const getAvailablePaperTypes = () => {
        if (selectedLevel === 'primary') {
            return paperTypes.filter(pt => pt.value === 'pslce' || pt.value === 'mock' || pt.value === 'general');
        } else {
            return paperTypes.filter(pt => pt.value !== 'pslce'); // Remove PSLCE for secondary
        }
    };

    const clearFilters = () => {
        setSelectedYear('');
        setSelectedSubject('All Subjects');
        setSelectedPaperType('');
        setSelectedGrade('all');
        setSelectedTerm('all');
    };

    // Determine which filters to show based on resource type
    const showGradeFilter = selectedType !== 'pastPapers'; // Hide grade filter for past papers
    const showSubjectFilter = selectedType !== 'syllabus'; // Show subject filter for all except syllabus
    const showTermFilter = selectedType === 'schemes'; // Show term filter only for schemes
    const showPaperTypeFilter = selectedType === 'pastPapers';
    const showYearFilter = selectedType === 'pastPapers';

    return (
        <>
            <SideMenu
                userRole={user.role}
                isOpen={isSideMenuOpen}
                onClose={() => setSideMenuOpen(false)}
                onMenuClick={() => setSideMenuOpen(true)}
                onCollapse={setIsCollapsed}
            />
            <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header onMenuClick={() => setSideMenuOpen(true)} />

                <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Library</h1>
                        <p className="text-slate-400 mb-8">Your central library for all educational materials organized by level, grade, and resource type.</p>

                        {/* Teacher-Only Tools Section */}
                        {user.role === 'teacher' && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-3">Teacher Toolkit</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <TeacherToolCard
                                        icon={PenSquare}
                                        title="Lesson Plan Creator"
                                        description="Use our template to build and manage your lesson plans."
                                        href="/resources/create-lesson-plan"
                                    />
                                    <TeacherToolCard
                                        icon={FilePlus2}
                                        title="Scheme of Work Generator"
                                        description="Design your termly schemes of work with our intuitive tool."
                                        href="/resources/create-scheme-of-work"
                                    />
                                    <TeacherToolCard
                                        icon={UploadCloud}
                                        title="Upload Resource"
                                        description="Share your own books, papers, or tutorials with the community."
                                        href="/resources/upload"
                                        ctaText="Upload Now"
                                        className="bg-purple-600 hover:bg-purple-700"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Library Navigation */}
                        <div className="mb-8">
                            {/* Level Selection */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => {
                                        setSelectedLevel('primary');
                                        clearFilters();
                                    }}
                                    className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${selectedLevel === 'primary'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    <School className="inline-block mr-2 h-6 w-6" />
                                    Primary School (Standard 1-8)
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedLevel('secondary');
                                        clearFilters();
                                    }}
                                    className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${selectedLevel === 'secondary'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    <GraduationCap className="inline-block mr-2 h-6 w-6" />
                                    Secondary School (Form 1-4)
                                </button>
                            </div>

                            {/* Resource Type Selection */}
                            <div className="flex flex-wrap gap-2 border-b border-slate-700 mb-6 pb-2">
                                {resourceTypes.map(type => (
                                    <button
                                        key={type.value}
                                        onClick={() => {
                                            setSelectedType(type.value);
                                            setSelectedGrade('all');
                                            setSelectedTerm('all');
                                        }}
                                        className={`px-4 py-2 rounded-md font-semibold transition-colors ${selectedType === type.value
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-700'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Filters based on Resource Type */}
                            {(showGradeFilter || showSubjectFilter || showTermFilter || showPaperTypeFilter || showYearFilter) && (
                                <div className="bg-slate-800 p-4 rounded-lg mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Filter className="h-5 w-5 text-blue-400" />
                                        <h3 className="font-semibold text-white">Filter Resources</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {/* Grade Filter - Hidden for past papers */}
                                        {showGradeFilter && (
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Class/Grade</label>
                                                <select
                                                    value={selectedGrade}
                                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                >
                                                    <option value="all">All Classes</option>
                                                    {currentGrades.map(grade => (
                                                        <option key={grade.value} value={grade.value}>{grade.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Subject Filter - Show for all except syllabus */}
                                        {showSubjectFilter && (
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Subject</label>
                                                <select
                                                    value={selectedSubject}
                                                    onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                >
                                                    <option value="All Subjects">All Subjects</option>
                                                    {getAvailableSubjects().map(subject => (
                                                        <option key={subject} value={subject}>{subject}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Term Filter - Only for schemes of work */}
                                        {showTermFilter && (
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">
                                                    <Calendar className="inline-block h-4 w-4 mr-1" />
                                                    Term
                                                </label>
                                                <select
                                                    value={selectedTerm}
                                                    onChange={(e) => setSelectedTerm(e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                >
                                                    <option value="all">All Terms</option>
                                                    <option value="1">Term 1</option>
                                                    <option value="2">Term 2</option>
                                                    <option value="3">Term 3</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Paper Type Filter - Only for past papers */}
                                        {showPaperTypeFilter && (
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Paper Type</label>
                                                <select
                                                    value={selectedPaperType}
                                                    onChange={(e) => setSelectedPaperType(e.target.value as PaperType | '')}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                >
                                                    <option value="">All Paper Types</option>
                                                    {getAvailablePaperTypes().map(pt => (
                                                        <option key={pt.value} value={pt.value}>{pt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Year Filter - Only for past papers */}
                                        {showYearFilter && (
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Year</label>
                                                <select
                                                    value={selectedYear}
                                                    onChange={(e) => setSelectedYear(e.target.value)}
                                                    className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
                                                >
                                                    <option value="">All Years</option>
                                                    {availableYears.map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Clear Filters Button */}
                                        <div className="flex items-end">
                                            <button
                                                onClick={clearFilters}
                                                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resource Display by Grade */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold border-l-4 border-blue-500 pl-3">
                                {selectedLevel === 'primary' ? 'Primary School' : 'Secondary School'} - {resourceLabels[selectedType]}
                                <span className="text-sm font-normal text-slate-400 ml-4">
                                    {selectedGrade !== 'all' && showGradeFilter && `Class: ${currentGrades.find(g => g.value === selectedGrade)?.label} `}
                                    {selectedSubject !== 'All Subjects' && showSubjectFilter && `Subject: ${selectedSubject} `}
                                    {selectedTerm !== 'all' && showTermFilter && `Term: ${selectedTerm} `}
                                    {selectedYear && showYearFilter && `Year: ${selectedYear} `}
                                    {selectedPaperType && showPaperTypeFilter && `Type: ${paperTypeLabels[selectedPaperType]} `}
                                </span>
                            </h2>

                            {selectedLevel === 'primary'
                                ? primaryGrades.map(grade => (
                                    <GradeSection
                                        key={grade.value}
                                        level="primary"
                                        grade={grade.value}
                                        label={grade.label}
                                        selectedType={selectedType}
                                        selectedYear={selectedYear}
                                        selectedSubject={selectedSubject}
                                        selectedPaperType={selectedPaperType || undefined}
                                        selectedGrade={selectedGrade}
                                        selectedTerm={selectedTerm}
                                    />
                                ))
                                : secondaryGrades.map(grade => (
                                    <GradeSection
                                        key={grade.value}
                                        level="secondary"
                                        grade={grade.value}
                                        label={grade.label}
                                        selectedType={selectedType}
                                        selectedYear={selectedYear}
                                        selectedSubject={selectedSubject}
                                        selectedPaperType={selectedPaperType || undefined}
                                        selectedGrade={selectedGrade}
                                        selectedTerm={selectedTerm}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { FileText, Book, Youtube, PenSquare, FilePlus2, Download, UploadCloud, GraduationCap, School, Filter } from 'lucide-react';
// import Link from 'next/link';
// import Header from '@/components/common/Header';
// import SideMenu from '@/components/common/SideMenu';

// // --- TYPE DEFINITIONS ---
// type EducationLevel = 'primary' | 'secondary';
// type PrimaryGrade = 'standard1' | 'standard2' | 'standard3' | 'standard4' | 'standard5' | 'standard6' | 'standard7' | 'standard8';
// type SecondaryGrade = 'form1' | 'form2' | 'form3' | 'form4';
// type ResourceType = 'textbooks' | 'pamphlets' | 'schemes' | 'syllabus' | 'pastPapers';
// type PaperType = 'pslce' | 'jce' | 'msce' | 'mock' | 'general';
// type Subject = 'Mathematics' | 'English' | 'Chichewa' | 'Science' | 'Social Studies' | 'Biology' | 'Physics' | 'Chemistry' | 'Physical Science' | 'History' | 'Geography' | 'All Subjects';

// interface Resource {
//     id: string;
//     title: string;
//     author: string;
//     subject: Subject;
//     year?: string; // For past papers
//     paperType?: PaperType; // For past papers (pslce, jce, msce, mock, general)
//     type: ResourceType;
//     level: EducationLevel;
//     grade: PrimaryGrade | SecondaryGrade;
// }

// // --- AVAILABLE YEARS ---
// const availableYears = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

// // --- SUBJECTS BY LEVEL AND GRADE ---
// const primarySubjects: Subject[] = ['Mathematics', 'English', 'Chichewa', 'Science', 'Social Studies'];
// const form2Subjects: Subject[] = ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'];
// const form4Subjects: Subject[] = ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'];

// // --- MOCK DATA STRUCTURED BY LEVEL, GRADE, AND TYPE ---
// const mockData: Resource[] = [
//     // PRIMARY SCHOOL - Standard 1-7 (No past papers)
//     ...(['standard1', 'standard2', 'standard3', 'standard4', 'standard5', 'standard6', 'standard7'] as PrimaryGrade[]).flatMap(grade => [
//         // Textbooks
//         ...primarySubjects.map((subject, index) => ({
//             id: `p_${grade}_textbook_${index + 1}`,
//             title: `${subject} Textbook ${grade.toUpperCase()}`,
//             author: 'Malawi Institute of Education',
//             subject,
//             type: 'textbooks' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         })),

//         // Pamphlets
//         ...primarySubjects.map((subject, index) => ({
//             id: `p_${grade}_pamphlet_${index + 1}`,
//             title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
//             author: 'Popular Publications',
//             subject,
//             type: 'pamphlets' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         })),

//         // Schemes of Work
//         ...primarySubjects.map((subject, index) => ({
//             id: `p_${grade}_scheme_${index + 1}`,
//             title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
//             author: 'DEMB',
//             subject,
//             type: 'schemes' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         })),

//         // Syllabus
//         {
//             id: `p_${grade}_syllabus_1`,
//             title: `Primary School Syllabus ${grade.toUpperCase()}`,
//             author: 'Malawi Institute of Education',
//             subject: 'All Subjects' as Subject,
//             type: 'syllabus' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         }
//     ]),

//     // PRIMARY SCHOOL - Standard 8 (With PSLCE, Mock, and General papers)
//     ...(['standard8'] as PrimaryGrade[]).flatMap(grade => [
//         // Textbooks
//         ...primarySubjects.map((subject, index) => ({
//             id: `p_${grade}_textbook_${index + 1}`,
//             title: `${subject} Textbook ${grade.toUpperCase()}`,
//             author: 'Malawi Institute of Education',
//             subject,
//             type: 'textbooks' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         })),

//         // Pamphlets
//         ...primarySubjects.map((subject, index) => ({
//             id: `p_${grade}_pamphlet_${index + 1}`,
//             title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
//             author: 'Popular Publications',
//             subject,
//             type: 'pamphlets' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         })),

//         // Schemes of Work
//         ...primarySubjects.map((subject, index) => ({
//             id: `p_${grade}_scheme_${index + 1}`,
//             title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
//             author: 'DEMB',
//             subject,
//             type: 'schemes' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         })),

//         // Syllabus
//         {
//             id: `p_${grade}_syllabus_1`,
//             title: `Primary School Syllabus ${grade.toUpperCase()}`,
//             author: 'Malawi Institute of Education',
//             subject: 'All Subjects' as Subject,
//             type: 'syllabus' as ResourceType,
//             level: 'primary' as EducationLevel,
//             grade
//         },

//         // PSLCE Past Papers (MANEB - Standard 8 only)
//         ...availableYears.flatMap(year =>
//             primarySubjects.map((subject, index) => ({
//                 id: `p_${grade}_pslce_${year}_${index + 1}`,
//                 title: `PSLCE ${subject} Paper ${year}`,
//                 author: 'MANEB',
//                 subject,
//                 year,
//                 paperType: 'pslce' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'primary' as EducationLevel,
//                 grade
//             }))
//         ),

//         // Mock Examinations (Standard 8)
//         ...availableYears.flatMap(year =>
//             primarySubjects.map((subject, index) => ({
//                 id: `p_${grade}_mock_${year}_${index + 1}`,
//                 title: `Mock ${subject} Paper ${year}`,
//                 author: 'District Education Office',
//                 subject,
//                 year,
//                 paperType: 'mock' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'primary' as EducationLevel,
//                 grade
//             }))
//         ),

//         // General Papers (Standard 8)
//         ...availableYears.flatMap(year =>
//             primarySubjects.map((subject, index) => ({
//                 id: `p_${grade}_general_${year}_${index + 1}`,
//                 title: `General ${subject} Paper ${year}`,
//                 author: 'Various Schools',
//                 subject,
//                 year,
//                 paperType: 'general' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'primary' as EducationLevel,
//                 grade
//             }))
//         )
//     ]),

//     // SECONDARY SCHOOL - Form 1 & 3 (No past papers)
//     ...(['form1', 'form3'] as SecondaryGrade[]).flatMap(grade => [
//         // Textbooks
//         ...(grade === 'form1' ?
//             ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'] as Subject[] :
//             ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'] as Subject[]
//         ).map((subject, index) => ({
//             id: `s_${grade}_textbook_${index + 1}`,
//             title: `${subject} Textbook ${grade.toUpperCase()}`,
//             author: grade === 'form1' ? 'Longman Malawi' : 'Oxford University Press',
//             subject,
//             type: 'textbooks' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Pamphlets
//         ...(grade === 'form1' ?
//             ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'] as Subject[] :
//             ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'] as Subject[]
//         ).map((subject, index) => ({
//             id: `s_${grade}_pamphlet_${index + 1}`,
//             title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
//             author: 'MK Publications',
//             subject,
//             type: 'pamphlets' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Schemes of Work
//         ...(grade === 'form1' ?
//             ['Mathematics', 'English', 'Biology', 'Physical Science', 'History', 'Geography'] as Subject[] :
//             ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'] as Subject[]
//         ).map((subject, index) => ({
//             id: `s_${grade}_scheme_${index + 1}`,
//             title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
//             author: 'MoEST',
//             subject,
//             type: 'schemes' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Syllabus
//         {
//             id: `s_${grade}_syllabus_1`,
//             title: `Secondary School Syllabus ${grade.toUpperCase()}`,
//             author: 'Malawi Institute of Education',
//             subject: 'All Subjects' as Subject,
//             type: 'syllabus' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         }
//     ]),

//     // SECONDARY SCHOOL - Form 2 (With JCE, Mock, and General papers)
//     ...(['form2'] as SecondaryGrade[]).flatMap(grade => [
//         // Textbooks
//         ...form2Subjects.map((subject, index) => ({
//             id: `s_${grade}_textbook_${index + 1}`,
//             title: `${subject} Textbook ${grade.toUpperCase()}`,
//             author: 'Longman Malawi',
//             subject,
//             type: 'textbooks' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Pamphlets
//         ...form2Subjects.map((subject, index) => ({
//             id: `s_${grade}_pamphlet_${index + 1}`,
//             title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
//             author: 'MK Publications',
//             subject,
//             type: 'pamphlets' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Schemes of Work
//         ...form2Subjects.map((subject, index) => ({
//             id: `s_${grade}_scheme_${index + 1}`,
//             title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
//             author: 'MoEST',
//             subject,
//             type: 'schemes' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Syllabus
//         {
//             id: `s_${grade}_syllabus_1`,
//             title: `Secondary School Syllabus ${grade.toUpperCase()}`,
//             author: 'Malawi Institute of Education',
//             subject: 'All Subjects' as Subject,
//             type: 'syllabus' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         },

//         // JCE Past Papers (MANEB - Form 2 only)
//         ...availableYears.flatMap(year =>
//             form2Subjects.map((subject, index) => ({
//                 id: `s_${grade}_jce_${year}_${index + 1}`,
//                 title: `JCE ${subject} Paper ${year}`,
//                 author: 'MANEB',
//                 subject,
//                 year,
//                 paperType: 'jce' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'secondary' as EducationLevel,
//                 grade
//             }))
//         ),

//         // Mock Examinations (Form 2)
//         ...availableYears.flatMap(year =>
//             form2Subjects.map((subject, index) => ({
//                 id: `s_${grade}_mock_${year}_${index + 1}`,
//                 title: `Mock ${subject} Paper ${year}`,
//                 author: 'District Education Office',
//                 subject,
//                 year,
//                 paperType: 'mock' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'secondary' as EducationLevel,
//                 grade
//             }))
//         ),

//         // General Papers (Form 2)
//         ...availableYears.flatMap(year =>
//             form2Subjects.map((subject, index) => ({
//                 id: `s_${grade}_general_${year}_${index + 1}`,
//                 title: `General ${subject} Paper ${year}`,
//                 author: 'Various Schools',
//                 subject,
//                 year,
//                 paperType: 'general' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'secondary' as EducationLevel,
//                 grade
//             }))
//         )
//     ]),

//     // SECONDARY SCHOOL - Form 4 (With MSCE, Mock, and General papers)
//     ...(['form4'] as SecondaryGrade[]).flatMap(grade => [
//         // Textbooks
//         ...form4Subjects.map((subject, index) => ({
//             id: `s_${grade}_textbook_${index + 1}`,
//             title: `${subject} Textbook ${grade.toUpperCase()}`,
//             author: 'Oxford University Press',
//             subject,
//             type: 'textbooks' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Pamphlets
//         ...form4Subjects.map((subject, index) => ({
//             id: `s_${grade}_pamphlet_${index + 1}`,
//             title: `${subject} Revision Pamphlet ${grade.toUpperCase()}`,
//             author: 'MK Publications',
//             subject,
//             type: 'pamphlets' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Schemes of Work
//         ...form4Subjects.map((subject, index) => ({
//             id: `s_${grade}_scheme_${index + 1}`,
//             title: `${subject} Scheme of Work ${grade.toUpperCase()} - Term 1`,
//             author: 'MoEST',
//             subject,
//             type: 'schemes' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         })),

//         // Syllabus
//         {
//             id: `s_${grade}_syllabus_1`,
//             title: `Secondary School Syllabus ${grade.toUpperCase()}`,
//             author: 'Malawi Institute of Education',
//             subject: 'All Subjects' as Subject,
//             type: 'syllabus' as ResourceType,
//             level: 'secondary' as EducationLevel,
//             grade
//         },

//         // MSCE Past Papers (MANEB - Form 4 only)
//         ...availableYears.flatMap(year =>
//             form4Subjects.map((subject, index) => ({
//                 id: `s_${grade}_msce_${year}_${index + 1}`,
//                 title: `MSCE ${subject} Paper ${year}`,
//                 author: 'MANEB',
//                 subject,
//                 year,
//                 paperType: 'msce' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'secondary' as EducationLevel,
//                 grade
//             }))
//         ),

//         // Mock Examinations (Form 4)
//         ...availableYears.flatMap(year =>
//             form4Subjects.map((subject, index) => ({
//                 id: `s_${grade}_mock_${year}_${index + 1}`,
//                 title: `Mock ${subject} Paper ${year}`,
//                 author: 'District Education Office',
//                 subject,
//                 year,
//                 paperType: 'mock' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'secondary' as EducationLevel,
//                 grade
//             }))
//         ),

//         // General Papers (Form 4)
//         ...availableYears.flatMap(year =>
//             form4Subjects.map((subject, index) => ({
//                 id: `s_${grade}_general_${year}_${index + 1}`,
//                 title: `General ${subject} Paper ${year}`,
//                 author: 'Various Schools',
//                 subject,
//                 year,
//                 paperType: 'general' as PaperType,
//                 type: 'pastPapers' as ResourceType,
//                 level: 'secondary' as EducationLevel,
//                 grade
//             }))
//         )
//     ])
// ].flat();

// // --- ICON MAPPING FOR RESOURCE TYPES ---
// const resourceIcons = {
//     textbooks: Book,
//     pamphlets: FileText,
//     schemes: FilePlus2,
//     syllabus: GraduationCap,
//     pastPapers: FileText
// };

// const resourceLabels = {
//     textbooks: 'Textbooks',
//     pamphlets: 'Pamphlets',
//     schemes: 'Schemes of Work',
//     syllabus: 'Syllabus',
//     pastPapers: 'Past Papers'
// };

// const paperTypeLabels = {
//     pslce: 'PSLCE (MANEB)',
//     jce: 'JCE (MANEB)',
//     msce: 'MSCE (MANEB)',
//     mock: 'Mock Examinations',
//     general: 'General Papers'
// };

// // --- REUSABLE COMPONENTS ---
// const ResourceCard = ({ icon: Icon, title, subtitle, year, paperType }: { icon: React.ElementType, title: string, subtitle: string, year?: string, paperType?: string }) => (
//     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300">
//         <Icon className="h-8 w-8 text-blue-400 flex-shrink-0" />
//         <div className="flex-grow">
//             <h4 className="font-semibold text-white">{title}</h4>
//             <p className="text-sm text-slate-400">{subtitle}</p>
//             <div className="flex gap-2 mt-1">
//                 {year && <span className="text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded">Year: {year}</span>}
//                 {paperType && paperTypeLabels[paperType as keyof typeof paperTypeLabels] && (
//                     <span className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded">
//                         {paperTypeLabels[paperType as keyof typeof paperTypeLabels]}
//                     </span>
//                 )}
//             </div>
//         </div>
//         <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
//             <Download className="h-5 w-5" />
//         </button>
//     </div>
// );

// const GradeSection = ({
//     level,
//     grade,
//     label,
//     selectedType,
//     selectedYear,
//     selectedSubject,
//     selectedPaperType
// }: {
//     level: EducationLevel,
//     grade: string,
//     label: string,
//     selectedType: ResourceType,
//     selectedYear?: string,
//     selectedSubject?: Subject,
//     selectedPaperType?: PaperType
// }) => {
//     let resources = mockData.filter(r => r.level === level && r.grade === grade && r.type === selectedType);

//     // Apply filters for past papers
//     if (selectedType === 'pastPapers') {
//         if (selectedYear) {
//             resources = resources.filter(r => r.year === selectedYear);
//         }
//         if (selectedSubject && selectedSubject !== 'All Subjects') {
//             resources = resources.filter(r => r.subject === selectedSubject);
//         }
//         if (selectedPaperType) {
//             resources = resources.filter(r => r.paperType === selectedPaperType);
//         }
//     }

//     if (resources.length === 0) return null;

//     // Group past papers by paper type for better organization
//     if (selectedType === 'pastPapers' && !selectedPaperType) {
//         const papersByType = resources.reduce((acc, resource) => {
//             const type = resource.paperType || 'general';
//             if (!acc[type]) acc[type] = [];
//             acc[type].push(resource);
//             return acc;
//         }, {} as Record<string, Resource[]>);

//         return (
//             <div className="mb-6">
//                 <h4 className="text-lg font-semibold text-white mb-3 bg-slate-800 p-2 rounded-lg border-l-4 border-yellow-500">
//                     {label}
//                 </h4>
//                 {Object.entries(papersByType).map(([paperType, paperResources]) => (
//                     <div key={paperType} className="mb-4">
//                         <h5 className="text-md font-semibold text-blue-400 mb-2 ml-2">
//                             {paperTypeLabels[paperType as keyof typeof paperTypeLabels]}
//                         </h5>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             {paperResources.map(resource => (
//                                 <ResourceCard
//                                     key={resource.id}
//                                     icon={resourceIcons[resource.type]}
//                                     title={resource.title}
//                                     subtitle={resource.author}
//                                     year={resource.year}
//                                     paperType={resource.paperType}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         );
//     }

//     return (
//         <div className="mb-6">
//             <h4 className="text-lg font-semibold text-white mb-3 bg-slate-800 p-2 rounded-lg border-l-4 border-yellow-500">
//                 {label}
//             </h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {resources.map(resource => (
//                     <ResourceCard
//                         key={resource.id}
//                         icon={resourceIcons[resource.type]}
//                         title={resource.title}
//                         subtitle={resource.author}
//                         year={resource.year}
//                         paperType={resource.paperType}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// const TeacherToolCard = ({ icon: Icon, title, description, href, ctaText = "Create New", className = "bg-green-600 hover:bg-green-700" }: { icon: React.ElementType, title: string, description: string, href: string, ctaText?: string, className?: string }) => (
//     <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
//         <div className="flex items-center mb-3">
//             <Icon className="h-7 w-7 text-green-400 mr-3" />
//             <h3 className="text-xl font-bold text-white">{title}</h3>
//         </div>
//         <p className="text-slate-400 flex-grow mb-4">{description}</p>
//         <Link href={href} className={`mt-auto text-center text-white font-bold py-2 px-4 rounded-lg transition-colors ${className}`}>
//             {ctaText}
//         </Link>
//     </div>
// );

// // --- MAIN PAGE COMPONENT ---
// export default function ResourcesPage() {
//     const { user } = useAppContext();
//     const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('primary');
//     const [selectedType, setSelectedType] = useState<ResourceType>('textbooks');
//     const [selectedYear, setSelectedYear] = useState<string>('');
//     const [selectedSubject, setSelectedSubject] = useState<Subject>('All Subjects');
//     const [selectedPaperType, setSelectedPaperType] = useState<PaperType | ''>('');
//     const [isSideMenuOpen, setSideMenuOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(false);

//     // Security Guard
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user) { window.location.replace('/'); }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading resources...</p>
//             </div>
//         );
//     }

//     const primaryGrades = [
//         { value: 'standard1' as PrimaryGrade, label: 'Standard 1' },
//         { value: 'standard2' as PrimaryGrade, label: 'Standard 2' },
//         { value: 'standard3' as PrimaryGrade, label: 'Standard 3' },
//         { value: 'standard4' as PrimaryGrade, label: 'Standard 4' },
//         { value: 'standard5' as PrimaryGrade, label: 'Standard 5' },
//         { value: 'standard6' as PrimaryGrade, label: 'Standard 6' },
//         { value: 'standard7' as PrimaryGrade, label: 'Standard 7' },
//         { value: 'standard8' as PrimaryGrade, label: 'Standard 8' }
//     ];

//     const secondaryGrades = [
//         { value: 'form1' as SecondaryGrade, label: 'Form 1' },
//         { value: 'form2' as SecondaryGrade, label: 'Form 2' },
//         { value: 'form3' as SecondaryGrade, label: 'Form 3' },
//         { value: 'form4' as SecondaryGrade, label: 'Form 4' }
//     ];

//     // Resource types - filter out 'schemes' for students
//     const allResourceTypes: { value: ResourceType; label: string }[] = [
//         { value: 'textbooks', label: 'Textbooks' },
//         { value: 'pamphlets', label: 'Pamphlets' },
//         { value: 'schemes', label: 'Schemes of Work' },
//         { value: 'syllabus', label: 'Syllabus' },
//         { value: 'pastPapers', label: 'Past Papers' }
//     ];

//     // For students, remove the 'schemes' option completely
//     const resourceTypes = user.role === 'student'
//         ? allResourceTypes.filter(type => type.value !== 'schemes')
//         : allResourceTypes;

//     const paperTypes: { value: PaperType; label: string }[] = [
//         { value: 'pslce', label: 'PSLCE (MANEB)' },
//         { value: 'jce', label: 'JCE (MANEB)' },
//         { value: 'msce', label: 'MSCE (MANEB)' },
//         { value: 'mock', label: 'Mock Examinations' },
//         { value: 'general', label: 'General Papers' }
//     ];

//     // Get available subjects based on selected level and grade
//     const getAvailableSubjects = (): Subject[] => {
//         if (selectedLevel === 'primary') {
//             return primarySubjects;
//         } else {
//             if (selectedPaperType === 'jce' || selectedPaperType === 'mock' || selectedPaperType === 'general') {
//                 return form2Subjects;
//             } else if (selectedPaperType === 'msce') {
//                 return form4Subjects;
//             }
//             return ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'];
//         }
//     };

//     // Get available paper types based on selected level
//     const getAvailablePaperTypes = () => {
//         if (selectedLevel === 'primary') {
//             return paperTypes.filter(pt => pt.value === 'pslce' || pt.value === 'mock' || pt.value === 'general');
//         } else {
//             return paperTypes.filter(pt => pt.value !== 'pslce'); // Remove PSLCE for secondary
//         }
//     };

//     const clearFilters = () => {
//         setSelectedYear('');
//         setSelectedSubject('All Subjects');
//         setSelectedPaperType('');
//     };

//     return (
//         <>
//             <SideMenu
//                 userRole={user.role}
//                 isOpen={isSideMenuOpen}
//                 onClose={() => setSideMenuOpen(false)}
//                 onMenuClick={() => setSideMenuOpen(true)}
//                 onCollapse={setIsCollapsed}
//             />
//             <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
//                 <Header onMenuClick={() => setSideMenuOpen(true)} />

//                 <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                     <div className="max-w-7xl mx-auto">
//                         <h1 className="text-4xl font-bold mb-2">Library</h1>
//                         <p className="text-slate-400 mb-8">Your central library for all educational materials organized by level, grade, and resource type.</p>

//                         {/* Teacher-Only Tools Section */}
//                         {user.role === 'teacher' && (
//                             <div className="mb-12">
//                                 <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-3">Teacher Toolkit</h2>
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                     <TeacherToolCard
//                                         icon={PenSquare}
//                                         title="Lesson Plan Creator"
//                                         description="Use our template to build and manage your lesson plans."
//                                         href="/resources/create-lesson-plan"
//                                     />
//                                     <TeacherToolCard
//                                         icon={FilePlus2}
//                                         title="Scheme of Work Generator"
//                                         description="Design your termly schemes of work with our intuitive tool."
//                                         href="/resources/create-scheme-of-work"
//                                     />
//                                     <TeacherToolCard
//                                         icon={UploadCloud}
//                                         title="Upload Resource"
//                                         description="Share your own books, papers, or tutorials with the community."
//                                         href="/resources/upload"
//                                         ctaText="Upload Now"
//                                         className="bg-purple-600 hover:bg-purple-700"
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Library Navigation */}
//                         <div className="mb-8">
//                             {/* Level Selection */}
//                             <div className="flex gap-4 mb-6">
//                                 <button
//                                     onClick={() => {
//                                         setSelectedLevel('primary');
//                                         clearFilters();
//                                     }}
//                                     className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${selectedLevel === 'primary'
//                                         ? 'bg-blue-600 text-white shadow-lg'
//                                         : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//                                         }`}
//                                 >
//                                     <School className="inline-block mr-2 h-6 w-6" />
//                                     Primary School (Standard 1-8)
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         setSelectedLevel('secondary');
//                                         clearFilters();
//                                     }}
//                                     className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${selectedLevel === 'secondary'
//                                         ? 'bg-blue-600 text-white shadow-lg'
//                                         : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//                                         }`}
//                                 >
//                                     <GraduationCap className="inline-block mr-2 h-6 w-6" />
//                                     Secondary School (Form 1-4)
//                                 </button>
//                             </div>

//                             {/* Resource Type Selection - Schemes tab completely removed for students */}
//                             <div className="flex flex-wrap gap-2 border-b border-slate-700 mb-6 pb-2">
//                                 {resourceTypes.map(type => (
//                                     <button
//                                         key={type.value}
//                                         onClick={() => {
//                                             setSelectedType(type.value);
//                                             clearFilters();
//                                         }}
//                                         className={`px-4 py-2 rounded-md font-semibold transition-colors ${selectedType === type.value
//                                             ? 'bg-blue-600 text-white'
//                                             : 'text-slate-300 hover:bg-slate-700'
//                                             }`}
//                                     >
//                                         {type.label}
//                                     </button>
//                                 ))}
//                             </div>

//                             {/* Filters for Past Papers */}
//                             {selectedType === 'pastPapers' && (
//                                 <div className="bg-slate-800 p-4 rounded-lg mb-6">
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <Filter className="h-5 w-5 text-blue-400" />
//                                         <h3 className="font-semibold text-white">Filter Past Papers</h3>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                                         {/* Paper Type Filter */}
//                                         <div>
//                                             <label className="block text-sm text-slate-400 mb-1">Paper Type</label>
//                                             <select
//                                                 value={selectedPaperType}
//                                                 onChange={(e) => setSelectedPaperType(e.target.value as PaperType | '')}
//                                                 className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                             >
//                                                 <option value="">All Paper Types</option>
//                                                 {getAvailablePaperTypes().map(pt => (
//                                                     <option key={pt.value} value={pt.value}>{pt.label}</option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         {/* Year Filter */}
//                                         <div>
//                                             <label className="block text-sm text-slate-400 mb-1">Year</label>
//                                             <select
//                                                 value={selectedYear}
//                                                 onChange={(e) => setSelectedYear(e.target.value)}
//                                                 className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                             >
//                                                 <option value="">All Years</option>
//                                                 {availableYears.map(year => (
//                                                     <option key={year} value={year}>{year}</option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         {/* Subject Filter */}
//                                         <div>
//                                             <label className="block text-sm text-slate-400 mb-1">Subject</label>
//                                             <select
//                                                 value={selectedSubject}
//                                                 onChange={(e) => setSelectedSubject(e.target.value as Subject)}
//                                                 className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                             >
//                                                 <option value="All Subjects">All Subjects</option>
//                                                 {getAvailableSubjects().map(subject => (
//                                                     <option key={subject} value={subject}>{subject}</option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         {/* Clear Filters Button */}
//                                         <div className="flex items-end">
//                                             <button
//                                                 onClick={clearFilters}
//                                                 className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//                                             >
//                                                 Clear Filters
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Resource Display by Grade */}
//                         <div className="space-y-8">
//                             <h2 className="text-2xl font-bold border-l-4 border-blue-500 pl-3">
//                                 {selectedLevel === 'primary' ? 'Primary School' : 'Secondary School'} - {resourceLabels[selectedType]}
//                                 {selectedType === 'pastPapers' && (
//                                     <span className="text-sm font-normal text-slate-400 ml-4">
//                                         {selectedYear && `Year: ${selectedYear} `}
//                                         {selectedSubject !== 'All Subjects' && `Subject: ${selectedSubject} `}
//                                         {selectedPaperType && `Type: ${paperTypeLabels[selectedPaperType]} `}
//                                     </span>
//                                 )}
//                             </h2>

//                             {selectedLevel === 'primary'
//                                 ? primaryGrades.map(grade => (
//                                     <GradeSection
//                                         key={grade.value}
//                                         level="primary"
//                                         grade={grade.value}
//                                         label={grade.label}
//                                         selectedType={selectedType}
//                                         selectedYear={selectedYear}
//                                         selectedSubject={selectedSubject}
//                                         selectedPaperType={selectedPaperType || undefined}
//                                     />
//                                 ))
//                                 : secondaryGrades.map(grade => (
//                                     <GradeSection
//                                         key={grade.value}
//                                         level="secondary"
//                                         grade={grade.value}
//                                         label={grade.label}
//                                         selectedType={selectedType}
//                                         selectedYear={selectedYear}
//                                         selectedSubject={selectedSubject}
//                                         selectedPaperType={selectedPaperType || undefined}
//                                     />
//                                 ))
//                             }
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// // import Header from '../components/common/Header';
// // CHANGE 1: Imported a new icon for the upload tool
// import { FileText, Book, Youtube, PenSquare, FilePlus2, Download, UploadCloud } from 'lucide-react';
// import Link from 'next/link';
// import Header from '@/components/common/Header';
// import SideMenu from '@/components/common/SideMenu';

// // --- MOCK DATA ---
// const mockData = {
//     books: [
//         { id: 'b1', title: 'Complete Guide to MSCE Biology', author: 'Dr. A. Banda' },
//         { id: 'b2', title: 'Fundamentals of Algebra', author: 'Prof. L. Tembo' },
//     ],
//     pastPapers: [
//         { id: 'p1', title: '2024 MSCE Mathematics Paper 1', subject: 'Mathematics' },
//         { id: 'p2', title: '2023 MSCE Physical Science Paper 2', subject: 'Physics' },
//     ],
//     tutorials: [
//         { id: 'tu1', title: 'How to Solve Stoichiometry Problems', subject: 'Chemistry' },
//         { id: 'tu2', title: 'Analyzing Shakespearean Sonnets', subject: 'English' },
//     ],
//     // CHANGE 2: Added mock data for the new Syllabi category
//     syllabi: [
//         { id: 's1', title: 'Senior Secondary Biology Syllabus', subject: 'Biology' },
//         { id: 's2', title: 'Senior Secondary Physics Syllabus', subject: 'Physics' },
//     ],
// };

// // CHANGE 3: Added 'syllabi' to our list of resource categories
// type ResourceCategory = 'all' | 'books' | 'pastPapers' | 'tutorials' | 'syllabi';

// // --- REUSABLE COMPONENTS (No changes needed here) ---

// const ResourceCard = ({ icon: Icon, title, subtitle }: { icon: React.ElementType, title: string, subtitle: string }) => (
//     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300">
//         <Icon className="h-8 w-8 text-blue-400 flex-shrink-0" />
//         <div className="flex-grow">
//             <h4 className="font-semibold text-white">{title}</h4>
//             <p className="text-sm text-slate-400">{subtitle}</p>
//         </div>
//         <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
//             <Download className="h-5 w-5" />
//         </button>
//     </div>
// );

// const TeacherToolCard = ({ icon: Icon, title, description, href, ctaText = "Create New", className = "bg-green-600 hover:bg-green-700" }: { icon: React.ElementType, title: string, description: string, href: string, ctaText?: string, className?: string }) => (
//     <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
//         <div className="flex items-center mb-3">
//             <Icon className="h-7 w-7 text-green-400 mr-3" />
//             <h3 className="text-xl font-bold text-white">{title}</h3>
//         </div>
//         <p className="text-slate-400 flex-grow mb-4">{description}</p>
//         <Link href={href} className={`mt-auto text-center text-white font-bold py-2 px-4 rounded-lg transition-colors ${className}`}>
//             {ctaText}
//         </Link>
//     </div>
// );


// // --- MAIN PAGE COMPONENT ---

// export default function ResourcesPage() {
//     const { user } = useAppContext();
//     const [activeTab, setActiveTab] = useState<ResourceCategory>('all');
//     const [isSideMenuOpen, setSideMenuOpen] = useState(false); // ADD THIS
//     const [isCollapsed, setIsCollapsed] = useState(false); // ===== ADD THIS =====

//     // Security Guard
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user) { window.location.replace('/'); }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading resources...</p>
//             </div>
//         );
//     }

//     const resourcesToShow = () => {
//         switch (activeTab) {
//             case 'books': return mockData.books.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.author} />);
//             case 'pastPapers': return mockData.pastPapers.map(item => <ResourceCard key={item.id} icon={FileText} title={item.title} subtitle={item.subject} />);
//             case 'tutorials': return mockData.tutorials.map(item => <ResourceCard key={item.id} icon={Youtube} title={item.title} subtitle={item.subject} />);
//             // CHANGE 4: Added the display logic for the Syllabi tab
//             case 'syllabi': return mockData.syllabi.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.subject} />);
//             default: return [
//                 ...mockData.books.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.author} />),
//                 ...mockData.pastPapers.map(item => <ResourceCard key={item.id} icon={FileText} title={item.title} subtitle={item.subject} />),
//                 ...mockData.tutorials.map(item => <ResourceCard key={item.id} icon={Youtube} title={item.title} subtitle={item.subject} />),
//                 // CHANGE 5: Added Syllabi to the 'All Resources' view
//                 ...mockData.syllabi.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.subject} />),
//             ];
//         }
//     };

//     const TabButton = ({ tab, label }: { tab: ResourceCategory, label: string }) => (
//         <button
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
//         >
//             {label}
//         </button>
//     );

//     return (
//         <>
//             {/* ADD SIDEMENU */}
//             <SideMenu
//                 userRole={user.role}
//                 isOpen={isSideMenuOpen}
//                 onClose={() => setSideMenuOpen(false)}
//                 onMenuClick={() => setSideMenuOpen(true)}  // ===== ADD THIS =====
//                 onCollapse={setIsCollapsed}                // ===== ADD THIS =====
//             />
//             <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
//                 <Header
//                     onMenuClick={() => setSideMenuOpen(true)} // ADD THIS
//                 />

//                 <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                     <div className="max-w-7xl mx-auto">
//                         <h1 className="text-4xl font-bold mb-2">Online Libra</h1>
//                         <p className="text-slate-400 mb-10">Your central library for all educational materials and teaching tools.</p>

//                         {/* Teacher-Only Tools Section */}
//                         {user.role === 'teacher' && (
//                             <div className="mb-12">
//                                 <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-3">Teacher Toolkit</h2>
//                                 {/* CHANGE 6: Changed grid to 3 columns to accommodate the new tool */}
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                     <TeacherToolCard
//                                         icon={PenSquare}
//                                         title="Lesson Plan Creator"
//                                         description="Use our template to build and manage your lesson plans."
//                                         href="/resources/create-lesson-plan"
//                                     />
//                                     <TeacherToolCard
//                                         icon={FilePlus2}
//                                         title="Scheme of Work Generator"
//                                         description="Design your termly schemes of work with our intuitive tool."
//                                         href="/resources/create-scheme-of-work"
//                                     />
//                                     {/* CHANGE 7: Added the new "Upload Resource" tool for teachers */}
//                                     <TeacherToolCard
//                                         icon={UploadCloud}
//                                         title="Upload Resource"
//                                         description="Share your own books, papers, or tutorials with the community."
//                                         href="/resources/upload"
//                                         ctaText="Upload Now"
//                                         className="bg-purple-600 hover:bg-purple-700"
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Shared Resources Section */}
//                         <div>
//                             <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-3">Shared Library</h2>

//                             {/* Tab Navigation */}
//                             <div className="flex flex-wrap gap-2 border-b border-slate-700 mb-6 pb-2">
//                                 <TabButton tab="all" label="All Resources" />
//                                 <TabButton tab="books" label="Books" />
//                                 <TabButton tab="pastPapers" label="Past Papers" />
//                                 <TabButton tab="tutorials" label="Tutorials" />
//                                 {/* CHANGE 8: Added the new Syllabi tab button */}
//                                 <TabButton tab="syllabi" label="Syllabi" />
//                             </div>

//                             {/* Resource Grid */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {resourcesToShow()}
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// }