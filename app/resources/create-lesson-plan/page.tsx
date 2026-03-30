// 'use client';

// import { useState } from 'react';
// // import { useAppContext } from '../../context/AppContext';
// import { ArrowLeft, Save, Eye, Download, School, GraduationCap, BookOpen, Calendar, User, FileText } from 'lucide-react';
// import Link from 'next/link';
// import Header from '@/components/common/Header';
// import SideMenu from '@/components/common/SideMenu';
// import { useAppContext } from '@/context/AppContext';

// type EducationLevel = 'primary' | 'secondary';
// type PrimaryGrade = 'standard1' | 'standard2' | 'standard3' | 'standard4' | 'standard5' | 'standard6' | 'standard7' | 'standard8';
// type SecondaryGrade = 'form1' | 'form2' | 'form3' | 'form4';
// type Subject = 'Mathematics' | 'English' | 'Chichewa' | 'Science' | 'Social Studies' | 'Biology' | 'Physics' | 'Chemistry' | 'Physical Science' | 'History' | 'Geography';

// interface LessonPlan {
//     id: string;
//     title: string;
//     level: EducationLevel;
//     grade: PrimaryGrade | SecondaryGrade;
//     subject: Subject;
//     topic: string;
//     duration: string;
//     date: string;
//     objectives: string[];
//     materials: string[];
//     introduction: string;
//     development: string;
//     assessment: string;
//     conclusion: string;
//     teacher: string;
//     school: string;
//     term: number;
//     week: number;
// }

// export default function CreateLessonPlanPage() {
//     const { user } = useAppContext();
//     const [isSideMenuOpen, setSideMenuOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [previewMode, setPreviewMode] = useState(false);

//     const [lessonPlan, setLessonPlan] = useState<Partial<LessonPlan>>({
//         level: 'primary',
//         grade: 'standard1',
//         subject: 'Mathematics',
//         term: 1,
//         week: 1,
//         objectives: [''],
//         materials: ['']
//     });

//     const primaryGrades = [
//         'standard1', 'standard2', 'standard3', 'standard4', 'standard5', 'standard6', 'standard7', 'standard8'
//     ] as const;

//     const secondaryGrades = [
//         'form1', 'form2', 'form3', 'form4'
//     ] as const;

//     const primarySubjects: Subject[] = ['Mathematics', 'English', 'Chichewa', 'Science', 'Social Studies'];
//     const secondarySubjects: Subject[] = ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'];

//     const getSubjects = () => {
//         return lessonPlan.level === 'primary' ? primarySubjects : secondarySubjects;
//     };

//     const getGradeLabel = (grade: string) => {
//         if (grade.startsWith('standard')) return grade.replace('standard', 'Standard ');
//         if (grade.startsWith('form')) return grade.replace('form', 'Form ');
//         return grade;
//     };

//     const addObjective = () => {
//         setLessonPlan({
//             ...lessonPlan,
//             objectives: [...(lessonPlan.objectives || []), '']
//         });
//     };

//     const updateObjective = (index: number, value: string) => {
//         const newObjectives = [...(lessonPlan.objectives || [])];
//         newObjectives[index] = value;
//         setLessonPlan({ ...lessonPlan, objectives: newObjectives });
//     };

//     const removeObjective = (index: number) => {
//         const newObjectives = (lessonPlan.objectives || []).filter((_, i) => i !== index);
//         setLessonPlan({ ...lessonPlan, objectives: newObjectives });
//     };

//     const addMaterial = () => {
//         setLessonPlan({
//             ...lessonPlan,
//             materials: [...(lessonPlan.materials || []), '']
//         });
//     };

//     const updateMaterial = (index: number, value: string) => {
//         const newMaterials = [...(lessonPlan.materials || [])];
//         newMaterials[index] = value;
//         setLessonPlan({ ...lessonPlan, materials: newMaterials });
//     };

//     const removeMaterial = (index: number) => {
//         const newMaterials = (lessonPlan.materials || []).filter((_, i) => i !== index);
//         setLessonPlan({ ...lessonPlan, materials: newMaterials });
//     };

//     const handleSave = () => {
//         // Here you would save to database
//         console.log('Saving lesson plan:', lessonPlan);
//         alert('Lesson plan saved successfully!');
//     };

//     const handleExport = () => {
//         // Here you would export as PDF/DOC
//         console.log('Exporting lesson plan:', lessonPlan);
//         alert('Lesson plan exported successfully!');
//     };

//     return (
//         <>
//             <SideMenu
//                 userRole={user?.role || 'teacher'}
//                 isOpen={isSideMenuOpen}
//                 onClose={() => setSideMenuOpen(false)}
//                 onMenuClick={() => setSideMenuOpen(true)}
//                 onCollapse={setIsCollapsed}
//             />
//             <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
//                 <Header onMenuClick={() => setSideMenuOpen(true)} />

//                 <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                     <div className="max-w-7xl mx-auto">
//                         {/* Header with navigation */}
//                         <div className="flex items-center justify-between mb-6">
//                             <div className="flex items-center gap-4">
//                                 <Link
//                                     href="/resources"
//                                     className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
//                                 >
//                                     <ArrowLeft className="h-5 w-5" />
//                                 </Link>
//                                 <h1 className="text-3xl font-bold">Create Lesson Plan</h1>
//                             </div>
//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={() => setPreviewMode(!previewMode)}
//                                     className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//                                 >
//                                     <Eye className="h-5 w-5" />
//                                     {previewMode ? 'Edit' : 'Preview'}
//                                 </button>
//                                 <button
//                                     onClick={handleSave}
//                                     className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//                                 >
//                                     <Save className="h-5 w-5" />
//                                     Save
//                                 </button>
//                                 <button
//                                     onClick={handleExport}
//                                     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
//                                 >
//                                     <Download className="h-5 w-5" />
//                                     Export
//                                 </button>
//                             </div>
//                         </div>

//                         {previewMode ? (
//                             // Preview Mode
//                             <div className="bg-white text-gray-900 rounded-lg p-8 shadow-xl">
//                                 <div className="border-b-2 border-gray-300 pb-4 mb-6">
//                                     <h1 className="text-3xl font-bold text-center text-blue-600">LESSON PLAN</h1>
//                                     <p className="text-center text-gray-600 mt-2">{lessonPlan.school || 'School Name'}</p>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4 mb-6">
//                                     <div>
//                                         <p className="font-semibold">Teacher: <span className="font-normal">{lessonPlan.teacher || user?.name || 'Teacher Name'}</span></p>
//                                         <p className="font-semibold">Subject: <span className="font-normal">{lessonPlan.subject}</span></p>
//                                         <p className="font-semibold">Topic: <span className="font-normal">{lessonPlan.topic || 'Topic'}</span></p>
//                                     </div>
//                                     <div>
//                                         <p className="font-semibold">Class: <span className="font-normal">{getGradeLabel(lessonPlan.grade || '')}</span></p>
//                                         <p className="font-semibold">Duration: <span className="font-normal">{lessonPlan.duration || '40 minutes'}</span></p>
//                                         <p className="font-semibold">Date: <span className="font-normal">{lessonPlan.date || new Date().toLocaleDateString()}</span></p>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div>
//                                         <h2 className="text-xl font-bold bg-blue-100 p-2 rounded">Learning Objectives</h2>
//                                         <ul className="list-disc pl-6 mt-2">
//                                             {(lessonPlan.objectives || ['']).filter(obj => obj.trim()).map((obj, i) => (
//                                                 <li key={i}>{obj}</li>
//                                             ))}
//                                         </ul>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold bg-blue-100 p-2 rounded">Materials/Resources</h2>
//                                         <ul className="list-disc pl-6 mt-2">
//                                             {(lessonPlan.materials || ['']).filter(mat => mat.trim()).map((mat, i) => (
//                                                 <li key={i}>{mat}</li>
//                                             ))}
//                                         </ul>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold bg-blue-100 p-2 rounded">Introduction (5 minutes)</h2>
//                                         <p className="mt-2 p-2 border rounded">{lessonPlan.introduction || 'Introduction to the lesson...'}</p>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold bg-blue-100 p-2 rounded">Lesson Development (25 minutes)</h2>
//                                         <p className="mt-2 p-2 border rounded">{lessonPlan.development || 'Main lesson content and activities...'}</p>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold bg-blue-100 p-2 rounded">Assessment (5 minutes)</h2>
//                                         <p className="mt-2 p-2 border rounded">{lessonPlan.assessment || 'Assessment methods and questions...'}</p>
//                                     </div>

//                                     <div>
//                                         <h2 className="text-xl font-bold bg-blue-100 p-2 rounded">Conclusion (5 minutes)</h2>
//                                         <p className="mt-2 p-2 border rounded">{lessonPlan.conclusion || 'Summary and wrap-up...'}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             // Edit Mode
//                             <div className="bg-slate-800 rounded-lg p-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Education Level</label>
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={() => setLessonPlan({ ...lessonPlan, level: 'primary', grade: 'standard1' })}
//                                                 className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${lessonPlan.level === 'primary'
//                                                     ? 'bg-blue-600 text-white'
//                                                     : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                                                     }`}
//                                             >
//                                                 <School className="inline-block mr-2 h-4 w-4" />
//                                                 Primary
//                                             </button>
//                                             <button
//                                                 onClick={() => setLessonPlan({ ...lessonPlan, level: 'secondary', grade: 'form1' })}
//                                                 className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${lessonPlan.level === 'secondary'
//                                                     ? 'bg-blue-600 text-white'
//                                                     : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                                                     }`}
//                                             >
//                                                 <GraduationCap className="inline-block mr-2 h-4 w-4" />
//                                                 Secondary
//                                             </button>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Grade/Form</label>
//                                         <select
//                                             value={lessonPlan.grade}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, grade: e.target.value as any })}
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         >
//                                             {(lessonPlan.level === 'primary' ? primaryGrades : secondaryGrades).map(grade => (
//                                                 <option key={grade} value={grade}>
//                                                     {grade.startsWith('standard') ? grade.replace('standard', 'Standard ') : grade.replace('form', 'Form ')}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Subject</label>
//                                         <select
//                                             value={lessonPlan.subject}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, subject: e.target.value as Subject })}
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         >
//                                             {getSubjects().map(subject => (
//                                                 <option key={subject} value={subject}>{subject}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Topic/Title</label>
//                                         <input
//                                             type="text"
//                                             value={lessonPlan.topic || ''}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, topic: e.target.value })}
//                                             placeholder="e.g., Addition of Fractions"
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Duration</label>
//                                         <input
//                                             type="text"
//                                             value={lessonPlan.duration || ''}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, duration: e.target.value })}
//                                             placeholder="e.g., 40 minutes"
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Term</label>
//                                         <select
//                                             value={lessonPlan.term}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, term: parseInt(e.target.value) })}
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         >
//                                             <option value={1}>Term 1</option>
//                                             <option value={2}>Term 2</option>
//                                             <option value={3}>Term 3</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Week</label>
//                                         <input
//                                             type="number"
//                                             min="1"
//                                             max="13"
//                                             value={lessonPlan.week || 1}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, week: parseInt(e.target.value) })}
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Date</label>
//                                         <input
//                                             type="date"
//                                             value={lessonPlan.date || ''}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, date: e.target.value })}
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">Teacher Name</label>
//                                         <input
//                                             type="text"
//                                             value={lessonPlan.teacher || user?.name || ''}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, teacher: e.target.value })}
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-slate-400 mb-2">School Name</label>
//                                         <input
//                                             type="text"
//                                             value={lessonPlan.school || ''}
//                                             onChange={(e) => setLessonPlan({ ...lessonPlan, school: e.target.value })}
//                                             className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Learning Objectives */}
//                                 <div className="mb-6">
//                                     <label className="block text-slate-400 mb-2">Learning Objectives</label>
//                                     {(lessonPlan.objectives || []).map((obj, index) => (
//                                         <div key={index} className="flex gap-2 mb-2">
//                                             <input
//                                                 type="text"
//                                                 value={obj}
//                                                 onChange={(e) => updateObjective(index, e.target.value)}
//                                                 placeholder={`Objective ${index + 1}`}
//                                                 className="flex-1 bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                             />
//                                             <button
//                                                 onClick={() => removeObjective(index)}
//                                                 className="px-3 bg-red-600 hover:bg-red-700 rounded-lg text-white"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         onClick={addObjective}
//                                         className="mt-2 text-blue-400 hover:text-blue-300"
//                                     >
//                                         + Add Objective
//                                     </button>
//                                 </div>

//                                 {/* Materials */}
//                                 <div className="mb-6">
//                                     <label className="block text-slate-400 mb-2">Teaching Materials/Resources</label>
//                                     {(lessonPlan.materials || []).map((material, index) => (
//                                         <div key={index} className="flex gap-2 mb-2">
//                                             <input
//                                                 type="text"
//                                                 value={material}
//                                                 onChange={(e) => updateMaterial(index, e.target.value)}
//                                                 placeholder={`Material ${index + 1}`}
//                                                 className="flex-1 bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                             />
//                                             <button
//                                                 onClick={() => removeMaterial(index)}
//                                                 className="px-3 bg-red-600 hover:bg-red-700 rounded-lg text-white"
//                                             >
//                                                 ×
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         onClick={addMaterial}
//                                         className="mt-2 text-blue-400 hover:text-blue-300"
//                                     >
//                                         + Add Material
//                                     </button>
//                                 </div>

//                                 {/* Introduction */}
//                                 <div className="mb-6">
//                                     <label className="block text-slate-400 mb-2">Introduction (5 minutes)</label>
//                                     <textarea
//                                         value={lessonPlan.introduction || ''}
//                                         onChange={(e) => setLessonPlan({ ...lessonPlan, introduction: e.target.value })}
//                                         placeholder="How will you introduce the lesson? What will capture students' attention?"
//                                         rows={4}
//                                         className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                     />
//                                 </div>

//                                 {/* Lesson Development */}
//                                 <div className="mb-6">
//                                     <label className="block text-slate-400 mb-2">Lesson Development (25 minutes)</label>
//                                     <textarea
//                                         value={lessonPlan.development || ''}
//                                         onChange={(e) => setLessonPlan({ ...lessonPlan, development: e.target.value })}
//                                         placeholder="Step-by-step teaching activities, teacher and student activities"
//                                         rows={6}
//                                         className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                     />
//                                 </div>

//                                 {/* Assessment */}
//                                 <div className="mb-6">
//                                     <label className="block text-slate-400 mb-2">Assessment (5 minutes)</label>
//                                     <textarea
//                                         value={lessonPlan.assessment || ''}
//                                         onChange={(e) => setLessonPlan({ ...lessonPlan, assessment: e.target.value })}
//                                         placeholder="How will you assess student understanding? Questions, exercises, etc."
//                                         rows={4}
//                                         className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                     />
//                                 </div>

//                                 {/* Conclusion */}
//                                 <div className="mb-6">
//                                     <label className="block text-slate-400 mb-2">Conclusion (5 minutes)</label>
//                                     <textarea
//                                         value={lessonPlan.conclusion || ''}
//                                         onChange={(e) => setLessonPlan({ ...lessonPlan, conclusion: e.target.value })}
//                                         placeholder="How will you summarize the lesson? Any homework assignments?"
//                                         rows={4}
//                                         className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// }