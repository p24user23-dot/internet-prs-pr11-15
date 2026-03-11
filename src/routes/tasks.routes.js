const express = require('express');
const TaskController = require('../controllers/task.controller');
const validate = require('../middlewares/validate');
const { createTaskSchema, updateTaskSchema, queryTaskSchema } = require('../validations/task.schema');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', validate(createTaskSchema), TaskController.createTask);
router.get('/', validate(queryTaskSchema), TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.patch('/:id', validate(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

// Attachments
router.post('/:id/attachments', upload.array('files', 3), TaskController.uploadAttachments);
router.get('/:id/attachments', TaskController.getTaskAttachments);

module.exports = router;
