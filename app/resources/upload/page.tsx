// 'use client';

// import { useState } from 'react';

// import { ArrowLeft, Upload, FileText, Book, Youtube, FilePlus2, X, Check, AlertCircle, School, GraduationCap } from 'lucide-react';
// import Link from 'next/link';
// import Header from '@/components/common/Header';
// import SideMenu from '@/components/common/SideMenu';
// import { useAppContext } from '@/context/AppContext';

// type EducationLevel = 'primary' | 'secondary';
// type PrimaryGrade = 'standard1' | 'standard2' | 'standard3' | 'standard4' | 'standard5' | 'standard6' | 'standard7' | 'standard8';
// type SecondaryGrade = 'form1' | 'form2' | 'form3' | 'form4';
// type ResourceType = 'textbooks' | 'pamphlets' | 'schemes' | 'syllabus' | 'pastPapers';
// type PaperType = 'pslce' | 'jce' | 'msce' | 'mock' | 'general';
// type Subject = 'Mathematics' | 'English' | 'Chichewa' | 'Science' | 'Social Studies' | 'Biology' | 'Physics' | 'Chemistry' | 'Physical Science' | 'History' | 'Geography';

// interface UploadForm {
//     title: string;
//     level: EducationLevel;
//     grade: PrimaryGrade | SecondaryGrade;
//     type: ResourceType;
//     subject: Subject;
//     author: string;
//     description: string;
//     year?: string;
//     paperType?: PaperType;
//     file: File | null;
// }

// export default function UploadResourcePage() {
//     const { user } = useAppContext();
//     const [isSideMenuOpen, setSideMenuOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
//     const [dragActive, setDragActive] = useState(false);

//     const [form, setForm] = useState<UploadForm>({
//         title: '',
//         level: 'primary',
//         grade: 'standard1',
//         type: 'textbooks',
//         subject: 'Mathematics',
//         author: user?.name || '',
//         description: '',
//         file: null
//     });

//     const primaryGrades = [
//         'standard1', 'standard2', 'standard3', 'standard4', 'standard5', 'standard6', 'standard7', 'standard8'
//     ] as const;

//     const secondaryGrades = [
//         'form1', 'form2', 'form3', 'form4'
//     ] as const;

//     const primarySubjects: Subject[] = ['Mathematics', 'English', 'Chichewa', 'Science', 'Social Studies'];
//     const secondarySubjects: Subject[] = ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry', 'History', 'Geography'];

//     const resourceTypes: { value: ResourceType; label: string; icon: any }[] = [
//         { value: 'textbooks', label: 'Textbook', icon: Book },
//         { value: 'pamphlets', label: 'Pamphlet', icon: FileText },
//         { value: 'schemes', label: 'Scheme of Work', icon: FilePlus2 },
//         { value: 'syllabus', label: 'Syllabus', icon: GraduationCap },
//         { value: 'pastPapers', label: 'Past Paper', icon: FileText }
//     ];

//     const paperTypes: { value: PaperType; label: string }[] = [
//         { value: 'pslce', label: 'PSLCE (MANEB) - Standard 8 Only' },
//         { value: 'jce', label: 'JCE (MANEB) - Form 2 Only' },
//         { value: 'msce', label: 'MSCE (MANEB) - Form 4 Only' },
//         { value: 'mock', label: 'Mock Examination' },
//         { value: 'general', label: 'General Paper' }
//     ];

//     const getSubjects = () => {
//         return form.level === 'primary' ? primarySubjects : secondarySubjects;
//     };

//     const getGradeLabel = (grade: string) => {
//         if (grade.startsWith('standard')) return grade.replace('standard', 'Standard ');
//         if (grade.startsWith('form')) return grade.replace('form', 'Form ');
//         return grade;
//     };

//     const handleDrag = (e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (e.type === "dragenter" || e.type === "dragover") {
//             setDragActive(true);
//         } else if (e.type === "dragleave") {
//             setDragActive(false);
//         }
//     };

//     const handleDrop = (e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);
//         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//             handleFile(e.dataTransfer.files[0]);
//         }
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             handleFile(e.target.files[0]);
//         }
//     };

//     const handleFile = (file: File) => {
//         // Check file type
//         const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
//         if (!allowedTypes.includes(file.type)) {
//             alert('Please upload PDF, Word, or PowerPoint files only.');
//             return;
//         }

//         // Check file size (max 50MB)
//         if (file.size > 50 * 1024 * 1024) {
//             alert('File size must be less than 50MB.');
//             return;
//         }

//         setForm({ ...form, file });
//     };

//     const removeFile = () => {
//         setForm({ ...form, file: null });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!form.file) {
//             alert('Please select a file to upload.');
//             return;
//         }

//         if (!form.title) {
//             alert('Please enter a title for the resource.');
//             return;
//         }

//         setUploadStatus('uploading');
//         setUploadProgress(0);

//         // Simulate upload progress
//         const interval = setInterval(() => {
//             setUploadProgress(prev => {
//                 if (prev >= 100) {
//                     clearInterval(interval);
//                     setUploadStatus('success');
//                     return 100;
//                 }
//                 return prev + 10;
//             });
//         }, 300);

//         // Here you would actually upload to your server/storage
//         // const formData = new FormData();
//         // formData.append('file', form.file);
//         // formData.append('data', JSON.stringify(form));

//         try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 3000));
//             console.log('Uploading:', form);
//             clearInterval(interval);
//             setUploadProgress(100);
//             setUploadStatus('success');
//         } catch (error) {
//             clearInterval(interval);
//             setUploadStatus('error');
//         }
//     };

//     const resetForm = () => {
//         setForm({
//             title: '',
//             level: 'primary',
//             grade: 'standard1',
//             type: 'textbooks',
//             subject: 'Mathematics',
//             author: user?.name || '',
//             description: '',
//             file: null
//         });
//         setUploadStatus('idle');
//         setUploadProgress(0);
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
//                     <div className="max-w-3xl mx-auto">
//                         {/* Header with navigation */}
//                         <div className="flex items-center gap-4 mb-6">
//                             <Link
//                                 href="/resources"
//                                 className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
//                             >
//                                 <ArrowLeft className="h-5 w-5" />
//                             </Link>
//                             <h1 className="text-3xl font-bold">Upload Resource</h1>
//                         </div>

//                         <div className="bg-slate-800 rounded-lg p-6">
//                             {uploadStatus === 'success' ? (
//                                 // Success Message
//                                 <div className="text-center py-12">
//                                     <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                         <Check className="h-10 w-10 text-white" />
//                                     </div>
//                                     <h2 className="text-2xl font-bold text-green-400 mb-2">Upload Successful!</h2>
//                                     <p className="text-slate-400 mb-6">Your resource has been uploaded successfully and is now available in the library.</p>
//                                     <div className="flex gap-4 justify-center">
//                                         <button
//                                             onClick={resetForm}
//                                             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
//                                         >
//                                             Upload Another
//                                         </button>
//                                         <Link
//                                             href="/resources"
//                                             className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
//                                         >
//                                             Go to Library
//                                         </Link>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     {/* File Upload Area */}
//                                     <div
//                                         className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-slate-600 hover:border-slate-500'
//                                             }`}
//                                         onDragEnter={handleDrag}
//                                         onDragLeave={handleDrag}
//                                         onDragOver={handleDrag}
//                                         onDrop={handleDrop}
//                                     >
//                                         {form.file ? (
//                                             <div>
//                                                 <div className="flex items-center justify-center mb-4">
//                                                     <FileText className="h-12 w-12 text-blue-400" />
//                                                 </div>
//                                                 <p className="text-lg font-semibold mb-2">{form.file.name}</p>
//                                                 <p className="text-sm text-slate-400 mb-4">
//                                                     {(form.file.size / 1024 / 1024).toFixed(2)} MB
//                                                 </p>
//                                                 <button
//                                                     type="button"
//                                                     onClick={removeFile}
//                                                     className="text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto"
//                                                 >
//                                                     <X className="h-4 w-4" /> Remove
//                                                 </button>
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//                                                 <p className="text-lg font-semibold mb-2">
//                                                     Drag and drop your file here
//                                                 </p>
//                                                 <p className="text-sm text-slate-400 mb-4">
//                                                     Supports: PDF, Word, PowerPoint (Max 50MB)
//                                                 </p>
//                                                 <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer transition-colors">
//                                                     Browse Files
//                                                     <input
//                                                         type="file"
//                                                         className="hidden"
//                                                         onChange={handleFileChange}
//                                                         accept=".pdf,.doc,.docx,.ppt,.pptx"
//                                                     />
//                                                 </label>
//                                             </>
//                                         )}
//                                     </div>

//                                     {/* Upload Progress */}
//                                     {uploadStatus === 'uploading' && (
//                                         <div className="space-y-2">
//                                             <div className="flex justify-between text-sm">
//                                                 <span>Uploading...</span>
//                                                 <span>{uploadProgress}%</span>
//                                             </div>
//                                             <div className="w-full bg-slate-700 rounded-full h-2">
//                                                 <div
//                                                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                                     style={{ width: `${uploadProgress}%` }}
//                                                 ></div>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Error Message */}
//                                     {uploadStatus === 'error' && (
//                                         <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
//                                             <AlertCircle className="h-5 w-5 text-red-500" />
//                                             <p className="text-red-500">Upload failed. Please try again.</p>
//                                         </div>
//                                     )}

//                                     {/* Resource Details Form */}
//                                     <div className="space-y-4">
//                                         <h2 className="text-xl font-bold">Resource Details</h2>

//                                         {/* Title */}
//                                         <div>
//                                             <label className="block text-slate-400 mb-2">Title *</label>
//                                             <input
//                                                 type="text"
//                                                 value={form.title}
//                                                 onChange={(e) => setForm({ ...form, title: e.target.value })}
//                                                 className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                 placeholder="e.g., Mathematics Textbook Standard 8"
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Level and Grade */}
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className="block text-slate-400 mb-2">Education Level</label>
//                                                 <div className="flex gap-2">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setForm({ ...form, level: 'primary', grade: 'standard1' })}
//                                                         className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${form.level === 'primary'
//                                                             ? 'bg-blue-600 text-white'
//                                                             : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                                                             }`}
//                                                     >
//                                                         <School className="inline-block mr-2 h-4 w-4" />
//                                                         Primary
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setForm({ ...form, level: 'secondary', grade: 'form1' })}
//                                                         className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${form.level === 'secondary'
//                                                             ? 'bg-blue-600 text-white'
//                                                             : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//                                                             }`}
//                                                     >
//                                                         <GraduationCap className="inline-block mr-2 h-4 w-4" />
//                                                         Secondary
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             <div>
//                                                 <label className="block text-slate-400 mb-2">Grade/Form</label>
//                                                 <select
//                                                     value={form.grade}
//                                                     onChange={(e) => setForm({ ...form, grade: e.target.value as any })}
//                                                     className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                 >
//                                                     {(form.level === 'primary' ? primaryGrades : secondaryGrades).map(grade => (
//                                                         <option key={grade} value={grade}>
//                                                             {getGradeLabel(grade)}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Resource Type and Subject */}
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className="block text-slate-400 mb-2">Resource Type</label>
//                                                 <select
//                                                     value={form.type}
//                                                     onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })}
//                                                     className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                 >
//                                                     {resourceTypes.map(type => (
//                                                         <option key={type.value} value={type.value}>{type.label}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                             <div>
//                                                 <label className="block text-slate-400 mb-2">Subject</label>
//                                                 <select
//                                                     value={form.subject}
//                                                     onChange={(e) => setForm({ ...form, subject: e.target.value as Subject })}
//                                                     className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                 >
//                                                     {getSubjects().map(subject => (
//                                                         <option key={subject} value={subject}>{subject}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Past Paper Specific Fields */}
//                                         {form.type === 'pastPapers' && (
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                 <div>
//                                                     <label className="block text-slate-400 mb-2">Paper Type</label>
//                                                     <select
//                                                         value={form.paperType || ''}
//                                                         onChange={(e) => setForm({ ...form, paperType: e.target.value as PaperType })}
//                                                         className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                     >
//                                                         <option value="">Select Paper Type</option>
//                                                         {paperTypes
//                                                             .filter(pt => {
//                                                                 if (form.level === 'primary') return pt.value === 'pslce' || pt.value === 'mock' || pt.value === 'general';
//                                                                 return true;
//                                                             })
//                                                             .map(pt => (
//                                                                 <option key={pt.value} value={pt.value}>{pt.label}</option>
//                                                             ))}
//                                                     </select>
//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-slate-400 mb-2">Year</label>
//                                                     <select
//                                                         value={form.year || ''}
//                                                         onChange={(e) => setForm({ ...form, year: e.target.value })}
//                                                         className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                     >
//                                                         <option value="">Select Year</option>
//                                                         {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString()).map(year => (
//                                                             <option key={year} value={year}>{year}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* Author */}
//                                         <div>
//                                             <label className="block text-slate-400 mb-2">Author/Publisher</label>
//                                             <input
//                                                 type="text"
//                                                 value={form.author}
//                                                 onChange={(e) => setForm({ ...form, author: e.target.value })}
//                                                 className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                 placeholder="e.g., MANEB, Malawi Institute of Education"
//                                             />
//                                         </div>

//                                         {/* Description */}
//                                         <div>
//                                             <label className="block text-slate-400 mb-2">Description (Optional)</label>
//                                             <textarea
//                                                 value={form.description}
//                                                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                                                 rows={4}
//                                                 className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600"
//                                                 placeholder="Provide a brief description of the resource..."
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Submit Button */}
//                                     <button
//                                         type="submit"
//                                         disabled={uploadStatus === 'uploading' || !form.file}
//                                         className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${uploadStatus === 'uploading' || !form.file
//                                             ? 'bg-slate-600 cursor-not-allowed'
//                                             : 'bg-green-600 hover:bg-green-700'
//                                             }`}
//                                     >
//                                         {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Resource'}
//                                     </button>
//                                 </form>
//                             )}
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// }