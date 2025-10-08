// import { BoardView } from '@/features/boards/components/BoardView/BoardView';
import { BoardMigrationWrapper } from '@/components/board/BoardMigrationWrapper';

interface BoardPageProps {
    params: {
        id: string;
    };
}

export default function Home({ params }: BoardPageProps) {
    return (
        <main>
            {/* <BoardView /> */}
            <BoardMigrationWrapper boardId={params.id} />
        </main>
    );
}
