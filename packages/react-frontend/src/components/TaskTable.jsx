function Tasks(props) {
  const rows = props.tasks.map((task) => {
    return (
      <div key={task.id}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => props.toggleTask(task.id)}
        />

        <div className={task.completed ? 'task-complete' : 'task-active'}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>

        <button
          className="delete-button"
          onClick={() => props.removeTask(task.id)}
        >
          Delete
        </button>
      </div>
    );
  });

  return <div>{rows}</div>;
}
export default Tasks;
