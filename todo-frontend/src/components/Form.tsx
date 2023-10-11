import { useState } from "react"

type FormProps = {
    onSubmit: (content: string) => Promise<void>;
}

export default function Form({ onSubmit }: FormProps) {
    const [content, setContent] = useState("")

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (content === "") {
            return;
        }

        onSubmit(content);

        setContent("");
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setContent(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="content">New task</label>
            <input
                value={content}
                onChange={handleChange}
                type="text"
                id="content"
            />
            <button type="submit">Add</button>
        </form>
    )
}

