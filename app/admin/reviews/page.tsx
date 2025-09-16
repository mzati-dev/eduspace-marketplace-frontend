'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Lesson } from '@/types';
import { LessonsApiService } from '@/services/api/lessons-api.service';
import Link from 'next/link';

export default function AdminReviewsPage() {
    const lessonApiService = new LessonsApiService();
    const { user } = useAppContext();
    const router = useRouter();
    const [pendingLessons, setPendingLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                // const lessons = await lessonApiService.getPendingLessons();
                // setPendingLessons(lessons);
                const lessons = await lessonApiService.getPendingLessons();

                // ADD THIS: Sort lessons by creation date (newest first)
                const sortedLessons = lessons.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });

                setPendingLessons(sortedLessons); // Use sorted lessons instead of original
            } catch (err) {
                setError('Failed to load lessons. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPending();
    }, []);

    const removeLessonFromState = (lessonId: string) => {
        setPendingLessons(prevLessons =>
            prevLessons.filter(lesson => lesson.id !== lessonId)
        );
    };

    const handleApprove = async (lessonId: string) => {
        try {
            await lessonApiService.approveLesson(lessonId);
            removeLessonFromState(lessonId);
        } catch (err) {
            alert('Failed to approve the lesson.');
        }
    };

    const handleReject = async (lessonId: string) => {
        try {
            await lessonApiService.rejectLesson(lessonId);
            removeLessonFromState(lessonId);
        } catch (err) {
            alert('Failed to reject the lesson.');
        }
    };

    if (!user || user.role !== 'admin') return <div>Loading...</div>;
    if (isLoading) return <div>Loading pending lessons...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        // <div className="container mx-auto p-8">
        <div className="container mx-auto p-8 pt-20">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Lesson Approval Queue</h1>
            {pendingLessons.length === 0 ? (
                <p className="text-slate-600">No lessons are currently pending review. Great job!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pendingLessons.map((lesson) => (
                        <Link href={`/admin/reviews/${lesson.id}`} key={lesson.id}>
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between h-full hover:shadow-xl transition-shadow">
                                {/* Card Content */}
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">{lesson.title}</h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        By: <strong>{lesson.teacher?.name || 'N/A'}</strong>
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Subject: <strong>{lesson.subject}</strong>
                                    </p>
                                    {/* Add this after the subject line */}
                                    <p className="text-gray-400 text-xs mt-2">
                                        Created: {new Date(lesson.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Action Button - Single Review Lesson button */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors font-medium cursor-pointer"
                                    >
                                        Review Lesson
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppContext } from '@/context/AppContext';
// import { Lesson } from '@/types';
// import { LessonsApiService } from '@/services/api/lessons-api.service';
// import { Check, X } from 'lucide-react';
// import Link from 'next/link'; // --- 1. ADD THIS IMPORT ---

// export default function AdminReviewsPage() {
//     const lessonApiService = new LessonsApiService();
//     const { user } = useAppContext();
//     const router = useRouter();
//     const [pendingLessons, setPendingLessons] = useState<Lesson[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (user && user.role !== 'admin') {
//             router.push('/dashboard');
//         }
//     }, [user, router]);

//     useEffect(() => {
//         const fetchPending = async () => {
//             try {
//                 const lessons = await lessonApiService.getPendingLessons();
//                 setPendingLessons(lessons);
//             } catch (err) {
//                 setError('Failed to load lessons. Please try again later.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchPending();
//     }, []);

//     const removeLessonFromState = (lessonId: string) => {
//         setPendingLessons(prevLessons =>
//             prevLessons.filter(lesson => lesson.id !== lessonId)
//         );
//     };

//     const handleApprove = async (lessonId: string) => {
//         try {
//             await lessonApiService.approveLesson(lessonId);
//             removeLessonFromState(lessonId);
//         } catch (err) {
//             alert('Failed to approve the lesson.');
//         }
//     };

//     const handleReject = async (lessonId: string) => {
//         try {
//             await lessonApiService.rejectLesson(lessonId);
//             removeLessonFromState(lessonId);
//         } catch (err) {
//             alert('Failed to reject the lesson.');
//         }
//     };

//     if (!user || user.role !== 'admin') return <div>Loading...</div>;
//     if (isLoading) return <div>Loading pending lessons...</div>;
//     if (error) return <div className="text-red-500">{error}</div>;

//     return (
//         <div className="container mx-auto p-8">
//             <h1 className="text-3xl font-bold mb-6 text-slate-900">Lesson Approval Queue</h1>
//             {pendingLessons.length === 0 ? (
//                 <p className="text-slate-600">No lessons are currently pending review. Great job!</p>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {pendingLessons.map((lesson) => (
//                         // --- 2. REPLACE THE OLD CARD 'div' WITH THIS 'Link' COMPONENT ---
//                         <Link href={`/admin/reviews/${lesson.id}`} key={lesson.id}>
//                             <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between h-full hover:shadow-xl transition-shadow cursor-pointer">
//                                 {/* Card Content */}
//                                 <div>
//                                     <h2 className="text-lg font-bold text-slate-800">{lesson.title}</h2>
//                                     <p className="text-gray-600 text-sm mt-1">
//                                         By: <strong>{lesson.teacher?.name || 'N/A'}</strong>
//                                     </p>
//                                     <p className="text-gray-500 text-sm">
//                                         Subject: <strong>{lesson.subject}</strong>
//                                     </p>
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="flex justify-end gap-2 mt-4">
//                                     <button
//                                         onClick={(e) => { e.preventDefault(); handleReject(lesson.id); }}
//                                         className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
//                                         title="Reject"
//                                     >
//                                         <X size={18} />
//                                     </button>
//                                     <button
//                                         onClick={(e) => { e.preventDefault(); handleApprove(lesson.id); }}
//                                         className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
//                                         title="Approve"
//                                     >
//                                         <Check size={18} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </Link>
//                         // --- END OF THE REPLACEMENT ---
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppContext } from '@/context/AppContext';
// import { Lesson } from '@/types';
// import { LessonsApiService } from '@/services/api/lessons-api.service';
// import { Check, X } from 'lucide-react';

// export default function AdminReviewsPage() {
//     const lessonApiService = new LessonsApiService();
//     const { user } = useAppContext();
//     const router = useRouter();
//     const [pendingLessons, setPendingLessons] = useState<Lesson[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // This effect checks if the user is an admin.
//     useEffect(() => {
//         if (user && user.role !== 'admin') {
//             router.push('/dashboard');
//         }
//     }, [user, router]);

//     // This effect runs once to fetch the pending lessons.
//     useEffect(() => {
//         const fetchPending = async () => {
//             try {
//                 const lessons = await lessonApiService.getPendingLessons();
//                 // The backend query already sorts by oldest first, so no change needed here.
//                 setPendingLessons(lessons);
//             } catch (err) {
//                 setError('Failed to load lessons. Please try again later.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchPending();
//     }, []);

//     // Helper to remove a lesson from the UI after an action
//     const removeLessonFromState = (lessonId: string) => {
//         setPendingLessons(prevLessons =>
//             prevLessons.filter(lesson => lesson.id !== lessonId)
//         );
//     };

//     const handleApprove = async (lessonId: string) => {
//         try {
//             await lessonApiService.approveLesson(lessonId);
//             removeLessonFromState(lessonId);
//         } catch (err) {
//             alert('Failed to approve the lesson.');
//         }
//     };

//     // --- V V V V V NEW FUNCTION FOR REJECTING A LESSON V V V V V ---
//     const handleReject = async (lessonId: string) => {
//         try {
//             await lessonApiService.rejectLesson(lessonId);
//             removeLessonFromState(lessonId);
//         } catch (err) {
//             alert('Failed to reject the lesson.');
//         }
//     };
//     // --- ^ ^ ^ ^ ^ END OF NEW FUNCTION ^ ^ ^ ^ ^ ---

//     if (!user || user.role !== 'admin') return <div>Loading...</div>;
//     if (isLoading) return <div>Loading pending lessons...</div>;
//     if (error) return <div className="text-red-500">{error}</div>;

//     return (
//         <div className="container mx-auto p-8">
//             <h1 className="text-3xl font-bold mb-6 text-slate-900">Lesson Approval Queue</h1>
//             {pendingLessons.length === 0 ? (
//                 <p className="text-slate-600">No lessons are currently pending review. Great job!</p>
//             ) : (
//                 // --- V V V V V THIS IS THE NEW GRID LAYOUT V V V V V ---
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {pendingLessons.map((lesson) => (
//                         <div key={lesson.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
//                             {/* Card Content */}
//                             <div>
//                                 <h2 className="text-lg font-bold text-slate-800">{lesson.title}</h2>
//                                 <p className="text-gray-600 text-sm mt-1">
//                                     By: <strong>{lesson.teacher?.name || 'N/A'}</strong>
//                                 </p>
//                                 <p className="text-gray-500 text-sm">
//                                     Subject: <strong>{lesson.subject}</strong>
//                                 </p>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex justify-end gap-2 mt-4">
//                                 <button
//                                     onClick={() => handleReject(lesson.id)}
//                                     className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
//                                     title="Reject"
//                                 >
//                                     <X size={18} />
//                                 </button>
//                                 <button
//                                     onClick={() => handleApprove(lesson.id)}
//                                     className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
//                                     title="Approve"
//                                 >
//                                     <Check size={18} />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 // --- ^ ^ ^ ^ ^ END OF THE NEW GRID LAYOUT ^ ^ ^ ^ ^ ---
//             )}
//         </div>
//     );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppContext } from '@/context/AppContext';
// import { Lesson } from '@/types';
// import { LessonsApiService } from '@/services/api/lessons-api.service';

// export default function AdminReviewsPage() {
//     // --- 1. CREATE AN INSTANCE OF THE SERVICE ---
//     const lessonApiService = new LessonsApiService();

//     const { user } = useAppContext();
//     const router = useRouter();

//     const [pendingLessons, setPendingLessons] = useState<Lesson[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // This effect checks if the user is an admin.
//     useEffect(() => {
//         // This comparison will now work correctly because of the type change
//         if (user && user.role !== 'admin') {
//             router.push('/dashboard');
//         }
//     }, [user, router]);

//     // This effect runs once to fetch the pending lessons.
//     useEffect(() => {
//         const fetchPending = async () => {
//             try {
//                 // --- 2. USE THE SERVICE INSTANCE ---
//                 const lessons = await lessonApiService.getPendingLessons();
//                 setPendingLessons(lessons);
//             } catch (err) {
//                 setError('Failed to load lessons. Please try again later.');
//                 console.error(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchPending();
//     }, []); // The empty dependency array is correct here

//     // This function is called when an admin clicks the "Approve" button.
//     const handleApprove = async (lessonId: string) => {
//         try {
//             // --- 3. USE THE SERVICE INSTANCE ---
//             await lessonApiService.approveLesson(lessonId);

//             setPendingLessons(prevLessons =>
//                 prevLessons.filter(lesson => lesson.id !== lessonId)
//             );
//         } catch (err) {
//             alert('Failed to approve the lesson.');
//             console.error(err);
//         }
//     };

//     // Don't render anything until we've confirmed the user is an admin
//     if (!user || user.role !== 'admin') {
//         return <div>Loading...</div>;
//     }

//     if (isLoading) {
//         return <div>Loading pending lessons...</div>;
//     }

//     if (error) {
//         return <div className="text-red-500">{error}</div>;
//     }

//     return (
//         <div className="container mx-auto p-8">
//             {/* <h1 className="text-3xl font-bold mb-6">Lesson Approval Queue</h1> */}
//             <h1 className="text-3xl font-bold mb-6 text-slate-900">Lesson Approval Queue</h1>
//             {pendingLessons.length === 0 ? (
//                 <p>No lessons are currently pending review. Great job!</p>
//             ) : (
//                 <div className="space-y-4">
//                     {pendingLessons.map((lesson) => (
//                         <div key={lesson.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
//                             <div>
//                                 <h2 className="text-xl font-semibold">{lesson.title}</h2>
//                                 {/* --- 4. THIS WILL NOW WORK CORRECTLY --- */}
//                                 <p className="text-gray-600">Submitted by: {lesson.teacher?.name || 'N/A'}</p>
//                                 <p className="text-gray-500 text-sm">Subject: {lesson.subject}</p>
//                             </div>
//                             <button
//                                 onClick={() => handleApprove(lesson.id)}
//                                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
//                             >
//                                 Approve
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }