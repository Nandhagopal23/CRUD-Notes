import { z } from "zod";

export const createNoteSchema = z.object({
    body: z.object({
        title: z.string().trim().min(1, "Title is required").max(200),
        content: z.string().trim().min(1, "Content is required").max(5000),
    }),
});

export const updateNoteSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z.object({
        title: z.string().trim().min(1, "Title is required").max(200).optional(),
        content: z
            .string()
            .trim()
            .min(1, "Content is required")
            .max(5000)
            .optional(),
    })
    .refine((data) => data.title !== undefined || data.content !== undefined, {
        message: "At least one of title or content must be provided",
        path: ["title"],
    }),
});


