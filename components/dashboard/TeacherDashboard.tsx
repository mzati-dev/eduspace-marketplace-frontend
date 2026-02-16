'use client';

import { useAppContext } from '../../context/AppContext';
import { FileText, DollarSign, Plus, ShoppingBag, Eye, Trash2, Edit, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import StatCard from '../common/StatCard';
import LessonForm from './LessonForm';
import UploadLessonForm from '../common/UploadLessonForm';
import { Lesson } from '@/types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { TeacherApiService } from '@/services/api/teacher-api.service';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard({ isSidebarOpen }: { isSidebarOpen: boolean }) {
    const router = useRouter();
    const { user, searchTerm } = useAppContext();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [viewingStudents, setViewingStudents] = useState<{ lessonId: string, students: string[] } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [salesData, setSalesData] = useState({
        totalLessonsSold: 0,
        totalSales: 0,
        totalEarnings: 0
    });

    const teacherApi = useMemo(() => new TeacherApiService(), []);

    const loadData = async () => {
        if (!user?.id) return;
        try {
            const [fetchedLessons, stats] = await Promise.all([
                teacherApi.getLessons(),
                teacherApi.getSalesStatistics()
            ]);

            const lessonsWithNumericPrice = fetchedLessons.map(l => ({
                ...l,
                price: Number(l.price || 0)
            }));

            lessonsWithNumericPrice.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setLessons(lessonsWithNumericPrice);
            setSalesData(stats);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setLessons([]);
        }
    };

    useEffect(() => {
        loadData();
    }, [user?.id, teacherApi]);

    const teacherLessons = useMemo(() => {
        if (!searchTerm) return lessons;
        const searchLower = searchTerm.toLowerCase();
        return lessons.filter((lesson) =>
            lesson.subject.toLowerCase().includes(searchLower) ||
            lesson.form.toLowerCase().includes(searchLower) ||
            lesson.title.toLowerCase().includes(searchLower)
        );
    }, [lessons, searchTerm]);

    const handleUpdateSubmit = async (data: any) => {
        if (!user || !editingLesson) return;

        try {
            const updated = await teacherApi.updateLesson(editingLesson.id, data);
            updated.price = Number(updated.price || 0);
            setLessons(lessons.map(l => l.id === editingLesson.id ? updated : l));
            setShowForm(false);
            setEditingLesson(null);
        } catch (err) {
            console.error('Error updating lesson', err);
            alert("Failed to update lesson.");
        }
    };

    const handleEdit = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setShowForm(true);
    };

    const handleDelete = async (lessonId: string) => {
        try {
            await teacherApi.deleteLesson(lessonId);
            setLessons(lessons.filter(l => l.id !== lessonId));
            setConfirmDeleteId(null);
        } catch (err) {
            console.error('Error deleting lesson', err);
        }
    };

    const handleViewStudents = async (lessonId: string) => {
        try {
            const students = await teacherApi.getLessonStudents(lessonId);
            setViewingStudents({
                lessonId,
                students: students.map(s => s.name)
            });
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    };

    const handleAddNew = () => {
        setEditingLesson(null);
        setShowForm(true);
    };

    const handleUploadSuccess = () => {
        setShowForm(false);
        loadData();
    };

    if (showForm) {
        if (editingLesson) {
            return (
                <LessonForm
                    onSubmit={handleUpdateSubmit}
                    onCancel={() => setShowForm(false)}
                    initialData={editingLesson}
                />
            );
        }

        return (
            <div className="pt-[100px] pb-10 px-4">
                <div className="max-w-2xl mx-auto mb-4">
                    <Button variant="secondary" onClick={() => setShowForm(false)}>
                        ← Back to Dashboard
                    </Button>
                </div>
                <UploadLessonForm onSuccess={handleUploadSuccess} />
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Fixed header section - mobile responsive */}
            <div className="relative lg:fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-3 sm:p-4 lg:p-6 border-b border-slate-700 -mt-4 sm:-mt-6 lg:-mt-8">
                <div className={`max-w-7xl mx-auto ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
                    {/* Header with title and create button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-white">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h2>

                        <Button className="cursor-pointer w-full sm:w-auto" onClick={handleAddNew}>
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            Create Lesson
                        </Button>
                    </div>

                    {/* Stats cards - responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        <StatCard
                            icon={FileText}
                            title="Total Lessons"
                            value={teacherLessons.length}
                        />
                        <StatCard
                            icon={ShoppingBag}
                            title="Total Sales"
                            value={salesData.totalSales}
                        />
                        <StatCard
                            icon={DollarSign}
                            title="Total Earnings"
                            value={`MWK ${Number(salesData.totalEarnings).toLocaleString()}`}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable content section - adjusted padding for mobile */}
            <div className="pt-6 lg:pt-[220px]">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 -mt-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">My Published Lessons</h3>

                    {teacherLessons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {teacherLessons.map(lesson => (
                                <div
                                    key={lesson.id}
                                    className="relative bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700 hover:border-slate-500 transition-colors flex flex-col h-full"
                                >
                                    <div className="flex-grow space-y-2">
                                        <h4 className="font-bold text-base sm:text-lg text-white line-clamp-1">{lesson.title}</h4>
                                        <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">{lesson.description}</p>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex flex-col xs:flex-row justify-between text-xs sm:text-sm text-slate-400 pt-3 gap-1">
                                            <div className="flex flex-wrap items-center">
                                                <span className="bg-slate-700 px-2 py-0.5 rounded-full">{lesson.subject}</span>
                                                <span className="mx-1 text-slate-500 hidden xs:inline">|</span>
                                                <span className="bg-slate-700 px-2 py-0.5 rounded-full">{lesson.form}</span>
                                            </div>
                                            <span className="font-semibold text-white whitespace-nowrap">
                                                MWK {Number(lesson.price).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="bg-slate-700 text-green-500 text-xs font-bold px-2 py-1 rounded-full">
                                                {lesson.salesCount || 0} sales
                                            </span>
                                            {lesson.averageRating != null && (
                                                <div className="bg-slate-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span className="text-yellow-400 font-bold text-xs">
                                                        {lesson.averageRating.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons - responsive grid */}
                                    <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-700 pt-3">
                                        <button
                                            onClick={() => handleViewStudents(lesson.id)}
                                            className="flex items-center justify-center text-blue-400 hover:text-blue-300 p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 transition-colors"
                                            title="View Students"
                                        >
                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(lesson)}
                                            className="flex items-center justify-center text-yellow-400 hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 transition-colors"
                                            title="Edit Lesson"
                                        >
                                            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(lesson.id)}
                                            className="flex items-center justify-center text-red-400 hover:text-red-300 p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 transition-colors"
                                            title="Delete Lesson"
                                        >
                                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 sm:py-16 text-slate-400">
                            <p className="text-sm sm:text-base">No lessons created yet</p>
                            <Button
                                className="mt-4 cursor-pointer"
                                onClick={handleAddNew}
                                variant="secondary"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Lesson
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals - unchanged */}
            {viewingStudents && (
                <Modal isOpen={!!viewingStudents} onClose={() => setViewingStudents(null)} title="Enrolled Students">
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {viewingStudents.students.length > 0 ? (
                            viewingStudents.students.map((student, index) => (
                                <div key={index} className="text-white bg-slate-700 p-2 rounded">{student}</div>
                            ))
                        ) : (
                            <p className="text-slate-400">No students enrolled yet.</p>
                        )}
                    </div>
                </Modal>
            )}

            {confirmDeleteId && (
                <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
                    <div className="space-y-4">
                        <p className="text-white">Are you sure you want to delete this lesson? This action cannot be undone.</p>
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                            <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                            <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>Delete Lesson</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { FileText, DollarSign, Plus, ShoppingBag, Eye, Trash2, Archive, Edit, Star, BarChart } from 'lucide-react';
// import { useState, useEffect, useMemo } from 'react';
// import StatCard from '../common/StatCard';
// import LessonForm from './LessonForm'; // Keep this for Editing
// import UploadLessonForm from '../common/UploadLessonForm'; // ✅ The Bunny Uploader
// import { Lesson } from '@/types';
// import Button from '../common/Button';
// import Modal from '../common/Modal';
// import { TeacherApiService } from '@/services/api/teacher-api.service';
// import { useRouter } from 'next/navigation';

// export default function TeacherDashboard({ isSidebarOpen }: { isSidebarOpen: boolean }) {
//     const router = useRouter();
//     const { user, searchTerm } = useAppContext();
//     const [lessons, setLessons] = useState<Lesson[]>([]);

//     // Toggle between "List", "Create Mode", and "Edit Mode"
//     const [showForm, setShowForm] = useState(false);

//     const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
//     const [viewingStudents, setViewingStudents] = useState<{ lessonId: string, students: string[] } | null>(null);
//     const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

//     const [salesData, setSalesData] = useState({
//         totalLessonsSold: 0,
//         totalSales: 0,
//         totalEarnings: 0
//     });

//     const teacherApi = useMemo(() => new TeacherApiService(), []);

//     // --- 1. FETCH DATA ---
//     const loadData = async () => {
//         if (!user?.id) return;
//         try {
//             const [fetchedLessons, stats] = await Promise.all([
//                 teacherApi.getLessons(),
//                 teacherApi.getSalesStatistics()
//             ]);

//             const lessonsWithNumericPrice = fetchedLessons.map(l => ({
//                 ...l,
//                 price: Number(l.price || 0)
//             }));

//             // Sort by newest first
//             lessonsWithNumericPrice.sort((a, b) =>
//                 new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//             );

//             setLessons(lessonsWithNumericPrice);
//             setSalesData(stats);
//         } catch (err) {
//             console.error('Failed to fetch data', err);
//             setLessons([]);
//         }
//     };

//     useEffect(() => {
//         loadData();
//     }, [user?.id, teacherApi]);

//     // --- 2. SEARCH FILTER ---
//     const teacherLessons = useMemo(() => {
//         if (!searchTerm) return lessons;
//         const searchLower = searchTerm.toLowerCase();
//         return lessons.filter((lesson) =>
//             lesson.subject.toLowerCase().includes(searchLower) ||
//             lesson.form.toLowerCase().includes(searchLower) ||
//             lesson.title.toLowerCase().includes(searchLower)
//         );
//     }, [lessons, searchTerm]);

//     // --- 3. HANDLE UPDATES (EDITING) ---
//     const handleUpdateSubmit = async (data: any) => {
//         if (!user || !editingLesson) return;

//         try {
//             const updated = await teacherApi.updateLesson(editingLesson.id, data);
//             updated.price = Number(updated.price || 0);

//             // Update the list locally
//             setLessons(lessons.map(l => l.id === editingLesson.id ? updated : l));

//             setShowForm(false);
//             setEditingLesson(null);
//         } catch (err) {
//             console.error('Error updating lesson', err);
//             alert("Failed to update lesson.");
//         }
//     };

//     // --- 4. ACTION HANDLERS ---
//     const handleEdit = (lesson: Lesson) => {
//         setEditingLesson(lesson);
//         setShowForm(true);
//     };

//     const handleDelete = async (lessonId: string) => {
//         try {
//             await teacherApi.deleteLesson(lessonId);
//             setLessons(lessons.filter(l => l.id !== lessonId));
//             setConfirmDeleteId(null);
//         } catch (err) {
//             console.error('Error deleting lesson', err);
//         }
//     };

//     const handleViewStudents = async (lessonId: string) => {
//         try {
//             const students = await teacherApi.getLessonStudents(lessonId);
//             setViewingStudents({
//                 lessonId,
//                 students: students.map(s => s.name)
//             });
//         } catch (err) {
//             console.error('Failed to fetch students', err);
//         }
//     };

//     const handleAddNew = () => {
//         setEditingLesson(null); // Ensure we are in "Create" mode
//         setShowForm(true);
//     };

//     // ✅ New handler: Called when UploadLessonForm finishes successfully
//     const handleUploadSuccess = () => {
//         setShowForm(false); // Close the form
//         loadData();         // Refresh list to show the new video
//     };

//     // --- 5. RENDER THE FORMS ---
//     if (showForm) {
//         // CASE A: EDITING AN EXISTING LESSON (Old Metadata Form)
//         if (editingLesson) {
//             return (
//                 <LessonForm
//                     onSubmit={handleUpdateSubmit}
//                     onCancel={() => setShowForm(false)}
//                     initialData={editingLesson}
//                 />
//             );
//         }

//         // CASE B: CREATING A NEW LESSON (New Bunny Uploader)
//         return (
//             <div className="pt-[100px] pb-10 px-4">
//                 <div className="max-w-2xl mx-auto mb-4">
//                     <Button variant="secondary" onClick={() => setShowForm(false)}>
//                         ← Back to Dashboard
//                     </Button>
//                 </div>

//                 {/* ✅ Pass the success handler here */}
//                 <UploadLessonForm onSuccess={handleUploadSuccess} />
//             </div>
//         );
//     }

//     // --- 6. RENDER THE DASHBOARD ---
//     return (
//         <div className="relative">
//             {/* Fixed header section */}
//             <div className="fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-6 border-b border-slate-700 -mt-8">
//                 {/* <div className="max-w-7xl mx-auto"> */}
//                 <div className={`max-w-7xl mx-auto ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-3xl font-bold text-white">
//                             Welcome back, {user?.name?.split(' ')[0]}!
//                         </h2>

//                         <div className="flex gap-3">
//                             {/* <button
//                                 onClick={() => router.push('/find-online-tutor')}
//                                 className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
//                             >
//                                 <BarChart className="h-4 w-4 mr-2" />
//                                 Tutoring
//                             </button> */}

//                             <Button className="cursor-pointer" onClick={handleAddNew}>
//                                 <Plus className="h-5 w-5 mr-2" />
//                                 Create Lesson
//                             </Button>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <StatCard icon={FileText} title="Total Lessons" value={teacherLessons.length} />
//                         <StatCard icon={ShoppingBag} title="Total Sales" value={salesData.totalSales} />
//                         <StatCard icon={DollarSign} title="Total Earnings" value={`MWK ${Number(salesData.totalEarnings).toLocaleString()}`} />
//                     </div>
//                 </div>
//             </div>

//             {/* Scrollable content section */}
//             <div className="pt-[220px]">
//                 <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 -mt-8">
//                     <h3 className="text-xl font-bold text-white mb-4">My Published Lessons</h3>

//                     {teacherLessons.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {teacherLessons.map(lesson => (
//                                 <div key={lesson.id} className="relative bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors flex flex-col h-full">
//                                     <div className="flex-grow space-y-2">
//                                         <h4 className="font-bold text-lg text-white">{lesson.title}</h4>
//                                         <p className="text-slate-300 text-sm line-clamp-2">{lesson.description}</p>
//                                     </div>
//                                     <div className="mt-auto">
//                                         <div className="flex justify-between text-sm text-slate-400 pt-3">
//                                             <div>
//                                                 <span>{lesson.subject}</span>
//                                                 <span className="ml-2 text-slate-500">|</span>
//                                                 <span className="ml-2">{lesson.form}</span>
//                                             </div>
//                                             <span className="font-semibold text-white">MWK {Number(lesson.price).toLocaleString()}</span>
//                                         </div>
//                                         <div className="mt-2 flex justify-between items-center">
//                                             <span className="bg-slate-700 text-green-500 text-xs font-bold px-2 py-1 rounded-full">
//                                                 {lesson.salesCount || 0} sales
//                                             </span>
//                                             {lesson.averageRating != null && (
//                                                 <div className="bg-slate-700 px-2 py-1 rounded-full flex items-center gap-1">
//                                                     <Star className="w-3 h-3 text-yellow-400 fill-current" />
//                                                     <span className="text-yellow-400 font-bold text-xs">
//                                                         {lesson.averageRating.toFixed(1)}
//                                                     </span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="mt-3 flex justify-between border-t border-slate-700 pt-3">
//                                         <button onClick={() => handleViewStudents(lesson.id)} className="text-blue-400 hover:text-blue-300 p-1">
//                                             <Eye className="h-5 w-5" />
//                                         </button>
//                                         <button onClick={() => handleEdit(lesson)} className="text-yellow-400 hover:text-yellow-300 p-1">
//                                             <Edit className="h-5 w-5" />
//                                         </button>
//                                         {/* Archive Button (Optional) */}
//                                         {/* <button className="text-purple-400 hover:text-purple-300 p-1">
//                                             <Archive className="h-5 w-5" />
//                                         </button> */}
//                                         <button onClick={() => setConfirmDeleteId(lesson.id)} className="text-red-400 hover:text-red-300 p-1">
//                                             <Trash2 className="h-5 w-5" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-16 text-slate-400">
//                             <p>No lessons created yet</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {viewingStudents && (
//                 <Modal isOpen={!!viewingStudents} onClose={() => setViewingStudents(null)} title="Enrolled Students">
//                     <div className="space-y-2 max-h-60 overflow-y-auto">
//                         {viewingStudents.students.length > 0 ? (
//                             viewingStudents.students.map((student, index) => (
//                                 <div key={index} className="text-white bg-slate-700 p-2 rounded">{student}</div>
//                             ))
//                         ) : (
//                             <p className="text-slate-400">No students enrolled yet.</p>
//                         )}
//                     </div>
//                 </Modal>
//             )}

//             {confirmDeleteId && (
//                 <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
//                     <div className="space-y-4">
//                         <p className="text-white">Are you sure you want to delete this lesson? This action cannot be undone.</p>
//                         <div className="flex justify-end gap-2">
//                             <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
//                             <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>Delete Lesson</Button>
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// }