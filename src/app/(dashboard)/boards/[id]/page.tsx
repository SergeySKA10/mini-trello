import { BoardMigrationWrapper } from '@/components/board/BoardMigrationWrapper';

interface BoardPageProps {
    params: {
        id: string;
    };
}

export default function BoardPage({ params }: BoardPageProps) {
    console.log('BoardPage params:', params);

    if (!params.id) {
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

    return <BoardMigrationWrapper boardId={params.id} />;
}
