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
                const lessons = await lessonApiService.getPendingLessons();
                const sortedLessons = lessons.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setPendingLessons(sortedLessons);
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
        <div className="container mx-auto p-8 pt-20">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Lesson Approval Queue</h1>
            {pendingLessons.length === 0 ? (
                <p className="text-slate-600">No lessons are currently pending review. Great job!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pendingLessons.map((lesson) => (
                        <Link href={`/admin/reviews/${lesson.id}`} key={lesson.id}>
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between h-full hover:shadow-xl transition-shadow">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">{lesson.title}</h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        By: <strong>{lesson.teacher?.name || 'N/A'}</strong>
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Subject: <strong>{lesson.subject}</strong>
                                    </p>
                                    <p className="text-gray-400 text-xs mt-2">
                                        Created: {new Date(lesson.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
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