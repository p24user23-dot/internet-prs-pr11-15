const express = require('express');
const PromptController = require('../controllers/prompt.controller');
const validate = require('../middlewares/validate');
const { createPromptSchema, updatePromptSchema, queryPromptSchema } = require('../validations/prompt.schema');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', validate(createPromptSchema), PromptController.createPrompt);
router.get('/', validate(queryPromptSchema), PromptController.getPrompts);
router.get('/:id', PromptController.getPromptById);
router.patch('/:id', validate(updatePromptSchema), PromptController.updatePrompt);
router.delete('/:id', PromptController.deletePrompt);

// Attachments for prompts
router.post('/:id/generations', upload.array('files', 3), PromptController.uploadGenerations);
router.get('/:id/generations', PromptController.getPromptGenerations);

module.exports = router;
