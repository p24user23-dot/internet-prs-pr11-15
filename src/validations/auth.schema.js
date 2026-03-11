const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(2, "Name must be more than 2 characters"),
    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email"),
  }),
});

module.exports = {
  registerSchema,
};
