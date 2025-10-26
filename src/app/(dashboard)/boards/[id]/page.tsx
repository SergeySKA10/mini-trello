import { BoardMigrationWrapper } from '@/components/board/BoardMigrationWrapper';

interface BoardPageParams {
    id: string;
}

interface BoardPageProps {
    params: Promise<BoardPageParams>;
}

export default async function BoardPage({ params }: BoardPageProps) {
    const { id } = await params;
    console.log('BoardPage params:', params);

    if (!id) {
        return (
            <div className="p-6">
                <h1 className="text-xl text-red-600">
                    Ошибка: ID доски не получен
                </h1>
                <p className="text-gray-600">
                    Params: {JSON.stringify(params)}
                </p>
            </div>
        );
    }

    return <BoardMigrationWrapper boardId={id} />;
}
