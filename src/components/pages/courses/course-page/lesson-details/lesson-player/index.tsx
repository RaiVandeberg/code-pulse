
"use client";
import dynamic from "next/dynamic";
const VideoPlayer = dynamic(() => import("./video-player"), {
    ssr: false,
});

type LessonPlayerProps = {
    lesson: CourseLesson;
}

export const LessonPlayer = ({ lesson }: LessonPlayerProps) => {
    return (
        <div className="overflow-hidden w-full aspect-video bg-black">
            <VideoPlayer
                videoId={lesson.videoId}
                autoplay={false}
            />
        </div>
    )
}