const { Op } = require('sequelize');
const { Prompt, Generation } = require('../models');

class PromptService {
  async createPrompt(data) {
    return Prompt.create(data);
  }

  async getPrompts(query) {
    const { aiModel, priceCategory, search, sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = query;
    const whereClause = {};
    if (aiModel) whereClause.aiModel = aiModel;
    if (priceCategory) whereClause.priceCategory = priceCategory;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Prompt.findAndCountAll({
      where: whereClause, order: [[sort, order.toUpperCase()]], limit: Number(limit), offset
    });
    return {
      total: count, page: Number(page), limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)), data: rows
    };
  }

  async getPromptById(id) {
    const prompt = await Prompt.findByPk(id, {
      include: [
        { model: Generation, as: 'generations' }
      ]
    });

    if (!prompt) {
      const error = new Error('Prompt not found');
      error.statusCode = 404;
      throw error;
    }

    return prompt;
  }

  async updatePrompt(id, data) {
    const prompt = await this.getPromptById(id);
    return prompt.update(data);
  }

  async deletePrompt(id) {
    const prompt = await this.getPromptById(id);
    await prompt.destroy();
    return { message: 'Prompt deleted successfully' };
  }
}

module.exports = new PromptService();
