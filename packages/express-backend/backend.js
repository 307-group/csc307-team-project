// backend.js
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import PDFDocument from "pdfkit";
import noteServices from "./models/note-services.js";
import labelServices from "./models/label-services.js";
import todoServices from "./models/todo-services.js";
import mongoose from "mongoose";
import User from "./models/user.js";
import { registerUser, loginUser, authenticateUser } from "./auth.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "notes-app",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Auth routes (unprotected)
app.post("/signup", registerUser);
app.post("/login", loginUser);

// GET current user profile from token
app.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-hashedPassword");
    if (!user) return res.status(404).send("User not found.");
    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.getTime(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error.");
  }
});

// Notes routes (protected)
app.get("/notes", authenticateUser, async (req, res) => {
  try {
    const notes = await noteServices.getNotes();
    res.send({ notes_list: notes });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

app.get("/notes/:id/pdf", authenticateUser, async (req, res) => {
  try {
    const note = await noteServices.getNoteById(req.params.id);

    if (!note) {
      return res.status(404).send("Note not found.");
    }

    const title = note.title || "Untitled Note";
    const body = note.body || "";

    const safeTitle =
      title
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || "note";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeTitle}.pdf"`,
    );

    const doc = new PDFDocument({
      margin: 50,
    });

    doc.pipe(res);

    doc.fontSize(24).text(title, {
      underline: true,
    });

    doc.moveDown();

    doc.fontSize(12).text(body, {
      align: "left",
      lineGap: 6,
    });

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not generate PDF.");
  }
});

app.get("/notes/:id", authenticateUser, async (req, res) => {
  const result = await noteServices.getNoteById(req.params["id"]);
  if (!result) return res.status(404).send("Resource not found.");
  res.send(result);
});
app.post("/notes", authenticateUser, upload.single("image"), async (req, res) => {
  try {
    const { title, body, labelId } = req.body;

    const noteData = ({
      title,
      body,
      labelId: labelId && labelId !== "null" && labelId !== "undefined" ? labelId : null,
      imageUrl: req.file ? req.file.path : null,
    });
    const result = await noteServices.addNote(noteData);
    if (result) res.status(201).send(result);
    else res.status(500).send("An error occurred in the server.");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occured in the server");
  }
});
app.delete("/notes/:id", authenticateUser, async (req, res) => {
  const result = await noteServices.deleteNote(req.params["id"]);
  if (!result) return res.status(404).send("Resource not found.");
  res.status(200).send(result);
});

// Labels routes (protected)
app.get("/labels", authenticateUser, async (req, res) => {
  try {
    const labels = await labelServices.getLabels(req.user.userId);
    res.send({ labels_list: labels });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});
app.post("/labels", authenticateUser, async (req, res) => {
  const result = await labelServices.addLabel(req.body, req.user.userId);
  if (result) res.status(201).send(result);
  else res.status(500).send("An error occurred in the server.");
});
app.delete("/labels/:id", authenticateUser, async (req, res) => {
  const result = await labelServices.deleteLabel(
    req.params["id"],
    req.user.userId,
  );
  if (!result) return res.status(404).send("Resource not found.");
  res.status(200).send(result);
});

// Todos routes (all protected now)
app.get("/todos", authenticateUser, async (req, res) => {
  try {
    const todos = await todoServices.getTodos();
    res.send({ todos_list: todos });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});
app.get("/todos/:id", authenticateUser, async (req, res) => {
  const result = await todoServices.getTodoById(req.params["id"]);
  if (!result) return res.status(404).send("Resource not found.");
  res.send(result);
});
app.post("/todos", authenticateUser, async (req, res) => {
  const result = await todoServices.addTodo(req.body);
  if (result) res.status(201).send(result);
  else res.status(500).send("An error occurred in the server.");
});
app.delete("/todos/:id", authenticateUser, async (req, res) => {
  const result = await todoServices.deleteTodo(req.params["id"]);
  if (!result) return res.status(404).send("Resource not found.");
  res.status(200).send(result);
});
app.patch("/todos/:id", authenticateUser, async (req, res) => {
  const result = await todoServices.toggleTodoComplete(req.params["id"]);
  if (!result) return res.status(404).send("Resource not found.");
  res.status(200).send(result);
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Backend running at http://localhost:${process.env.PORT || port}`,
  );
});
