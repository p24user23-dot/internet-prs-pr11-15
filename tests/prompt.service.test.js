const PromptService = require('../src/services/prompt.service');
const { sequelize, User, Prompt } = require('../src/models');

beforeAll(async () => {
  // Sync the tables to SQLite in-memory db
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('PromptService Unit Tests', () => {
  let userId;

  beforeEach(async () => {
    await Prompt.destroy({ where: {} });
    await User.destroy({ where: {} });

    const user = await User.create({ name: 'Test Creator', email: 'creator@example.com' });
    userId = user.id;
  });

  test('should create a prompt successfully', async () => {
    const promptData = {
      title: 'Awesome SEO Prompt',
      description: 'Generates great meta descriptions',
      userId: userId,
      aiModel: 'claude',
      priceCategory: 3
    };

    const prompt = await PromptService.createPrompt(promptData);

    expect(prompt.title).toBe('Awesome SEO Prompt');
    expect(prompt.description).toBe('Generates great meta descriptions');
    expect(prompt.userId).toBe(userId);
    expect(prompt.aiModel).toBe('claude');
    expect(prompt.priceCategory).toBe(3);
  });

  test('should retrieve prompts with filters and pagination', async () => {
    await PromptService.createPrompt({ title: 'Prompt GPT 1', aiModel: 'gpt', priceCategory: 1, userId });
    await PromptService.createPrompt({ title: 'Midjourney Art', aiModel: 'midjourney', priceCategory: 5, userId });
    await PromptService.createPrompt({ title: 'Searchable Copywriting', aiModel: 'gpt', priceCategory: 2, userId });

    // Test Pagination
    let result = await PromptService.getPrompts({ page: 1, limit: 2 });
    expect(result.data.length).toBe(2);
    expect(result.total).toBe(3);

    // Test AI Model Filter
    result = await PromptService.getPrompts({ aiModel: 'midjourney' });
    expect(result.data.length).toBe(1);
    expect(result.data[0].title).toBe('Midjourney Art');

    // Test Price Category Filter
    result = await PromptService.getPrompts({ priceCategory: '5' });
    expect(result.data.length).toBe(1);
    expect(result.data[0].priceCategory).toBe(5);

    // Test Search Filter (by title)
    result = await PromptService.getPrompts({ search: 'Copywriting', sort: 'priceCategory', order: 'asc' });
    expect(result.data.length).toBe(1);
    expect(result.data[0].title).toBe('Searchable Copywriting');
  });

  test('should retrieve a prompt by ID', async () => {
    const createdPrompt = await PromptService.createPrompt({ title: 'Prompt by ID', userId });

    const prompt = await PromptService.getPromptById(createdPrompt.id);
    expect(prompt).toBeDefined();
    expect(prompt.id).toBe(createdPrompt.id);
  });

  test('should throw 404 if prompt not found', async () => {
    await expect(PromptService.getPromptById(999)).rejects.toThrow('Prompt not found');
  });

  test('should update a prompt', async () => {
    const createdPrompt = await PromptService.createPrompt({ title: 'Old Title', aiModel: 'gpt', userId });

    const updatedPrompt = await PromptService.updatePrompt(createdPrompt.id, { title: 'New Title', aiModel: 'claude' });
    expect(updatedPrompt.title).toBe('New Title');
    expect(updatedPrompt.aiModel).toBe('claude');
  });
});
