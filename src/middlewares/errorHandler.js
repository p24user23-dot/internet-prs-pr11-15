const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Database Validation Error',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }

  // Multer error
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ message: 'Too many files uploaded (max 3 allowed)' });
  }

  // Custom Not Found Error
  if (err.statusCode === 404) {
    return res.status(404).json({ message: err.message });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
