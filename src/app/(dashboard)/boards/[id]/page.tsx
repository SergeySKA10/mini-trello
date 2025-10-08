import { BoardMigrationWrapper } from '@/components/board/BoardMigrationWrapper';

interface BoardPageProps {
    params: {
        id: string;
    };
}

export default function BoardPage({ params }: BoardPageProps) {
    return <BoardMigrationWrapper boardId={params.id} />;
}
