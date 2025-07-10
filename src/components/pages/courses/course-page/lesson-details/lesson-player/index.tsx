
"use client";
import { usePreferencesStore } from "@/stores/preferences";
import dynamic from "next/dynamic";
const VideoPlayer = dynamic(() => import("./video-player"), {
    ssr: false,
});

type LessonPlayerProps = {
    lesson: CourseLesson;
}

export const LessonPlayer = ({ lesson }: LessonPlayerProps) => {
    // isso faz que o componente seja renderizado somente de o autoplay mudar
    const autoplay = usePreferencesStore((state) => state.autoplay);

    const videoId = lesson.videoId;
    return (
        <div className="overflow-hidden w-full aspect-video bg-black">
            <VideoPlayer
                key={videoId} // isso força o componente a ser re-renderizado quando o videoId muda
                videoId={lesson.videoId}
                autoplay={autoplay}
            />
        </div>
    )
}