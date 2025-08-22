import { getAdminComments } from "@/actions/course-comments";
import { AdminCommentItem } from "@/components/pages/admin/admin-commentt-item";

export default async function AdminCommentsPage() {

    const comments = await getAdminComments()
    return (
        <>
            <h1 className="text-3xl font-bold">Comentários</h1>

            <div className="w-full flex flex-col gap-3">
                {comments.map(comment => (
                    <AdminCommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </>
    );
}
