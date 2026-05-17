// backend.js
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import noteServices from "./models/note-services.js";
import todoServices from "./models/todo-services.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// GET all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await noteServices.getNotes();
    res.send({ notes_list: notes });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

// GET one note by id
app.get("/notes/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await noteServices.getNoteById(id);
  if (result === undefined || result === null) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// POST create a note
app.post("/notes", async (req, res) => {
  const note = req.body;
  const result = await noteServices.addNote(note);
  if (result) {
    res.status(201).send(result);
  } else {
    res.status(500).send("An error occurred in the server.");
  }
});

// DELETE a note by id
app.delete("/notes/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await noteServices.deleteNote(id);
  if (result === undefined || result === null) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoServices.getTodos();
    res.send({ todos_list: todos });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

// GET one todo by id
app.get("/todos/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await todoServices.getTodoById(id);
  if (result === undefined || result === null) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// POST create a todo
app.post("/todos", async (req, res) => {
  const todo = req.body;
  const result = await todoServices.addTodo(todo);
  if (result) {
    res.status(201).send(result);
  } else {
    res.status(500).send("An error occurred in the server.");
  }
});

// DELETE a todo by id
app.delete("/todos/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await todoServices.deleteTodo(id);
  if (result === undefined || result === null) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

// PATCH toggle todo complete
app.patch("/todos/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await todoServices.toggleTodoComplete(id);
  if (result === undefined || result === null) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

// listen
app.listen(process.env.PORT || port, () => {
  console.log(`Backend running at http://localhost:${process.env.PORT || port}`);
});