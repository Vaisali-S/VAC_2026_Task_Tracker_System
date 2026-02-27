import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "./styles/midnight-ai.css";

function TaskPage({ user, setUser }) {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const apiURL = "http://localhost:5000/api/tasks";

  useEffect(() => {
    if (user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      fetchTasks();
    }
  }, [user.token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(apiURL);
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks:", err.message);
    }
  };

  const handleAdd = async () => {
    if (!task.trim()) return;
    try {
      await axios.post(apiURL, { title: task });
      setTask("");
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiURL}/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await axios.put(`${apiURL}/${id}`, { completed: !completed });
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(`${apiURL}/${id}`, { title: editText });
      setEditId(null);
      setEditText("");
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser({ token: "", username: "" });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user.username}`;
    if (hour < 18) return `Good afternoon, ${user.username}`;
    return `Good evening, ${user.username}`;
  };

  const filteredTasks = tasks
    .filter((t) => (filter === "completed" ? t.completed : filter === "pending" ? !t.completed : true))
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen flex justify-center pt-10">
      <div className="glass-card p-6 w-full max-w-md">

        {/* Greeting + Logout */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold ai-title">{getGreeting()}</h1>
          <button onClick={handleLogout} className="delete-text">
            Logout
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center ai-title">Task Manager</h1>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 ai-input"
          />
          <button onClick={handleAdd} className="ai-btn">
            Add
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full ai-input mb-4"
        />

        {/* Filter Buttons */}
        <div className="flex justify-between mb-4">
          <button onClick={() => setFilter("all")} className={`ai-btn ${filter !== "all" ? "opacity-50" : ""}`}>All</button>
          <button onClick={() => setFilter("completed")} className={`ai-btn ${filter !== "completed" ? "opacity-50" : ""}`}>Completed</button>
          <button onClick={() => setFilter("pending")} className={`ai-btn ${filter !== "pending" ? "opacity-50" : ""}`}>Pending</button>
        </div>

        {/* Task List */}
        <ul>
          {filteredTasks.map((t) => (
            <li key={t._id} className="task-card flex justify-between items-center mb-2">

              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => handleToggle(t._id, t.completed)}
                />

                {editId === t._id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="ai-input flex-1"
                  />
                ) : (
                  <span className={`flex-1 ${t.completed ? "line-through text-gray-400" : ""}`}>
                    {t.title}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {editId === t._id ? (
                  <button onClick={() => handleEditSave(t._id)} className="ai-btn">Save</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(t._id);
                      setEditText(t.title);
                    }}
                    className="ai-btn"
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => handleDelete(t._id)} className="delete-text">Delete</button>
              </div>

            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No tasks found</p>
        )}

      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState({
    username: localStorage.getItem("username") || "",
    token: localStorage.getItem("token") || "",
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user.token ? <Login setUser={setUser} /> : <Navigate to="/tasks" />}
        />
        <Route
          path="/signup"
          element={!user.token ? <Signup setUser={setUser} /> : <Navigate to="/tasks" />}
        />
        <Route
          path="/tasks"
          element={user.token ? <TaskPage user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={user.token ? "/tasks" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;