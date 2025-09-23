import express from "express";
import { 
    createNote, 
    deleteNote, 
    getAllNotes, 
    getNoteById, 
    updateNote 
} from "../controllers/notesController.js";
import validate from "../middleware/validate.js";
import { createNoteSchema, updateNoteSchema } from "../models/note.validation.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", validate(createNoteSchema), createNote);
router.put("/:id", validate(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);

export default router;