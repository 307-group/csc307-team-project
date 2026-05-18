// models/todo-services.js
import Todo from "./todo.js";

async function getTodos() {
  return await Todo.find();
}

async function getTodoById(id) {
  try {
    return await Todo.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addTodo(todo) {
  try {
    const newTodo = new Todo(todo);
    return await newTodo.save();
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteTodo(id) {
  try {
    return await Todo.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function toggleTodoComplete(id) {
  try {
    const todo = await Todo.findById(id);
    if (!todo) return undefined;
    todo.completed = !todo.completed;
    return await todo.save();
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default {
  getTodos,
  getTodoById,
  addTodo,
  deleteTodo,
  toggleTodoComplete,
};
