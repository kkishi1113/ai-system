import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

function ToDo() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (error) {
      console.error("localStorageデータの読み込みエラー:", error);
      return [];
    }
  });
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement & { focus: () => void }>(null);

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
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4" id="todo-app-title">
        TODOアプリ
      </h1>
      {error && (
        <p className="text-red-500 text-center mb-4" role="alert">
          {error}
        </p>
      )}
      <div className="flex mb-4">
        <input
          type="text"
          ref={inputRef}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="TODOを追加"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="新しいTODOを入力"
          aria-describedby="todo-app-title"
        />
        <button
          onClick={addTodo}
          className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="TODOを追加"
        >
          追加
        </button>
      </div>
      <ul className="space-y-2" role="list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center p-2 border border-gray-200 rounded-md ${
              todo.completed ? "bg-gray-100 line-through" : ""
            }`}
            role="listitem"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
              className="mr-2"
              aria-labelledby={`todo-${todo.id}`}
            />
            <span id={`todo-${todo.id}`} className="flex-grow">
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`TODO "${todo.text}" を削除`}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDo;

// import React, { useState, useEffect, useRef } from "react";
// import { v4 as uuidv4 } from "uuid";
// import "./todo.css"; // CSSファイルを追加

// function ToDo() {
//   const [todos, setTodos] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("todos")!) || [];
//     } catch (error) {
//       console.error("localStorageデータの読み込みエラー:", error);
//       return [];
//     }
//   });
//   const [newTodo, setNewTodo] = useState<string>("");
//   const [error, setError] = useState<string>("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     localStorage.setItem("todos", JSON.stringify(todos));
//   }, [todos]);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   const addTodo = () => {
//     if (newTodo.trim() === "") {
//       setError("TODOを入力してください。");
//       return;
//     }
//     setError("");
//     setTodos([...todos, { id: uuidv4(), text: newTodo, completed: false }]);
//     setNewTodo("");
//   };

//   const toggleComplete = (id: string) => {
//     setTodos(
//       todos.map((todo: { id: string; completed: boolean }) =>
//         todo.id === id ? { ...todo, completed: !todo.completed } : todo
//       )
//     );
//   };

//   const deleteTodo = (id: string) => {
//     setTodos(todos.filter((todo: { id: string }) => todo.id !== id));
//   };

//   return (
//     <div className="app">
//       {" "}
//       {/* CSSクラスを追加 */}
//       <h1>TODOアプリ</h1>
//       {error && <p className="error">{error}</p>} {/* CSSクラスを追加 */}
//       <div className="input-area">
//         {" "}
//         {/* CSSクラスを追加 */}
//         <input
//           type="text"
//           ref={inputRef}
//           value={newTodo}
//           onChange={(e) => setNewTodo(e.target.value)}
//           placeholder="TODOを追加"
//         />
//         <button onClick={addTodo}>追加</button>
//       </div>
//       <ul>
//         {todos.map((todo: { id: string; completed: boolean; text: string }) => (
//           <li
//             key={todo.id}
//             className={`todo-item ${todo.completed ? "completed" : ""}`}
//           >
//             <input
//               type="checkbox"
//               checked={todo.completed}
//               onChange={() => toggleComplete(todo.id)}
//             />
//             {todo.text}
//             <button onClick={() => deleteTodo(todo.id)}>削除</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// export default ToDo;
