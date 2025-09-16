'use client';

import { useEffect, useState } from 'react';
import { LessonsApiService } from '@/services/api/lessons-api.service';
import { Lesson } from '@/types';
import Link from 'next/link';

export default function AdminLessonDetailClientPage({ lessonId }: { lessonId: string }) {
    const lessonApiService = new LessonsApiService();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasBeenViewed, setHasBeenViewed] = useState(false);
    const [isApproving, setIsApproving] = useState(false); // Separate state for approve
    const [isRejecting, setIsRejecting] = useState(false); // Separate state for reject

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const lessonData = await lessonApiService.getLessonById(lessonId);
                setLesson(lessonData);
            } catch (error) {
                console.error("Failed to fetch lesson details", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId]);

    const handleMarkAsViewed = () => {
        setHasBeenViewed(true);
    };

    const handleApprove = async () => {
        setIsApproving(true); // Set only approve loading state
        try {
            await lessonApiService.approveLesson(lessonId);
            alert('Lesson approved successfully!');
            // Redirect back to reviews page or show success message
        } catch (error) {
            console.error("Failed to approve lesson", error);
            alert('Failed to approve lesson');
        } finally {
            setIsApproving(false); // Reset only approve loading state
        }
    };

    const handleReject = async () => {
        setIsRejecting(true); // Set only reject loading state
        try {
            await lessonApiService.rejectLesson(lessonId);
            alert('Lesson rejected successfully!');
            // Redirect back to reviews page or show success message
        } catch (error) {
            console.error("Failed to reject lesson", error);
            alert('Failed to reject lesson');
        } finally {
            setIsRejecting(false); // Reset only reject loading state
        }
    };

    if (isLoading) return <div className="p-8">Loading lesson details...</div>;
    if (!lesson) return <div className="p-8">Lesson not found.</div>;

    return (
        // <div className="container mx-auto p-8">
        <div className="container mx-auto p-8 pt-20">
            <Link href="/admin/reviews" className="text-blue-500 hover:underline mb-6 inline-block">
                &larr; Back to Approval Queue
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
                <p className="text-gray-600 mt-2">
                    Submitted by: <strong>{lesson.teacher?.name || 'N/A'}</strong>
                </p>
                <p className="text-gray-500">
                    Subject: <strong>{lesson.subject}</strong> | Form: <strong>{lesson.form}</strong>
                </p>

                {!hasBeenViewed && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 mb-2">Please review the lesson content before making a decision.</p>
                        <button
                            onClick={handleMarkAsViewed}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
                        >
                            Mark as Viewed
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Lesson Content</h2>
                    {lesson.videoUrl && (
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2">Video</h3>
                            <video controls className="w-full rounded-md" src={`http://localhost:3001/${lesson.videoUrl}`} />
                        </div>
                    )}
                    {lesson.textContent && (
                        <div>
                            <h3 className="text-xl font-medium mb-2">Text</h3>
                            <div className="prose max-w-none">
                                <p>{lesson.textContent}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Details</h2>
                    <div className="space-y-2">
                        <p><strong>Price:</strong> {lesson.price} MWK</p>
                        <p><strong>Duration:</strong> {lesson.durationMinutes} minutes</p>
                        <p className="pt-2"><strong>Description:</strong> {lesson.description}</p>
                    </div>

                    {/* Approval Actions - Only show after marking as viewed */}
                    {hasBeenViewed && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Review Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving || isRejecting} // Disable if either action is in progress
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-md font-medium"
                                >
                                    {isApproving ? 'Approving...' : 'Approve Lesson'}
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={isRejecting || isApproving} // Disable if either action is in progress
                                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md font-medium"
                                >
                                    {isRejecting ? 'Rejecting...' : 'Reject Lesson'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { LessonsApiService } from '@/services/api/lessons-api.service';
// import { Lesson } from '@/types';
// import Link from 'next/link';

// export default function AdminLessonDetailClientPage({ lessonId }: { lessonId: string }) {
//     const lessonApiService = new LessonsApiService();
//     const [lesson, setLesson] = useState<Lesson | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [hasBeenViewed, setHasBeenViewed] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const fetchLesson = async () => {
//             try {
//                 const lessonData = await lessonApiService.getLessonById(lessonId);
//                 setLesson(lessonData);
//             } catch (error) {
//                 console.error("Failed to fetch lesson details", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (lessonId) {
//             fetchLesson();
//         }
//     }, [lessonId]);

//     const handleMarkAsViewed = () => {
//         setHasBeenViewed(true);
//     };

//     const handleApprove = async () => {
//         setIsSubmitting(true);
//         try {
//             // Call your API to approve the lesson
//             await lessonApiService.approveLesson(lessonId);
//             alert('Lesson approved successfully!');
//             // Redirect back to reviews page or show success message
//         } catch (error) {
//             console.error("Failed to approve lesson", error);
//             alert('Failed to approve lesson');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleReject = async () => {
//         setIsSubmitting(true);
//         try {
//             // Call your API to reject the lesson
//             await lessonApiService.rejectLesson(lessonId);
//             alert('Lesson rejected successfully!');
//             // Redirect back to reviews page or show success message
//         } catch (error) {
//             console.error("Failed to reject lesson", error);
//             alert('Failed to reject lesson');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) return <div className="p-8">Loading lesson details...</div>;
//     if (!lesson) return <div className="p-8">Lesson not found.</div>;

//     return (
//         <div className="container mx-auto p-8">
//             <Link href="/admin/reviews" className="text-blue-500 hover:underline mb-6 inline-block">
//                 &larr; Back to Approval Queue
//             </Link>

//             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//                 <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
//                 <p className="text-gray-600 mt-2">
//                     Submitted by: <strong>{lesson.teacher?.name || 'N/A'}</strong>
//                 </p>
//                 <p className="text-gray-500">
//                     Subject: <strong>{lesson.subject}</strong> | Form: <strong>{lesson.form}</strong>
//                 </p>

//                 {!hasBeenViewed && (
//                     <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                         <p className="text-yellow-800 mb-2">Please review the lesson content before making a decision.</p>
//                         <button
//                             onClick={handleMarkAsViewed}
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
//                         >
//                             Mark as Viewed
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Lesson Content</h2>
//                     {lesson.videoUrl && (
//                         <div className="mb-6">
//                             <h3 className="text-xl font-medium mb-2">Video</h3>
//                             <video controls className="w-full rounded-md" src={`http://localhost:3001/${lesson.videoUrl}`} />
//                         </div>
//                     )}
//                     {lesson.textContent && (
//                         <div>
//                             <h3 className="text-xl font-medium mb-2">Text</h3>
//                             <div className="prose max-w-none">
//                                 <p>{lesson.textContent}</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Details</h2>
//                     <div className="space-y-2">
//                         <p><strong>Price:</strong> {lesson.price} MWK</p>
//                         <p><strong>Duration:</strong> {lesson.durationMinutes} minutes</p>
//                         <p className="pt-2"><strong>Description:</strong> {lesson.description}</p>
//                     </div>

//                     {/* Approval Actions - Only show after marking as viewed */}
//                     {hasBeenViewed && (
//                         <div className="mt-8 p-4 bg-gray-50 rounded-lg">
//                             <h3 className="text-lg font-semibold mb-4">Review Actions</h3>
//                             <div className="space-y-3">
//                                 <button
//                                     onClick={handleApprove}
//                                     disabled={isSubmitting}
//                                     className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-md font-medium"
//                                 >
//                                     {isSubmitting ? 'Approving...' : 'Approve Lesson'}
//                                 </button>
//                                 <button
//                                     onClick={handleReject}
//                                     disabled={isSubmitting}
//                                     className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md font-medium"
//                                 >
//                                     {isSubmitting ? 'Rejecting...' : 'Reject Lesson'}
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { LessonsApiService } from '@/services/api/lessons-api.service';
// import { Lesson } from '@/types';
// import Link from 'next/link';

// // 1. It now accepts `lessonId` as a simple string prop.
// export default function AdminLessonDetailClientPage({ lessonId }: { lessonId: string }) {
//     const lessonApiService = new LessonsApiService();
//     const [lesson, setLesson] = useState<Lesson | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchLesson = async () => {
//             try {
//                 // 2. It uses the `lessonId` prop directly.
//                 const lessonData = await lessonApiService.getLessonById(lessonId);
//                 setLesson(lessonData);
//             } catch (error) {
//                 console.error("Failed to fetch lesson details", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (lessonId) {
//             fetchLesson();
//         }
//     }, [lessonId]); // 3. The dependency is now the simple `lessonId` string.

//     if (isLoading) return <div className="p-8">Loading lesson details...</div>;
//     if (!lesson) return <div className="p-8">Lesson not found.</div>;

//     return (
//         <div className="container mx-auto p-8">
//             <Link href="/admin/reviews" className="text-blue-500 hover:underline mb-6 inline-block">
//                 &larr; Back to Approval Queue
//             </Link>
//             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//                 <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
//                 <p className="text-gray-600 mt-2">
//                     Submitted by: <strong>{lesson.teacher?.name || 'N/A'}</strong>
//                 </p>
//                 <p className="text-gray-500">
//                     Subject: <strong>{lesson.subject}</strong> | Form: <strong>{lesson.form}</strong>
//                 </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Lesson Content</h2>
//                     {lesson.videoUrl && (
//                         <div className="mb-6">
//                             <h3 className="text-xl font-medium mb-2">Video</h3>
//                             <video controls className="w-full rounded-md" src={`http://localhost:3001/${lesson.videoUrl}`} />
//                         </div>
//                     )}
//                     {lesson.textContent && (
//                         <div>
//                             <h3 className="text-xl font-medium mb-2">Text</h3>
//                             <div className="prose max-w-none">
//                                 <p>{lesson.textContent}</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//                 <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Details</h2>
//                     <div className="space-y-2">
//                         <p><strong>Price:</strong> {lesson.price} MWK</p>
//                         <p><strong>Duration:</strong> {lesson.durationMinutes} minutes</p>
//                         <p className="pt-2"><strong>Description:</strong> {lesson.description}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }