import AdminLessonDetailClientPage from "./AdminLessonDetailClientPage";


export default async function AdminLessonDetailPage({
    params
}: {
    params: Promise<{ lessonId: string }>
}) {

    const { lessonId } = await params;
    return <AdminLessonDetailClientPage lessonId={lessonId} />;
}