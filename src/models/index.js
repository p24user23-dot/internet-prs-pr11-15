const sequelize = require('../config/database');
const User = require('./User');
const Prompt = require('./Prompt');
const Generation = require('./Generation');

// user 1-N prompts
User.hasMany(Prompt, { foreignKey: 'userId', as: 'prompts', onDelete: 'CASCADE' });
Prompt.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// prompt 1-N generations
Prompt.hasMany(Generation, { foreignKey: 'promptId', as: 'generations', onDelete: 'CASCADE' });
Generation.belongsTo(Prompt, { foreignKey: 'promptId', as: 'prompt' });

module.exports = { sequelize, User, Prompt, Generation };
