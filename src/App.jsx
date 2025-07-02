import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {


  // ------------Dark theme-------------

  const [darkMode, setDarkMode] = useState(() => {
    // Try to read user preference from localStorage or default to false (light)
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

   // Save darkMode changes to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);


  // ---------- Quick Links Logic ----------
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem("quickLinks");
    return saved ? JSON.parse(saved) : [];
  });
  const [customName, setCustomName] = useState("");
  const [newLink, setNewLink] = useState("");

  const addLink = () => {
    if (!customName.trim() || !newLink.trim()) return;

    let cleanURL = newLink.trim();
    if (cleanURL.startsWith("https://")) {
      cleanURL = cleanURL.slice(8);
    } else if (cleanURL.startsWith("http://")) {
      cleanURL = cleanURL.slice(7);
    }

    const updatedLinks = [...links, { name: customName.trim(), url: cleanURL }];
    setLinks(updatedLinks);
    localStorage.setItem("quickLinks", JSON.stringify(updatedLinks));
    setCustomName("");
    setNewLink("");
  };

  const removeLink = (index) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    localStorage.setItem("quickLinks", JSON.stringify(updated));
  };

  // ---------- To-Do List Logic ----------
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const updated = [...todos, { text: newTodo.trim(), done: false }];
    setTodos(updated);
    localStorage.setItem("todos", JSON.stringify(updated));
    setNewTodo("");
  };

  const toggleTodo = (index) => {
    const updated = [...todos];
    updated[index].done = !updated[index].done;
    setTodos(updated);
    localStorage.setItem("todos", JSON.stringify(updated));
  };

  const removeTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
    localStorage.setItem("todos", JSON.stringify(updated));
  };

  // ---------- Pomodoro Timer Logic ----------
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  
    return (
  <div className={`app-container ${darkMode ? "dark" : "light"}`}>
    <header className="nav-bar">
      <h1>Focus-Tab</h1>
      <button
        className="mode-toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle Dark/Light Mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>

    {/* Quick Links Section */}
    <div className="quick-links">
      <h2>Quick Links</h2>
      <p>Add Links you visit often...</p>
      <div className="link-inputs">
  <input
    type="text"
    value={customName}
    onChange={(e) => setCustomName(e.target.value)}
    placeholder="Name (e.g., Google)"
  />
  <div className="link-add-row">
    <input
      type="text"
      id="link-inputbar"
      value={newLink}
      onChange={(e) => setNewLink(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addLink()}
      placeholder="https://www.google.com"
    />
    <button onClick={addLink}>Add</button>
  </div>
</div>


      <ul>
        {links.map((link, i) => (
          <li key={i}>
            <a
              href={"https://" + link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
            <button onClick={() => removeLink(i)}>✕</button>
          </li>
        ))}
      </ul>
    </div>

    {/* To-Do List Section */}
    <div className="todo-list">
      <h2>To-Do List</h2>
      <p>Add tasks you need to remember...</p>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTodo()}
        placeholder="New task..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li
            key={i}
            className={todo.done ? "done" : ""}
            onClick={() => toggleTodo(i)}
          >
            {todo.text}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTodo(i);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* Pomodoro Timer Section */}
    <div className="pomodoro-timer">
      <h2>Pomodoro Timer</h2>
      {!isRunning && (
        <div className="time-inputs">
          <input
            type="number"
            min="1"
            max="90"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
          />
          <span>minutes</span>
        </div>
      )}

      <div className="timer-display">
        {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>

      <div className="timer-controls">
        <button
          onClick={() => {
            if (!isRunning) setTimeLeft(customMinutes * 60);
            setIsRunning(!isRunning);
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(customMinutes * 60);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  </div>
);
}