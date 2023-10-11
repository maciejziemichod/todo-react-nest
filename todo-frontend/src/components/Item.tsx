type ItemProps = {
    id: number;
    content: string;
    done: boolean;
    toggleTodo: (id: number, done: boolean) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
}

export default function Item({ done, id, content, toggleTodo, deleteTodo }: ItemProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        toggleTodo(id, e.target.checked);
    }

    function handleClick() {
        deleteTodo(id);
    }
    return (
        <li className={done ? 'done' : ''}>
            <input
                type="checkbox"
                id={id.toString()}
                checked={done}
                onChange={handleChange}
            />
            <label htmlFor={id.toString()}>
                {content}
            </label>
            <button onClick={handleClick}>
                Delete
            </button>
        </li>
    )
}
