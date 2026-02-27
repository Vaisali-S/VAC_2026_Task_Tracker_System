import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const apiURL = "http://localhost:5000/api/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

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
      await axios.put(`${apiURL}/${id}`, {
        completed: !completed,
      });
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) return;

    try {
      await axios.put(`${apiURL}/${id}`, {
        title: editText,
      });
      setEditId(null);
      setEditText("");
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  };

  // 🔥 FILTER + SEARCH LOGIC
  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-10">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Task Manager
        </h1>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* 🔎 Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {/* 🎛 Filter Buttons */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${
              filter === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded ${
              filter === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Pending
          </button>
        </div>

        {/* Task List */}
        <ul>
          {filteredTasks.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() =>
                    handleToggle(t._id, t.completed)
                  }
                />

                {editId === t._id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    className="border p-1 rounded flex-1"
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      t.completed
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {t.title}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {editId === t._id ? (
                  <button
                    onClick={() => handleEditSave(t._id)}
                    className="text-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(t._id);
                      setEditText(t.title);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No tasks found
          </p>
        )}
      </div>
    </div>
  );
}

export default App;