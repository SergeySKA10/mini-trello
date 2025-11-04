import { BoardMigrationWrapper } from '@/components/board/BoardMigrationWrapper';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface BoardPageParams {
    id: string;
}

interface BoardPageProps {
    params: Promise<BoardPageParams>;
}

export default async function BoardPage({ params }: BoardPageProps) {
    const { id } = await params;

    return (
        <ProtectedRoute>
            <BoardMigrationWrapper boardId={id} />
        </ProtectedRoute>
    );
}
