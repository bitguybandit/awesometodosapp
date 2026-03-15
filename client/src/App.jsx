import { useEffect, useState } from "react";
import Todo from "./Todo"; // we'll create this next

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  // Fetch all todos when component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/todos");
        const data = await res.json();
        setTodos(data); // data is array of todos from backend
      } catch (error) {
        console.error("Failed to load todos:", error);
      }
    };
    fetchTodos();
  }, []); // empty array = run once on mount

  // Create new todo
  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.trim().length < 3) return; // small validation

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: content }),
      });

      if (!res.ok) throw new Error("Failed to create todo");

      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]); // add to list
      setContent(""); // clear input
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <main className="container">
      <h1 className="title">Awesome Todos</h1>

      {/* Form to add new todo */}
      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <button type="submit">Create Todo</button>
      </form>

      {/* List of todos */}
      <div className="todos">
  {todos.length > 0 ? (
    todos.map((todo) => (
      <Todo 
        key={todo._id} 
        todo={todo} 
        setTodos={setTodos} 
      />
    ))
  ) : (
    <p style={{ 
      textAlign: "center", 
      color: "#777", 
      marginTop: "2rem",
      fontSize: "1.1rem"
    }}>
      No todos yet — add one above!
    </p>
  )}
</div>
    </main>
  );
}