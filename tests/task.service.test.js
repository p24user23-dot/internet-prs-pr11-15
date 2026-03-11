const TaskService = require('../src/services/task.service');
const { sequelize, User, Task } = require('../src/models');

beforeAll(async () => {
  // Sync the tables to SQLite in-memory db
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('TaskService Unit Tests', () => {
  let userId;

  beforeEach(async () => {
    await Task.destroy({ where: {} });
    await User.destroy({ where: {} });

    const user = await User.create({ name: 'Test User', email: 'test@example.com' });
    userId = user.id;
  });

  test('should create a task successfully', async () => {
    const taskData = {
      title: 'New Task',
      description: 'Test description',
      userId: userId,
      priority: 3
    };

    const task = await TaskService.createTask(taskData);

    expect(task.title).toBe('New Task');
    expect(task.description).toBe('Test description');
    expect(task.userId).toBe(userId);
    expect(task.status).toBe('open'); // default
    expect(task.priority).toBe(3);
  });

  test('should retrieve tasks with filters and pagination', async () => {
    await TaskService.createTask({ title: 'Task 1', status: 'open', priority: 1, userId });
    await TaskService.createTask({ title: 'Task 2', status: 'done', priority: 5, userId });
    await TaskService.createTask({ title: 'Searchable Task', status: 'open', priority: 2, userId });

    // Test Pagination
    let result = await TaskService.getTasks({ page: 1, limit: 2 });
    expect(result.data.length).toBe(2);
    expect(result.total).toBe(3);

    // Test Status Filter
    result = await TaskService.getTasks({ status: 'done' });
    expect(result.data.length).toBe(1);
    expect(result.data[0].title).toBe('Task 2');

    // Test Priority Filter
    result = await TaskService.getTasks({ priority: '5' });
    expect(result.data.length).toBe(1);
    expect(result.data[0].priority).toBe(5);

    // Test Search Filter (by title)
    result = await TaskService.getTasks({ search: 'Searchable', sort: 'priority', order: 'asc' });
    expect(result.data.length).toBe(1);
    expect(result.data[0].title).toBe('Searchable Task');
  });

  test('should retrieve a task by ID', async () => {
    const createdTask = await TaskService.createTask({ title: 'Task by ID', userId });

    const task = await TaskService.getTaskById(createdTask.id);
    expect(task).toBeDefined();
    expect(task.id).toBe(createdTask.id);
  });

  test('should throw 404 if task not found', async () => {
    await expect(TaskService.getTaskById(999)).rejects.toThrow('Task not found');
  });

  test('should update a task', async () => {
    const createdTask = await TaskService.createTask({ title: 'Old Title', status: 'open', userId });

    const updatedTask = await TaskService.updateTask(createdTask.id, { title: 'New Title', status: 'done' });
    expect(updatedTask.title).toBe('New Title');
    expect(updatedTask.status).toBe('done');
  });
});
