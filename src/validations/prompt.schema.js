const { z } = require('zod');

const createPromptSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }).min(1, "Title cannot be empty"),
    description: z.string().optional(),
    aiModel: z.enum(['gpt', 'midjourney', 'claude']).optional(),
    priceCategory: z.number().int().min(1).max(5).optional(),
    userId: z.number({
      required_error: "UserId is required",
    }).int().positive(),
  }),
});

const updatePromptSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    aiModel: z.enum(['gpt', 'midjourney', 'claude']).optional(),
    priceCategory: z.number().int().min(1).max(5).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Prompt ID must be a number"),
  }),
});

const queryPromptSchema = z.object({
  query: z.object({
    aiModel: z.enum(['gpt', 'midjourney', 'claude']).optional(),
    priceCategory: z.string().regex(/^[1-5]$/).optional(),
    search: z.string().optional(),
    sort: z.enum(['createdAt', 'priceCategory']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

module.exports = {
  createPromptSchema,
  updatePromptSchema,
  queryPromptSchema,
};
