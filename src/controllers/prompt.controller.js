const PromptService = require('../services/prompt.service');
const { Generation } = require('../models');

class PromptController {
  async createPrompt(req, res, next) {
    try {
      const prompt = await PromptService.createPrompt(req.body);
      res.status(201).json(prompt);
    } catch (error) {
      next(error);
    }
  }

  async getPrompts(req, res, next) {
    try {
      const result = await PromptService.getPrompts(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPromptById(req, res, next) {
    try {
      const prompt = await PromptService.getPromptById(req.params.id);
      res.status(200).json(prompt);
    } catch (error) {
      next(error);
    }
  }

  async updatePrompt(req, res, next) {
    try {
      const prompt = await PromptService.updatePrompt(req.params.id, req.body);
      res.status(200).json(prompt);
    } catch (error) {
      next(error);
    }
  }

  async deletePrompt(req, res, next) {
    try {
      await PromptService.deletePrompt(req.params.id);
      res.status(200).json({ message: 'Prompt deleted' });
    } catch (error) {
      next(error);
    }
  }

  async uploadGenerations(req, res, next) {
    try {
      const promptId = req.params.id;
      
      // Verify prompt exists
      await PromptService.getPromptById(promptId);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
      }

      if (req.files.length > 3) {
        return res.status(400).json({ message: 'Maximum 3 files allowed.' });
      }

      const generations = [];
      for (const file of req.files) {
        const generation = await Generation.create({
          promptId,
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        });
        generations.push(generation);
      }

      res.status(201).json({
        message: 'Generation files uploaded successfully',
        generations
      });
    } catch (error) {
      next(error);
    }
  }

  async getPromptGenerations(req, res, next) {
    try {
      const promptId = req.params.id;
      // Verify prompt exists
      const prompt = await PromptService.getPromptById(promptId);
      
      res.status(200).json(prompt.generations || []);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PromptController();
