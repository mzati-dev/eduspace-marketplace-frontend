'use client';

import React, { useState } from 'react';
import * as tus from 'tus-js-client';
import { TeacherApiService } from '@/services/api/teacher-api.service';
import { UploadCloud } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '@/services/api/api.constants';

interface UploadLessonFormProps {
    onSuccess: () => void;
}

// Define the Form type strictly to match your API
type FormLevel = "Form 1" | "Form 2" | "Form 3" | "Form 4";

export default function UploadLessonForm({ onSuccess }: UploadLessonFormProps) {
    const teacherApi = new TeacherApiService();
    const { user } = useAppContext();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        form: '' as FormLevel | '',
        price: '',
        durationMinutes: 60,
    });

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile) return alert("Please select a video file first.");
        if (!formData.form) return alert("Please select a Form level.");

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // 1. Initiate Upload
            const authResponse = await fetch(`${API_BASE_URL}/videos/initiate-upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: formData.title })
            });

            if (!authResponse.ok) {
                console.error("Auth Response Status:", authResponse.status);
                throw new Error("Failed to get upload permission");
            }

            // 👇 We get both videoId AND libraryId here
            const { signature, videoId, libraryId, expirationTime } = await authResponse.json();

            // 2. Upload to Bunny using tus
            const upload = new tus.Upload(videoFile, {
                endpoint: 'https://video.bunnycdn.com/tusupload',
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    AuthorizationSignature: signature,
                    AuthorizationExpire: expirationTime,
                    VideoId: videoId,
                    LibraryId: libraryId,
                },
                metadata: {
                    filetype: videoFile.type,
                    title: formData.title,
                },
                onError: (error) => {
                    console.error('Upload Failed:', error);
                    setIsUploading(false);
                    alert('Video upload failed.');
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
                    setUploadProgress(Number(percentage));
                },
                onSuccess: async () => {
                    // STEP 3: Save to DB (THE FIX IS HERE)
                    try {
                        console.log("Upload successful. Saving to DB...");

                        // 👇 Construct the Player URL using the variables we already have
                        const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;

                        const payload = {
                            title: formData.title,
                            description: formData.description,
                            subject: formData.subject,
                            price: Number(formData.price),
                            durationMinutes: Number(formData.durationMinutes),

                            // 👇 SEND BOTH THE ID AND THE FULL URL
                            videoId: videoId,
                            videoUrl: embedUrl, // <--- This ensures the DB gets the link!

                            thumbnail: '', // Bunny generates this automatically later
                            form: formData.form as FormLevel,
                            teacherTitle: (user as any)?.title || 'Tutor',
                        };

                        console.log("Sending Payload:", payload); // Debug check

                        await teacherApi.createLesson(payload);

                        alert('Lesson uploaded successfully!');
                        setIsUploading(false);
                        onSuccess();

                    } catch (dbError) {
                        console.error("Failed to save to DB:", dbError);
                        alert("Video uploaded, but failed to save lesson details.");
                        setIsUploading(false);
                    }
                },
            });

            upload.start();

        } catch (error) {
            console.error(error);
            setIsUploading(false);
            alert("Error starting upload. Check console.");
        }
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <UploadCloud className="text-sky-400" />
                Upload New Lesson
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1">Lesson Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none"
                        onChange={handleInputChange}
                        placeholder="e.g. Intro to Algebra"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none h-24"
                        onChange={handleInputChange}
                        placeholder="What is this lesson about?"
                    />
                </div>

                {/* Subject & Form */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Subject</label>
                        <select
                            name="subject"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none"
                            onChange={handleInputChange}
                        >
                            <option value="">Select Subject</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="English">English</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="History">History</option>
                            <option value="Geography">Geography</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Form / Grade</label>
                        <select
                            name="form"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none"
                            onChange={handleInputChange}
                        >
                            <option value="">Select Form</option>
                            <option value="Form 1">Form 1</option>
                            <option value="Form 2">Form 2</option>
                            <option value="Form 3">Form 3</option>
                            <option value="Form 4">Form 4</option>
                        </select>
                    </div>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1">Price (MWK)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500">MWK</span>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-12 text-white focus:border-sky-500 outline-none"
                            onChange={handleInputChange}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Video File Input */}
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:bg-slate-700/50 transition-colors">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                        <span className="block text-sky-400 font-semibold mb-1">
                            {videoFile ? 'Change Video' : 'Click to Upload Video'}
                        </span>
                        <span className="text-xs text-slate-400">
                            {videoFile ? videoFile.name : 'MP4, MOV, or WebM'}
                        </span>
                    </label>
                </div>

                {/* Progress Bar */}
                {isUploading && (
                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-sky-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                        <p className="text-center text-xs text-white mt-1">{uploadProgress}% Uploaded</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isUploading || !videoFile}
                    className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors
                        ${isUploading
                            ? 'bg-slate-600 cursor-not-allowed'
                            : 'bg-sky-600 hover:bg-sky-700'
                        }`}
                >
                    {isUploading ? 'Uploading to Bunny.net...' : 'Upload Lesson'}
                </button>
            </form>
        </div>
    );
}

// 'use client';

// import React, { useState } from 'react';
// import * as tus from 'tus-js-client';
// import { TeacherApiService } from '@/services/api/teacher-api.service';
// import { UploadCloud } from 'lucide-react';
// import { useAppContext } from '../../context/AppContext';
// import { API_BASE_URL } from '@/services/api/api.constants';
// // 👇 1. IMPORT YOUR CONFIG CONSTANT


// interface UploadLessonFormProps {
//     onSuccess: () => void;
// }

// // Define the Form type strictly to match your API
// type FormLevel = "Form 1" | "Form 2" | "Form 3" | "Form 4";

// export default function UploadLessonForm({ onSuccess }: UploadLessonFormProps) {
//     const teacherApi = new TeacherApiService();
//     const { user } = useAppContext();

//     // Form State
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         subject: '',
//         form: '' as FormLevel | '',
//         price: '',
//         durationMinutes: 60,
//     });

//     const [videoFile, setVideoFile] = useState<File | null>(null);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [isUploading, setIsUploading] = useState(false);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setVideoFile(e.target.files[0]);
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!videoFile) return alert("Please select a video file first.");
//         if (!formData.form) return alert("Please select a Form level.");

//         setIsUploading(true);
//         setUploadProgress(0);

//         try {
//             // 👇 2. USE THE DYNAMIC URL HERE (Fixes the 404)
//             const authResponse = await fetch(`${API_BASE_URL}/videos/initiate-upload`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ title: formData.title })
//             });

//             if (!authResponse.ok) {
//                 console.error("Auth Response Status:", authResponse.status);
//                 throw new Error("Failed to get upload permission");
//             }

//             const { signature, videoId, libraryId, expirationTime } = await authResponse.json();

//             // STEP 2: Upload to Bunny
//             const upload = new tus.Upload(videoFile, {
//                 endpoint: 'https://video.bunnycdn.com/tusupload',
//                 retryDelays: [0, 3000, 5000, 10000, 20000],
//                 headers: {
//                     AuthorizationSignature: signature,
//                     AuthorizationExpire: expirationTime,
//                     VideoId: videoId,
//                     LibraryId: libraryId,
//                 },
//                 metadata: {
//                     filetype: videoFile.type,
//                     title: formData.title,
//                 },
//                 onError: (error) => {
//                     console.error('Upload Failed:', error);
//                     setIsUploading(false);
//                     alert('Video upload failed.');
//                 },
//                 onProgress: (bytesUploaded, bytesTotal) => {
//                     const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
//                     setUploadProgress(Number(percentage));
//                 },
//                 onSuccess: async () => {
//                     // STEP 3: Save to DB
//                     try {
//                         const payload = {
//                             title: formData.title,
//                             description: formData.description,
//                             subject: formData.subject,
//                             price: Number(formData.price),
//                             durationMinutes: Number(formData.durationMinutes),
//                             videoId: videoId,
//                             thumbnail: '',
//                             form: formData.form as FormLevel,
//                             teacherTitle: (user as any)?.title || 'Tutor',
//                         };

//                         await teacherApi.createLesson(payload);

//                         alert('Lesson uploaded successfully!');
//                         setIsUploading(false);
//                         onSuccess();

//                     } catch (dbError) {
//                         console.error("Failed to save to DB:", dbError);
//                         alert("Video uploaded, but failed to save lesson details.");
//                         setIsUploading(false);
//                     }
//                 },
//             });

//             upload.start();

//         } catch (error) {
//             console.error(error);
//             setIsUploading(false);
//             alert("Error starting upload. Check console.");
//         }
//     };

//     return (
//         <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl mx-auto">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//                 <UploadCloud className="text-sky-400" />
//                 Upload New Lesson
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Title */}
//                 <div>
//                     <label className="block text-slate-400 text-sm mb-1">Lesson Title</label>
//                     <input
//                         type="text"
//                         name="title"
//                         required
//                         className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none"
//                         onChange={handleInputChange}
//                         placeholder="e.g. Intro to Algebra"
//                     />
//                 </div>

//                 {/* Description */}
//                 <div>
//                     <label className="block text-slate-400 text-sm mb-1">Description</label>
//                     <textarea
//                         name="description"
//                         required
//                         className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none h-24"
//                         onChange={handleInputChange}
//                         placeholder="What is this lesson about?"
//                     />
//                 </div>

//                 {/* Subject & Form */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-slate-400 text-sm mb-1">Subject</label>
//                         <select
//                             name="subject"
//                             required
//                             className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none"
//                             onChange={handleInputChange}
//                         >
//                             <option value="">Select Subject</option>
//                             <option value="Mathematics">Mathematics</option>
//                             <option value="English">English</option>
//                             <option value="Physics">Physics</option>
//                             <option value="Chemistry">Chemistry</option>
//                             <option value="Biology">Biology</option>
//                             <option value="History">History</option>
//                             <option value="Geography">Geography</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-slate-400 text-sm mb-1">Form / Grade</label>
//                         <select
//                             name="form"
//                             required
//                             className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-sky-500 outline-none"
//                             onChange={handleInputChange}
//                         >
//                             <option value="">Select Form</option>
//                             <option value="Form 1">Form 1</option>
//                             <option value="Form 2">Form 2</option>
//                             <option value="Form 3">Form 3</option>
//                             <option value="Form 4">Form 4</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* Price */}
//                 <div>
//                     <label className="block text-slate-400 text-sm mb-1">Price (MWK)</label>
//                     <div className="relative">
//                         <span className="absolute left-3 top-2 text-slate-500">MWK</span>
//                         <input
//                             type="number"
//                             name="price"
//                             required
//                             min="0"
//                             className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-12 text-white focus:border-sky-500 outline-none"
//                             onChange={handleInputChange}
//                             placeholder="0.00"
//                         />
//                     </div>
//                 </div>

//                 {/* Video File Input */}
//                 <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:bg-slate-700/50 transition-colors">
//                     <input
//                         type="file"
//                         accept="video/*"
//                         onChange={handleFileChange}
//                         className="hidden"
//                         id="video-upload"
//                     />
//                     <label htmlFor="video-upload" className="cursor-pointer">
//                         <span className="block text-sky-400 font-semibold mb-1">
//                             {videoFile ? 'Change Video' : 'Click to Upload Video'}
//                         </span>
//                         <span className="text-xs text-slate-400">
//                             {videoFile ? videoFile.name : 'MP4, MOV, or WebM'}
//                         </span>
//                     </label>
//                 </div>

//                 {/* Progress Bar */}
//                 {isUploading && (
//                     <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
//                         <div
//                             className="bg-sky-500 h-4 rounded-full transition-all duration-300"
//                             style={{ width: `${uploadProgress}%` }}
//                         ></div>
//                         <p className="text-center text-xs text-white mt-1">{uploadProgress}% Uploaded</p>
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     disabled={isUploading || !videoFile}
//                     className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors
//                         ${isUploading
//                             ? 'bg-slate-600 cursor-not-allowed'
//                             : 'bg-sky-600 hover:bg-sky-700'
//                         }`}
//                 >
//                     {isUploading ? 'Uploading to Bunny.net...' : 'Upload Lesson'}
//                 </button>
//             </form>
//         </div>
//     );
// }