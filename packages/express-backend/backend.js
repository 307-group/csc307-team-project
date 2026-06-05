// backend.js
// swagger run at http://localhost:8000/api-docs
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import PDFDocument from "pdfkit";
import fetch from "node-fetch";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import noteServices from "./models/note-services.js";
import labelServices from "./models/label-services.js";
import todoServices from "./models/todo-services.js";
import mongoose from "mongoose";
import User from "./models/user.js";
import { registerUser, loginUser, authenticateUser } from "./auth.js";
import { v2 as cloudinary } from "cloudinary";
import { Buffer } from "buffer";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Database:", mongoose.connection.db.databaseName);
  })
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NoteApp API",
      version: "1.0.0",
      description: "API documentation for NoteApp backend",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./backend.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     description: Registers a new user with name, email, and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
app.post("/signup", registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     description: Logs in a user using email and password. Returns a JWT token if successful.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
app.post("/login", loginUser);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the logged-in user's profile information using the JWT token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     description: Gets all notes for the currently logged-in user.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes returned successfully
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Server error
 */
app.get("/notes", authenticateUser, async (req, res) => {
  try {
    const notes = await noteServices.getNotes(req.user.userId);
    res.send({ notes_list: notes });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

/**
 * @swagger
 * /notes/{id}/pdf:
 *   get:
 *     summary: Download a note as PDF
 *     description: Generates and downloads a PDF version of a note, including its title, body, and optional image.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 *       500:
 *         description: Could not generate PDF
 */
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

    if (note.imageUrl) {
      try {
        const imageResponse = await fetch(note.imageUrl);

        if (imageResponse.ok) {
          const imageArrayBuffer = await imageResponse.arrayBuffer();
          const imageBuffer = Buffer.from(imageArrayBuffer);

          doc.moveDown();

          doc.image(imageBuffer, {
            fit: [450, 300],
            align: "center",
          });
        }
      } catch (imageError) {
        console.log("Could not add image to PDF: ", imageError);
      }
    }

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

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get one note by ID
 *     description: Returns a single note by its ID.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID
 *     responses:
 *       200:
 *         description: Note returned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
app.get("/notes/:id", authenticateUser, async (req, res) => {
  const result = await noteServices.getNoteById(req.params["id"]);
  if (!result) return res.status(404).send("Resource not found.");
  res.send(result);
});

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     description: Creates a new note for the logged-in user. An image can optionally be uploaded.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first note
 *               body:
 *                 type: string
 *                 example: This is the body of my note.
 *               labelId:
 *                 type: string
 *                 example: 665f123456789abc12345678
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Note created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.post(
  "/notes",
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, body, labelId } = req.body;

      let imageUrl = null;
      let imagePublicId = null;

      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "notes-app" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );

          stream.end(req.file.buffer);
        });

        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const noteData = {
        title,
        body,
        labelId:
          labelId && labelId !== "null" && labelId !== "undefined"
            ? labelId
            : null,
        imageUrl,
        imagePublicId,
        userId: req.user.userId,
      };

      const result = await noteServices.addNote(noteData);

      if (result) res.status(201).send(result);
      else res.status(500).send("An error occurred in the server.");
    } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred in the server.");
    }
  },
);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note owned by the logged-in user. If the note has an image, the image is also removed from Cloudinary.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden. User does not own this note.
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
app.delete("/notes/:id", authenticateUser, async (req, res) => {
  try {
    const note = await noteServices.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).send("Resource not found.");
    }

    if (String(note.userId) !== String(req.user.userId)) {
      return res.status(403).send("Forbidden");
    }

    if (note.imagePublicId) {
      await cloudinary.uploader.destroy(note.imagePublicId);
    }

    const result = await noteServices.deleteNote(
      req.params.id,
      req.user.userId,
    );

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: Updates the title, body, or label of an existing note.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated note title
 *               body:
 *                 type: string
 *                 example: Updated note body
 *               labelId:
 *                 type: string
 *                 example: 665f123456789abc12345678
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
app.put("/notes/:id", authenticateUser, async (req, res) => {
  const result = await noteServices.updateNote(
    req.params["id"],
    req.user.userId,
    req.body,
  );
  if (!result) return res.status(404).send("Resource not found.");
  res.status(200).send(result);
});

/**
 * @swagger
 * /labels:
 *   get:
 *     summary: Get all labels
 *     description: Gets all labels for the logged-in user.
 *     tags:
 *       - Labels
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Labels returned successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get("/labels", authenticateUser, async (req, res) => {
  try {
    const labels = await labelServices.getLabels(req.user.userId);
    res.send({ labels_list: labels });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

/**
 * @swagger
 * /labels:
 *   post:
 *     summary: Create a new label
 *     description: Creates a label for the logged-in user.
 *     tags:
 *       - Labels
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: School
 *               color:
 *                 type: string
 *                 example: "#60a5fa"
 *     responses:
 *       201:
 *         description: Label created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.post("/labels", authenticateUser, async (req, res) => {
  const result = await labelServices.addLabel(req.body, req.user.userId);
  if (result) res.status(201).send(result);
  else res.status(500).send("An error occurred in the server.");
});

/**
 * @swagger
 * /labels/{id}:
 *   delete:
 *     summary: Delete a label
 *     description: Deletes a label owned by the logged-in user.
 *     tags:
 *       - Labels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The label ID
 *     responses:
 *       200:
 *         description: Label deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
app.delete("/labels/:id", authenticateUser, async (req, res) => {
  const result = await labelServices.deleteLabel(
    req.params["id"],
    req.user.userId,
  );
  if (!result) return res.status(404).send("Resource not found.");
  res.status(200).send(result);
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     description: Gets all todos for the logged-in user.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todos returned successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get("/todos", authenticateUser, async (req, res) => {
  try {
    const todos = await todoServices.getTodos(req.user.userId);
    res.send({ todos_list: todos });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get one todo by ID
 *     description: Returns a single todo by its ID.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo returned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
app.get("/todos/:id", authenticateUser, async (req, res) => {
  const result = await todoServices.getTodoById(req.params["id"]);
  if (!result) return res.status(404).send("Resource not found.");
  res.send(result);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     description: Creates a todo for the logged-in user.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish homework
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.post("/todos", authenticateUser, async (req, res) => {
  const result = await todoServices.addTodo(req.body, req.user.userId);
  if (result) res.status(201).send(result);
  else res.status(500).send("An error occurred in the server.");
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Deletes a todo owned by the logged-in user.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
app.delete("/todos/:id", authenticateUser, async (req, res) => {
  const result = await todoServices.deleteTodo(
    req.params["id"],
    req.user.userId,
  );
  if (!result) return res.status(404).send("Resource not found.");
  res.status(200).send(result);
});

/**
 * @swagger
 * /todos/{id}:
 *   patch:
 *     summary: Toggle todo completion
 *     description: Toggles a todo between completed and not completed.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
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
