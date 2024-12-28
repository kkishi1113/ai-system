import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./todo.css"; // CSSファイルを追加

function ToDo() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todos")!) || [];
    } catch (error) {
      console.error("localStorageデータの読み込みエラー:", error);
      return [];
    }
  });
  const [newTodo, setNewTodo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === "") {
      setError("TODOを入力してください。");
      return;
    }
    setError("");
    setTodos([...todos, { id: uuidv4(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo: { id: string; completed: boolean }) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo: { id: string }) => todo.id !== id));
  };

  return (
    <div className="app">
      {" "}
      {/* CSSクラスを追加 */}
      <h1>TODOアプリ</h1>
      {error && <p className="error">{error}</p>} {/* CSSクラスを追加 */}
      <div className="input-area">
        {" "}
        {/* CSSクラスを追加 */}
        <input
          type="text"
          ref={inputRef}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="TODOを追加"
        />
        <button onClick={addTodo}>追加</button>
      </div>
      <ul>
        {todos.map((todo: { id: string; completed: boolean; text: string }) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDo;
