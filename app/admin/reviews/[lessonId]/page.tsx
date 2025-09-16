// app/admin/reviews/[lessonId]/page.tsx

import AdminLessonDetailClientPage from "./AdminLessonDetailClientPage";

// This is a Server Component. Its only job is to get the ID and pass it down.
export default async function AdminLessonDetailPage({
    params
}: {
    params: Promise<{ lessonId: string }>
}) {
    // Await the params before destructuring
    const { lessonId } = await params;

    // It then renders your client page, passing the lessonId as a simple prop.
    return <AdminLessonDetailClientPage lessonId={lessonId} />;
}



// // app/admin/reviews/[lessonId]/page.tsx

// import AdminLessonDetailClientPage from "./AdminLessonDetailClientPage";

// // This is a Server Component. Its only job is to get the ID and pass it down.
// export default async function AdminLessonDetailPage({ params }: { params: { lessonId: string } }) {
//     // It safely gets the lessonId on the server.
//     const { lessonId } = await params;

//     // It then renders your client page, passing the lessonId as a simple prop.
//     return <AdminLessonDetailClientPage lessonId={lessonId} />;
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { LessonsApiService } from '@/services/api/lessons-api.service';
// import { Lesson } from '@/types';
// import Link from 'next/link';

// // The function signature receives the params object
// export default function AdminLessonDetailPage({ params }: { params: { lessonId: string } }) {

//     // --- THIS IS THE FIX ---
//     // We get the lessonId directly from the params prop.
//     // No 'use()' hook is needed here.
//     const { lessonId } = params;

//     const lessonApiService = new LessonsApiService();
//     const [lesson, setLesson] = useState<Lesson | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

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
//     }, [lessonId]); // We depend on lessonId, which is correct.

//     if (isLoading) return <div className="p-8">Loading lesson details...</div>;
//     if (!lesson) return <div className="p-8">Lesson not found.</div>;

//     // --- NO CHANGES NEEDED BELOW THIS LINE ---

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

// // app/admin/reviews/[lessonId]/page.tsx

// import AdminLessonDetailClientPage from "./AdminLessonDetailClientPage";

// // This is a Server Component. Its only job is to get the ID and pass it down.
// export default async function AdminLessonDetailPage({ params }: { params: { lessonId: string } }) {
//     // It safely gets the lessonId on the server.
//     const { lessonId } = params;

//     // It then renders your client page, passing the lessonId as a simple prop.
//     return <AdminLessonDetailClientPage lessonId={lessonId} />;
// }

// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { LessonsApiService } from '@/services/api/lessons-api.service';
// // import { Lesson } from '@/types';
// // import Link from 'next/link';

// // // The function signature is the only part that matters for getting the ID
// // export default function AdminLessonDetailPage({ params }: { params: { lessonId: string } }) {
// //     const lessonApiService = new LessonsApiService();
// //     const [lesson, setLesson] = useState<Lesson | null>(null);
// //     const [isLoading, setIsLoading] = useState(true);

// //     useEffect(() => {
// //         // We get the lessonId directly from params inside useEffect
// //         const { lessonId } = params;

// //         const fetchLesson = async () => {
// //             try {
// //                 const lessonData = await lessonApiService.getLessonById(lessonId);
// //                 setLesson(lessonData);
// //             } catch (error) {
// //                 console.error("Failed to fetch lesson details", error);
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         // Only run if lessonId is available
// //         if (lessonId) {
// //             fetchLesson();
// //         }
// //     }, [params]); // Depend on the entire params object

// //     if (isLoading) return <div className="p-8">Loading lesson details...</div>;
// //     if (!lesson) return <div className="p-8">Lesson not found.</div>;

// //     // --- NO CHANGES NEEDED BELOW THIS LINE ---

// //     return (
// //         <div className="container mx-auto p-8">
// //             <Link href="/admin/reviews" className="text-blue-500 hover:underline mb-6 inline-block">
// //                 &larr; Back to Approval Queue
// //             </Link>

// //             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
// //                 <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
// //                 <p className="text-gray-600 mt-2">
// //                     Submitted by: <strong>{lesson.teacher?.name || 'N/A'}</strong>
// //                 </p>
// //                 <p className="text-gray-500">
// //                     Subject: <strong>{lesson.subject}</strong> | Form: <strong>{lesson.form}</strong>
// //                 </p>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
// //                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Lesson Content</h2>
// //                     {lesson.videoUrl && (
// //                         <div className="mb-6">
// //                             <h3 className="text-xl font-medium mb-2">Video</h3>
// //                             <video controls className="w-full rounded-md" src={`http://localhost:3001/${lesson.videoUrl}`} />
// //                         </div>
// //                     )}
// //                     {lesson.textContent && (
// //                         <div>
// //                             <h3 className="text-xl font-medium mb-2">Text</h3>
// //                             <div className="prose max-w-none">
// //                                 <p>{lesson.textContent}</p>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
// //                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Details</h2>
// //                     <div className="space-y-2">
// //                         <p><strong>Price:</strong> {lesson.price} MWK</p>
// //                         <p><strong>Duration:</strong> {lesson.durationMinutes} minutes</p>
// //                         <p className="pt-2"><strong>Description:</strong> {lesson.description}</p>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }


// // // 'use client';

// // // import { useEffect, useState } from 'react';
// // // import { LessonsApiService } from '@/services/api/lessons-api.service';
// // // import { Lesson } from '@/types';
// // // import Link from 'next/link';

// // // // This component receives 'params' which contains the lessonId from the URL
// // // export default function AdminLessonDetailPage({ params }: { params: { lessonId: string } }) {
// // //     const lessonApiService = new LessonsApiService();
// // //     const [lesson, setLesson] = useState<Lesson | null>(null);
// // //     const [isLoading, setIsLoading] = useState(true);

// // //     useEffect(() => {
// // //         const fetchLesson = async () => {
// // //             try {
// // //                 // Fetch the specific lesson using the ID from the URL
// // //                 const lessonData = await lessonApiService.getLessonById(params.lessonId);
// // //                 setLesson(lessonData);
// // //             } catch (error) {
// // //                 console.error("Failed to fetch lesson details", error);
// // //             } finally {
// // //                 setIsLoading(false);
// // //             }
// // //         };
// // //         fetchLesson();
// // //     }, [params.lessonId]);

// // //     if (isLoading) return <div className="p-8">Loading lesson details...</div>;
// // //     if (!lesson) return <div className="p-8">Lesson not found.</div>;

// // //     return (
// // //         <div className="container mx-auto p-8">
// // //             {/* Back link to the main review queue */}
// // //             <Link href="/admin/reviews" className="text-blue-500 hover:underline mb-6 inline-block">
// // //                 &larr; Back to Approval Queue
// // //             </Link>

// // //             {/* Lesson Header */}
// // //             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
// // //                 <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
// // //                 <p className="text-gray-600 mt-2">
// // //                     Submitted by: <strong>{lesson.teacher?.name || 'N/A'}</strong>
// // //                 </p>
// // //                 <p className="text-gray-500">
// // //                     Subject: <strong>{lesson.subject}</strong> | Form: <strong>{lesson.form}</strong>
// // //                 </p>
// // //             </div>

// // //             {/* Lesson Content */}
// // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //                 <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
// // //                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Lesson Content</h2>
// // //                     {lesson.videoUrl && (
// // //                         <div className="mb-6">
// // //                             <h3 className="text-xl font-medium mb-2">Video</h3>
// // //                             <video controls className="w-full rounded-md" src={`http://localhost:3001/${lesson.videoUrl}`} />
// // //                         </div>
// // //                     )}
// // //                     {lesson.textContent && (
// // //                         <div>
// // //                             <h3 className="text-xl font-medium mb-2">Text</h3>
// // //                             <div className="prose max-w-none">
// // //                                 <p>{lesson.textContent}</p>
// // //                             </div>
// // //                         </div>
// // //                     )}
// // //                 </div>

// // //                 <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
// // //                     <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Details</h2>
// // //                     <div className="space-y-2">
// // //                         <p><strong>Price:</strong> {lesson.price} MWK</p>
// // //                         <p><strong>Duration:</strong> {lesson.durationMinutes} minutes</p>
// // //                         <p className="pt-2"><strong>Description:</strong> {lesson.description}</p>
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }