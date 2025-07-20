
"use client";
import { markLessonAsCompleted } from "@/actions/course-progress";
import { queryKeys } from "@/constants/query-key";
import { queryClient } from "@/lib/tanstack-query";
import { usePreferencesStore } from "@/stores/preferences";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { set } from "date-fns";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
const VideoPlayer = dynamic(() => import("./video-player"), {
    ssr: false,
});

type LessonPlayerProps = {
    lesson: CourseLesson;
    nextLesson?: CourseLesson
}

export const LessonPlayer = ({ lesson, nextLesson }: LessonPlayerProps) => {
    // isso faz que o componente seja renderizado somente de o autoplay mudar
    const autoplay = usePreferencesStore((state) => state.autoplay);
    const setExpandModules = usePreferencesStore((state) => state.setExpandModules);
    const queryClient = useQueryClient();
    const params = useParams();
    const courseSlug = params.slug as string;
    const router = useRouter();
    const { mutateAsync: handleCompletedLesson, isPending: isCompletingLesson } = useMutation({
        mutationFn: () => markLessonAsCompleted({ lessonId: lesson.id, courseSlug }),
        // faz ele redender novamente o componente
        // e atualiza o estado do curso
        onSuccess: () => {
            queryClient.invalidateQueries(
                {
                    queryKey: queryKeys.CourseProgress(courseSlug)
                }
            );
        }
    })
    const videoId = lesson.videoId;
    const handleMoveToNextLesson = async () => {
        await handleCompletedLesson();
        if (!autoplay || !nextLesson) return;
        if (nextLesson.moduleId !== lesson.moduleId) {
            setExpandModules(nextLesson.moduleId);
        };
        router.push(`/courses/${courseSlug}/${nextLesson.moduleId}/lesson/${nextLesson.id}`);
    }
    return (
        <div className="overflow-hidden w-full aspect-video bg-black">
            <VideoPlayer
                key={videoId} // isso força o componente a ser re-renderizado quando o videoId muda
                videoId={lesson.videoId}
                autoplay={autoplay}
                onEnd={handleMoveToNextLesson}
            />
        </div>
    )
}