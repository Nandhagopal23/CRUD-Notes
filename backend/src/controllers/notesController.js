import Note from "../models/Note.js"
import { generateSummary, suggestTags } from "../lib/textUtils.js";

export async function getAllNotes(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);
        const skip = (page - 1) * limit;

        const [notes, total] = await Promise.all([
            Note.find()
                .sort({ createdAt: -1 }) // newest first
                .skip(skip)
                .limit(limit),
            Note.countDocuments(),
        ]);

        const totalPages = Math.max(Math.ceil(total / limit), 1);

        res.status(200).json({
            data: notes,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasMore: page < totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({ message: "Internal server error"})
    }
}

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found!"})
        res.json(note);
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({ message: "Internal server error"})
    }
}

export async function createNote(req, res) {
    try {
        const {title,content} = req.body;
        const summary = generateSummary(content || title);
        const tags = suggestTags(`${title} ${content}`);
        const note = new Note ({title: title, content: content, summary, tags});
        const savedNote = await note.save()
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({message:"Internal server error"})
    }
}

export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;
        const summary = content || title ? generateSummary(content || title) : undefined;
        const tags = (title || content) ? suggestTags(`${title ?? ""} ${content ?? ""}`) : undefined;
        const updateNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content, ...(summary !== undefined && { summary }), ...(tags !== undefined && { tags }) },
            {
                new: true,
            }
        );

        if (!updateNote) return res.status(404).json({ message: "Note not found" });
        return res.status(200).json(updateNote);

    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

export async function deleteNote(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id)
        if(!deletedNote) return res.status(404).json({ message : "Note not found"});
        res.status(200).json({ message : "Note deleted successfully"})
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

