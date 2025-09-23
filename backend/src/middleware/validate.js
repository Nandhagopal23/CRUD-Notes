import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        req.validated = parsed;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        next(error);
    }
};

export default validate;


