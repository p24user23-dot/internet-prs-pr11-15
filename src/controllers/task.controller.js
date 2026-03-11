const TaskService = require('../services/task.service');
const { Attachment, Task } = require('../models');

class TaskController {
  async createTask(req, res, next) {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req, res, next) {
    try {
      const result = await TaskService.getTasks(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
      next(error);
    }
  }

  async uploadAttachments(req, res, next) {
    try {
      const taskId = req.params.id;
      
      // Verify task exists
      await TaskService.getTaskById(taskId);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
      }

      if (req.files.length > 3) {
        return res.status(400).json({ message: 'Maximum 3 files allowed.' });
      }

      const attachments = [];
      for (const file of req.files) {
        const attachment = await Attachment.create({
          taskId,
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        });
        attachments.push(attachment);
      }

      res.status(201).json({
        message: 'Files uploaded successfully',
        attachments
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskAttachments(req, res, next) {
    try {
      const taskId = req.params.id;
      // Verify task exists
      const task = await TaskService.getTaskById(taskId);
      
      res.status(200).json(task.attachments || []);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
