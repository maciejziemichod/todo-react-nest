import Item from './Item';

type ListProps = {
    todos: {
        id: number,
        content: string,
        done: boolean,
    }[];
    toggleTodo: (id: number, done: boolean) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
}

export default function List({ todos, toggleTodo, deleteTodo }: ListProps) {
    return (
        <ul>
            {todos.length === 0 && "No Todos"}
            {todos.map(todo => {
                return (
                    <Item
                        {...todo}
                        key={todo.id}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                )
            })}
        </ul>
    )
}
