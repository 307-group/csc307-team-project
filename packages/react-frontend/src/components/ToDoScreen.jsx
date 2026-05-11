import { useState } from 'react';
import Tasks from './TaskTable';

function ToDoScreen() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  function addTask() {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
    setShowModal(false);
  }

  function removeTask(id) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }
  return (
    <div className="todo-screen">
      <div className="todo-header">
        <h1>To-Do</h1>

        <button className="new-task-button" onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </div>

      <h2>Tasks · {activeTasks.length}</h2>
      <Tasks
        tasks={activeTasks}
        removeTask={removeTask}
        toggleTask={toggleTask}
      />

      <h2>Done · {completedTasks.length}</h2>
      <Tasks
        tasks={completedTasks}
        removeTask={removeTask}
        toggleTask={toggleTask}
      />

      {showModal && (
        <div className="modal-background">
          <div className="task-modal">
            <h2>New Task</h2>

            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
            />

            <label>
              Description <span>(optional)</span>
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any extra details..."
            />

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={addTask}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToDoScreen;
