const { z } = require('zod');

const createTaskSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }).min(1, "Title cannot be empty"),
    description: z.string().optional(),
    status: z.enum(['open', 'done']).optional(),
    priority: z.number().int().min(1).max(5).optional(),
    userId: z.number({
      required_error: "UserId is required",
    }).int().positive(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['open', 'done']).optional(),
    priority: z.number().int().min(1).max(5).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Task ID must be a number"),
  }),
});

const queryTaskSchema = z.object({
  query: z.object({
    status: z.enum(['open', 'done']).optional(),
    priority: z.string().regex(/^[1-5]$/).optional(),
    search: z.string().optional(),
    sort: z.enum(['createdAt', 'priority']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  queryTaskSchema,
};
