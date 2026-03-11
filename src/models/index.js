const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const Attachment = require('./Attachment');

// user 1-N tasks
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// task 1-N attachments
Task.hasMany(Attachment, { foreignKey: 'taskId', as: 'attachments', onDelete: 'CASCADE' });
Attachment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

module.exports = {
  sequelize,
  User,
  Task,
  Attachment
};
