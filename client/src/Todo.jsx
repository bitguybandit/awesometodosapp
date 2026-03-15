// client/src/Todo.jsx
export default function Todo({ todo, setTodos }) {
  const updateTodo = async (todoId, currentStatus) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: currentStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      const json = await res.json();

      // If backend returns modifiedCount or acknowledged, check it
      if (json.modifiedCount > 0 || json.acknowledged) {
        setTodos((currentTodos) =>
          currentTodos.map((t) =>
            t._id === todoId ? { ...t, status: !t.status } : t
          )
        );
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }

      const json = await res.json();

      if (json.deletedCount > 0 || json.acknowledged) {
        setTodos((currentTodos) =>
          currentTodos.filter((t) => t._id !== todoId)
        );
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="todo">
      <p>{todo.todo}</p>
      <div className="mutations">
        <button
          className="todo__status"
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button
          className="todo__delete"
          onClick={() => deleteTodo(todo._id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}