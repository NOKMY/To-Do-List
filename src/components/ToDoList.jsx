import React, { useState, useRef, useEffect } from "react";
import "../css/ToDoList.css";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [removingIndex, setRemovingIndex] = useState(null);
  const addedItemRef = useRef(null);
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (addedItemRef.current) {
      addedItemRef.current.classList.add("fade-in");
      setTimeout(() => {
        addedItemRef.current?.classList.remove("fade-in");
        addedItemRef.current = null;
      }, 300);
    }
  }, [tasks]);

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, isDone: false }]);
      setNewTask("");
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a task!");
    }
  }

  function deleteTask(index) {
    setRemovingIndex(index);
    setTimeout(() => {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      setRemovingIndex(null);
    }, 300);
  }

  function toggleDone(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].isDone = !updatedTasks[index].isDone;
    setTasks(updatedTasks);
  }

  function startEditing(index, text) {
    setEditingTaskIndex(index);
    setEditedTaskText(text);
  }

  function saveEditedTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editedTaskText;
    setTasks(updatedTasks);
    setEditingTaskIndex(null);
    setEditedTaskText("");
  }

  function getDisplayedText(text) {
    const maxLength = 30;
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }

  function clearAllTasks() {
    if (tasks.length === 0) {
      setErrorMessage("Task list is already empty!");
    } else {
      tasks.forEach((_, index) => {
        setRemovingIndex(index);
      });
      setTimeout(() => {
        setTasks([]);
        setRemovingIndex(null);
        setErrorMessage("");
      }, 300);
    }
  }

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    const copyListItems = [...tasks];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(copyListItems);
  };

  return (
    <div className="to-do-list">
      <h1>TO DO LIST</h1>
      <div className="input-area">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          ADD
        </button>
        <button className="clear-all-button" onClick={clearAllTasks}>
          CLEAR ALL
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <ol>
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`${task.isDone ? "is-done" : ""} ${
              removingIndex === index ? "fade-out" : ""
            }`}
            ref={tasks.length - 1 === index ? addedItemRef : null}
            draggable
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            onDragOver={(e) => e.preventDefault()}
          >
            {editingTaskIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                />
                <button onClick={() => saveEditedTask(index)}>Save</button>
              </>
            ) : (
              <>
                <div className="checkbox-container">
                  <span
                    className={`checkbox ${task.isDone ? "checked" : ""}`}
                    onClick={() => toggleDone(index)}
                  >
                    {task.isDone && "✓"}
                  </span>
                  <span className="text">{getDisplayedText(task.text)}</span>
                </div>
                <div className="task-buttons">
                  <button
                    className="view-button"
                    onClick={() => setViewingTask(task.text)}
                    style={{ background: "#4682B4", color: "white" }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => startEditing(index, task.text)}
                    style={{ background: "#FFD700", color: "white" }}
                  >
                    Update
                  </button>
                  {task.isDone ? (
                    <button
                      onClick={() => toggleDone(index)}
                      style={{ background: "#800080", color: "white" }}
                    >
                      UNDO
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleDone(index)}
                      style={{ background: "#4CAF50", color: "white" }}
                    >
                      Done
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(index)}
                    style={{ background: "#e74c3c", color: "white" }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>

      {viewingTask && (
        <div className="modal">
          <div className="modal-content">
            <h2>Task Details</h2>
            <p>{viewingTask}</p>
            <button className="close-button" onClick={() => setViewingTask(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDoList;