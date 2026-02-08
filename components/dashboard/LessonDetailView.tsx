'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, ShoppingCart, PlayCircle, Lock, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { Lesson } from '@/types';
import { useAppContext } from '../../context/AppContext';
import RatingForm from '../common/RatingForm';
import VideoPlayer from '../common/VideoPlayer';

interface LessonDetailViewProps {
    lesson: Lesson;
    isPurchased: boolean;
    onBack: () => void;
    onAddToCart: () => void;
    onBuyNow: () => void;
    onRatingSubmitted?: () => void;
}

export default function LessonDetailView({
    lesson,
    isPurchased,
    onBack,
    onAddToCart,
    onBuyNow,
    onRatingSubmitted,
}: LessonDetailViewProps) {
    const { user } = useAppContext();
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [currentLesson, setCurrentLesson] = useState(lesson);

    // Check if current user has already rated this lesson
    const userRating = user ? currentLesson.ratings?.find((r) => r.userId === user.id) : undefined;
    const hasRated = Boolean(userRating);

    const handleRatingSuccess = () => {
        setShowRatingForm(false);
        if (onRatingSubmitted) onRatingSubmitted();
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto animate-fade-in">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN: Video & Content --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. VIDEO PLAYER (With Lock Screen Logic) */}
                    <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 aspect-video relative flex items-center justify-center">
                        {isPurchased ? (
                            // ✅ SHOW BUNNY VIDEO
                            <VideoPlayer
                                videoId={currentLesson.videoId || ''}
                                // 👇 THIS IS THE KEY FIX:
                                videoUrl={currentLesson.videoUrl}
                                title={currentLesson.title}
                            />
                        ) : (
                            // 🔒 SHOW LOCK SCREEN
                            <div className="text-center p-8">
                                <div className="bg-slate-800/50 p-4 rounded-full inline-block mb-4">
                                    <Lock className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Lesson Locked</h3>
                                <p className="text-slate-400 mb-6">
                                    Purchase this lesson to watch the video.
                                </p>
                                <button
                                    onClick={onBuyNow}
                                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                                >
                                    Buy Now for MK{currentLesson.price.toLocaleString()}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 2. TITLE & META */}
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold text-white">{currentLesson.title}</h1>
                            {/* Rating Badge */}
                            {currentLesson.averageRating && (
                                <div className="flex items-center bg-slate-700/50 px-3 py-1 rounded-full">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                                    <span className="font-medium text-white">
                                        {currentLesson.averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-slate-400 ml-1 text-sm">
                                        ({currentLesson.ratings?.length || 0})
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                            <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                {currentLesson.subject}
                            </span>
                            <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                {currentLesson.form}
                            </span>
                            <span className="flex items-center">
                                <Clock size={16} className="mr-1" />
                                {new Date(currentLesson.createdAt).toLocaleDateString()}
                            </span>
                            <span>By {currentLesson.teacher?.name || 'Teacher'}</span>
                        </div>
                    </div>

                    {/* 3. DESCRIPTION / NOTES */}
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-semibold text-white mb-2">Description</h3>
                        <p className="text-slate-300 mb-6">{currentLesson.description}</p>

                        {/* Only show full notes if purchased */}
                        {isPurchased && currentLesson.textContent && (
                            <div className="bg-slate-900 p-6 rounded-md border border-slate-800">
                                <h3 className="text-lg font-semibold text-white mb-4">Lesson Notes</h3>
                                <div className="whitespace-pre-wrap text-slate-300">
                                    {currentLesson.textContent}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. RATING SECTION (Only if purchased) */}
                    {isPurchased && user?.role === 'student' && (
                        <div className="border-t border-slate-700 pt-8">
                            {!showRatingForm && !hasRated && (
                                <Button onClick={() => setShowRatingForm(true)}>
                                    Rate This Lesson
                                </Button>
                            )}

                            {showRatingForm && (
                                <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700">
                                    <h3 className="text-xl font-semibold text-white mb-4">Rate This Lesson</h3>
                                    <RatingForm
                                        lessonId={currentLesson.id}
                                        onSuccess={handleRatingSuccess}
                                        onCancel={() => setShowRatingForm(false)}
                                    />
                                </div>
                            )}

                            {hasRated && userRating && (
                                <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-700">
                                    <h3 className="text-xl font-semibold text-white mb-2">Your Rating</h3>
                                    <div className="flex items-center mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= userRating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`}
                                            />
                                        ))}
                                    </div>
                                    {userRating.comment && <p className="text-slate-300 mt-2">{userRating.comment}</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- RIGHT COLUMN: Purchase Card (Only if NOT purchased) --- */}
                {!isPurchased && (
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-4">Unlock this Lesson</h3>
                            <div className="text-3xl font-bold text-sky-400 mb-6">
                                MK {currentLesson.price.toLocaleString()}
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={onBuyNow}
                                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <PlayCircle size={20} />
                                    Buy & Watch Now
                                </button>
                                <button
                                    onClick={onAddToCart}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 mt-4 text-center">
                                One-time purchase. Unlimited access.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


// 'use client';

// import React, { useState } from 'react';
// import { ArrowLeft, Star, Clock, ShoppingCart, PlayCircle, Lock, Loader2 } from 'lucide-react';
// import Button from '../common/Button';
// import { Lesson } from '@/types';
// import { useAppContext } from '../../context/AppContext';
// import RatingForm from '../common/RatingForm';
// import VideoPlayer from '../common/VideoPlayer';
// // import VideoPlayer from '../lessons/VideoPlayer'; // <--- The new Bunny Player

// interface LessonDetailViewProps {
//     lesson: Lesson;
//     isPurchased: boolean; // <--- Vital for the lock screen
//     onBack: () => void;
//     onAddToCart: () => void;
//     onBuyNow: () => void;
//     onRatingSubmitted?: () => void;
// }

// export default function LessonDetailView({
//     lesson,
//     isPurchased,
//     onBack,
//     onAddToCart,
//     onBuyNow,
//     onRatingSubmitted,
// }: LessonDetailViewProps) {
//     const { user } = useAppContext();
//     const [showRatingForm, setShowRatingForm] = useState(false);
//     const [currentLesson, setCurrentLesson] = useState(lesson);

//     // Check if current user has already rated this lesson
//     const userRating = user ? currentLesson.ratings?.find((r) => r.userId === user.id) : undefined;
//     const hasRated = Boolean(userRating);

//     const handleRatingSuccess = () => {
//         setShowRatingForm(false);
//         if (onRatingSubmitted) onRatingSubmitted();
//     };

//     return (
//         <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto animate-fade-in">
//             {/* Back Button */}
//             <button
//                 onClick={onBack}
//                 className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
//             >
//                 <ArrowLeft size={20} className="mr-2" />
//                 Back to Dashboard
//             </button>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* --- LEFT COLUMN: Video & Content --- */}
//                 <div className="lg:col-span-2 space-y-8">

//                     {/* 1. VIDEO PLAYER (With Lock Screen Logic) */}
//                     <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 aspect-video relative flex items-center justify-center">
//                         {isPurchased ? (
//                             // ✅ SHOW BUNNY VIDEO
//                             <VideoPlayer
//                                 videoId={currentLesson.videoId || ''}
//                                 title={currentLesson.title}
//                             />
//                         ) : (
//                             // 🔒 SHOW LOCK SCREEN
//                             <div className="text-center p-8">
//                                 <div className="bg-slate-800/50 p-4 rounded-full inline-block mb-4">
//                                     <Lock className="w-12 h-12 text-slate-400" />
//                                 </div>
//                                 <h3 className="text-xl font-bold text-white mb-2">Lesson Locked</h3>
//                                 <p className="text-slate-400 mb-6">
//                                     Purchase this lesson to watch the video.
//                                 </p>
//                                 <button
//                                     onClick={onBuyNow}
//                                     className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
//                                 >
//                                     Buy Now for MK{currentLesson.price.toLocaleString()}
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     {/* 2. TITLE & META */}
//                     <div>
//                         <div className="flex justify-between items-start mb-4">
//                             <h1 className="text-3xl font-bold text-white">{currentLesson.title}</h1>
//                             {/* Rating Badge */}
//                             {currentLesson.averageRating && (
//                                 <div className="flex items-center bg-slate-700/50 px-3 py-1 rounded-full">
//                                     <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
//                                     <span className="font-medium text-white">
//                                         {currentLesson.averageRating.toFixed(1)}
//                                     </span>
//                                     <span className="text-slate-400 ml-1 text-sm">
//                                         ({currentLesson.ratings?.length || 0})
//                                     </span>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
//                             <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
//                                 {currentLesson.subject}
//                             </span>
//                             <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
//                                 {currentLesson.form}
//                             </span>
//                             <span className="flex items-center">
//                                 <Clock size={16} className="mr-1" />
//                                 {new Date(currentLesson.createdAt).toLocaleDateString()}
//                             </span>
//                             <span>By {currentLesson.teacher?.name || 'Teacher'}</span>
//                         </div>
//                     </div>

//                     {/* 3. DESCRIPTION / NOTES */}
//                     <div className="prose prose-invert max-w-none">
//                         <h3 className="text-xl font-semibold text-white mb-2">Description</h3>
//                         <p className="text-slate-300 mb-6">{currentLesson.description}</p>

//                         {/* Only show full notes if purchased */}
//                         {isPurchased && currentLesson.textContent && (
//                             <div className="bg-slate-900 p-6 rounded-md border border-slate-800">
//                                 <h3 className="text-lg font-semibold text-white mb-4">Lesson Notes</h3>
//                                 <div className="whitespace-pre-wrap text-slate-300">
//                                     {currentLesson.textContent}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* 4. RATING SECTION (Only if purchased) */}
//                     {isPurchased && user?.role === 'student' && (
//                         <div className="border-t border-slate-700 pt-8">
//                             {!showRatingForm && !hasRated && (
//                                 <Button onClick={() => setShowRatingForm(true)}>
//                                     Rate This Lesson
//                                 </Button>
//                             )}

//                             {showRatingForm && (
//                                 <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700">
//                                     <h3 className="text-xl font-semibold text-white mb-4">Rate This Lesson</h3>
//                                     <RatingForm
//                                         lessonId={currentLesson.id}
//                                         onSuccess={handleRatingSuccess}
//                                         onCancel={() => setShowRatingForm(false)}
//                                     />
//                                 </div>
//                             )}

//                             {hasRated && userRating && (
//                                 <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-700">
//                                     <h3 className="text-xl font-semibold text-white mb-2">Your Rating</h3>
//                                     <div className="flex items-center mb-2">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <Star
//                                                 key={star}
//                                                 className={`h-5 w-5 ${star <= userRating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`}
//                                             />
//                                         ))}
//                                     </div>
//                                     {userRating.comment && <p className="text-slate-300 mt-2">{userRating.comment}</p>}
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {/* --- RIGHT COLUMN: Purchase Card (Only if NOT purchased) --- */}
//                 {!isPurchased && (
//                     <div className="lg:col-span-1">
//                         <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
//                             <h3 className="text-xl font-bold text-white mb-4">Unlock this Lesson</h3>
//                             <div className="text-3xl font-bold text-sky-400 mb-6">
//                                 MK {currentLesson.price.toLocaleString()}
//                             </div>

//                             <div className="space-y-3">
//                                 <button
//                                     onClick={onBuyNow}
//                                     className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                                 >
//                                     <PlayCircle size={20} />
//                                     Buy & Watch Now
//                                 </button>
//                                 <button
//                                     onClick={onAddToCart}
//                                     className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                                 >
//                                     <ShoppingCart size={20} />
//                                     Add to Cart
//                                 </button>
//                             </div>

//                             <p className="text-xs text-slate-500 mt-4 text-center">
//                                 One-time purchase. Unlimited access.
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // 'use client';

// // import { ArrowLeft, Star, Loader2 } from 'lucide-react';
// // import Button from '../common/Button';
// // import { Lesson } from '@/types';
// // import { useAppContext } from '../../context/AppContext';
// // import { useState } from 'react';
// // import RatingForm from '../common/RatingForm';
// // // --- FIX 1: Import your API_BASE_URL ---
// // import { API_BASE_URL } from '@/services/api/api.constants';

// // interface LessonDetailViewProps {
// //     lesson: Lesson;
// //     onBack: () => void;
// //     onRatingSubmitted?: () => void;
// // }

// // /**
// //  * Detailed view of a lesson with rating functionality
// //  */
// // export default function LessonDetailView({
// //     lesson,
// //     onBack,
// //     onRatingSubmitted,
// // }: LessonDetailViewProps) {
// //     const { user } = useAppContext();
// //     const [showRatingForm, setShowRatingForm] = useState(false);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [currentLesson, setCurrentLesson] = useState(lesson);

// //     // Check if current user has already rated this lesson
// //     const userRating = user ? currentLesson.ratings?.find(r => r.userId === user.id) : undefined;
// //     const hasRated = Boolean(userRating);

// //     // Called when RatingForm successfully submits
// //     const handleRatingSuccess = () => {
// //         setShowRatingForm(false);
// //         // Optionally refresh or notify parent
// //         if (onRatingSubmitted) onRatingSubmitted();
// //     };

// //     return (
// //         <div className="animate-fade-in">
// //             {/* Back button */}
// //             <Button onClick={onBack} variant="ghost" className="mb-6" disabled={isLoading}>
// //                 {isLoading ? (
// //                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
// //                 ) : (
// //                     <ArrowLeft className="h-4 w-4 mr-2" />
// //                 )}
// //                 Back to Lessons
// //             </Button>

// //             {/* Lesson content container */}
// //             <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
// //                 {/* Video player */}
// //                 {currentLesson.videoUrl && (
// //                     <div className="bg-black">
// //                         <video
// //                             controls
// //                             className="w-full aspect-video"
// //                             // --- FIX 2: Build the correct streaming URL ---
// //                             src={`${API_BASE_URL}/lessons/${currentLesson.id}/video`}
// //                             key={currentLesson.id}
// //                         >
// //                             Your browser does not support the video tag.
// //                         </video>
// //                     </div>
// //                 )}

// //                 {/* Lesson details */}
// //                 <div className="p-8 space-y-6">
// //                     {/* Title and rating display */}
// //                     <div className="flex justify-between items-start">
// //                         <h1 className="text-3xl font-bold text-white">{currentLesson.title}</h1>
// //                         {currentLesson.averageRating && (
// //                             <div className="flex items-center bg-slate-700/50 px-3 py-1 rounded-full">
// //                                 <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
// //                                 <span className="font-medium text-white">
// //                                     {currentLesson.averageRating.toFixed(1)}
// //                                 </span>
// //                                 <span className="text-slate-400 ml-1 text-sm">
// //                                     ({currentLesson.ratings?.length || 0})
// //                                 </span>
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Lesson metadata */}
// //                     <div className="flex items-center gap-4 text-slate-300">
// //                         <span>{currentLesson.subject}</span>
// //                         <span>&bull;</span>
// //                         <span>{currentLesson.form}</span>
// //                         <span>&bull;</span>
// //                         <span>By {currentLesson.teacherName}</span>
// //                     </div>

// //                     {/* Rating section (RESTORED) */}
// //                     {user?.role === 'student' && (
// //                         <>
// //                             {/* Show rating button if not rated and form not shown */}
// //                             {!showRatingForm && !hasRated && (
// //                                 <Button
// //                                     onClick={() => setShowRatingForm(true)}
// //                                     className="w-full sm:w-auto"
// //                                     disabled={isLoading}
// //                                 >
// //                                     Rate This Lesson
// //                                 </Button>
// //                             )}

// //                             {/* Show rating form */}
// //                             {showRatingForm && (
// //                                 <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700">
// //                                     <h3 className="text-xl font-semibold text-white mb-4">Rate This Lesson</h3>
// //                                     <RatingForm
// //                                         lessonId={currentLesson.id}
// //                                         onSuccess={handleRatingSuccess}
// //                                         onCancel={() => setShowRatingForm(false)}
// //                                     />
// //                                 </div>
// //                             )}

// //                             {/* Show user's existing rating */}
// //                             {hasRated && userRating && (
// //                                 <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-700">
// //                                     <h3 className="text-xl font-semibold text-white mb-2">Your Rating</h3>
// //                                     <div className="flex items-center mb-2">
// //                                         {[1, 2, 3, 4, 5].map((star) => (
// //                                             <Star
// //                                                 key={star}
// //                                                 className={`h-5 w-5 ${star <= userRating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`}
// //                                             />
// //                                         ))}
// //                                     </div>
// //                                     {userRating.comment && <p className="text-slate-300 mt-2">{userRating.comment}</p>}
// //                                 </div>
// //                             )}
// //                         </>
// //                     )}

// //                     {/* Lesson content */}
// //                     <div>
// //                         <h3 className="text-xl font-semibold text-white mb-2">Lesson Notes</h3>
// //                         <div className="bg-slate-900 p-6 rounded-md prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
// //                             {currentLesson.textContent || 'No notes available for this lesson.'}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

