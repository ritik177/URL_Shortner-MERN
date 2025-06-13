const Joi = require('joi');

const urlSchema = Joi.object({
  originalUrl: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Please provide a valid URL',
      'any.required': 'URL is required'
    }),
  customCode: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .allow('')  // Allow empty string
    .messages({
      'string.pattern.base': 'Custom code can only contain letters, numbers, hyphens, and underscores',
      'string.min': 'Custom code must be at least 3 characters long',
      'string.max': 'Custom code cannot exceed 20 characters'
    }),
  tags: Joi.array()
    .items(Joi.string().min(2).max(20))
    .max(5)
    .default([])
    .messages({
      'array.max': 'Maximum 5 tags allowed',
      'string.min': 'Tag must be at least 2 characters long',
      'string.max': 'Tag cannot exceed 20 characters'
    }),
  expiryHours: Joi.number()
    .min(1)
    .max(8760) // 1 year
    .allow('')  // Allow empty string
    .messages({
      'number.min': 'Expiry time must be at least 1 hour',
      'number.max': 'Expiry time cannot exceed 1 year'
    })
});

const validateUrl = (req, res, next) => {
  // Convert empty strings to null for optional fields
  const data = {
    ...req.body,
    customCode: req.body.customCode || undefined,
    expiryHours: req.body.expiryHours ? Number(req.body.expiryHours) : undefined
  };

  const { error } = urlSchema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  // Update request body with validated data
  req.body = data;
  next();
};

module.exports = {
  validateUrl
}; 