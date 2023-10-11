import { useEffect, useState } from "react"
import Form from "./components/Form"
import List from "./components/List"

type Todo = {
    id: number,
    content: string,
    done: boolean,
}

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        async function fetchTodos() {
            try {
                const response = await fetch('/tasks');

                const data = await response.json();

                setTodos(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchTodos();
    }, []);

    async function addTodo(content: string): Promise<void> {
        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            const todo = await response.json();

            setTodos([...todos, todo]);
        } catch (error) {
            console.error(error);
        }
    }

    async function toggleTodo(id: number, done: boolean): Promise<void> {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ done }),
            });

            const updatedTodo: Todo = await response.json();

            setTodos(todos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, done: updatedTodo.done };
                }

                return todo;
            }));
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteTodo(id: number): Promise<void> {
        try {
            await fetch(`/tasks/${id}`, {
                method: 'DELETE',
            });

            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Form onSubmit={addTodo} />
            <List todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        </>
    )
}

