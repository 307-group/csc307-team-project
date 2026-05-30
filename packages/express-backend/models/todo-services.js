// models/todo-services.js
import Todo from "./todo.js";

async function getTodos(userID) {
  return await Todo.find({ userId: userID });
}

async function getTodoById(id) {
  try {
    return await Todo.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addTodo(todo, userID) {
  try {
    const newTodo = new Todo({ ...todo, userId: userID });
    return await newTodo.save();
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteTodo(id, userID) {
  try {
    return await Todo.findOneAndDelete({ _id: id, userId: userID });
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
