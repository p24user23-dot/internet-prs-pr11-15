const { Op } = require('sequelize');
const { Task, Attachment } = require('../models');

class TaskService {
  async createTask(data) {
    return Task.create(data);
  }

  async getTasks(query) {
    const { status, priority, search, sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = query;

    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Task.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: Number(limit),
      offset: offset
    });

    return {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
      data: rows
    };
  }

  async getTaskById(id) {
    const task = await Task.findByPk(id, {
      include: [
        { model: Attachment, as: 'attachments' }
      ]
    });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  async updateTask(id, data) {
    const task = await this.getTaskById(id);
    return task.update(data);
  }

  async deleteTask(id) {
    const task = await this.getTaskById(id);
    await task.destroy();
    return { message: 'Task deleted successfully' };
  }
}

module.exports = new TaskService();
