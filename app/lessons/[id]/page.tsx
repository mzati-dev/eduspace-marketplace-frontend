'use client';

import { useState, useEffect, use } from 'react';
import { Lesson } from '@/types';
import { lessonsApiService } from '@/services/api/api';
import { API_BASE_URL } from '@/services/api/api.constants';

/**
 * Next.js 15 requires params to be a Promise.
 * We unwrap it using React's 'use' hook for Client Components.
 */
export default function LessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap the params promise
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchLesson = async () => {
            try {
                const fetchedLesson = await lessonsApiService.getLessonById(id);
                setLesson(fetchedLesson);
            } catch (err) {
                console.error("Failed to fetch lesson:", err);
                setError('Sorry, we could not load this lesson.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLesson();
    }, [id]);

    const fullVideoUrl = lesson?.videoUrl ? `${API_BASE_URL}${lesson.videoUrl}` : null;

    if (isLoading) {
        return <div className="text-center p-10 text-white">Loading lesson...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    if (!lesson) {
        return <div className="text-center p-10 text-white">Lesson not found.</div>;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Lesson Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {lesson.title}
                </h1>

                {/* Video Player Section */}
                <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                    {fullVideoUrl ? (
                        <video
                            controls
                            width="100%"
                            key={fullVideoUrl}
                            className="w-full h-full"
                        >
                            <source src={fullVideoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-slate-400">No video available for this lesson.</p>
                        </div>
                    )}
                </div>

                {/* Lesson Details Section */}
                <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-2xl font-semibold text-white mb-3">About this lesson</h2>
                    <p className="text-slate-300 whitespace-pre-wrap">
                        {lesson.textContent}
                    </p>
                </div>
            </div>
        </main>
    );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { Lesson } from '@/types';
// import { lessonsApiService } from '@/services/api/api';
// import { API_BASE_URL } from '@/services/api/api.constants';



// export default function LessonPlayerPage({ params }: { params: { id: string } }) {
//     const [lesson, setLesson] = useState<Lesson | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         if (!params.id) return;

//         const fetchLesson = async () => {
//             try {
//                 const fetchedLesson = await lessonsApiService.getLessonById(params.id);
//                 setLesson(fetchedLesson);
//             } catch (err) {
//                 console.error("Failed to fetch lesson:", err);
//                 setError('Sorry, we could not load this lesson.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchLesson();
//     }, [params.id]);

//     const fullVideoUrl = lesson?.videoUrl ? `${API_BASE_URL}${lesson.videoUrl}` : null;

//     if (isLoading) {
//         return <div className="text-center p-10">Loading lesson...</div>;
//     }

//     if (error) {
//         return <div className="text-center p-10 text-red-500">{error}</div>;
//     }

//     if (!lesson) {
//         return <div className="text-center p-10">Lesson not found.</div>;
//     }

//     return (
//         <main className="container mx-auto px-4 py-8">
//             <div className="max-w-4xl mx-auto">
//                 {/* Lesson Title */}
//                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                     {lesson.title}
//                 </h1>

//                 {/* Video Player Section */}
//                 <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
//                     {fullVideoUrl ? (
//                         <video
//                             controls
//                             width="100%"
//                             key={fullVideoUrl}
//                             className="w-full h-full"
//                         >
//                             <source src={fullVideoUrl} type="video/mp4" />
//                             Your browser does not support the video tag.
//                         </video>
//                     ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                             <p className="text-slate-400">No video available for this lesson.</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Lesson Details Section */}
//                 <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                     <h2 className="text-2xl font-semibold text-white mb-3">About this lesson</h2>
//                     <p className="text-slate-300 whitespace-pre-wrap">
//                         {lesson.textContent}
//                     </p>
//                 </div>
//             </div>
//         </main>
//     );
// }