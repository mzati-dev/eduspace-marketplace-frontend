import React from 'react';

interface VideoPlayerProps {
    videoId?: string; // Make these optional so we can handle either/or
    videoUrl?: string; // Add this!
    title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, videoUrl, title }) => {

    // 1. Determine the source URL
    let finalUrl = '';

    if (videoUrl) {
        // ✅ BEST CASE: Use the full URL we saved in the database
        finalUrl = videoUrl;
    } else if (videoId) {
        // ⚠️ BACKUP: Construct it if we only have an ID (legacy support)
        const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
        if (libraryId) {
            finalUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
        }
    }

    // 2. Safety Check
    if (!finalUrl) {
        return (
            <div className="w-full aspect-video bg-slate-800 flex items-center justify-center rounded-lg text-red-400">
                Video Unavailable (Missing URL)
            </div>
        );
    }

    // 3. Render the Player
    return (
        <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <iframe
                src={finalUrl} // 👈 Uses the direct link!
                loading="lazy"
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
                title={title}
            />
        </div>
    );
};

export default VideoPlayer;