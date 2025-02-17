import { body } from "express-validator";
import { validateError } from "./validate.error.js";
import { existUsername, existEmail, existCategory, existProductName } from "./db.validators.js";

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty().trim(),
    body('surname', 'Surname cannot be empty').notEmpty().trim(),
    body('email', 'Email cannot be empty or is not valid')
        .notEmpty()
        .isEmail()
        .custom(existEmail)
        .normalizeEmail(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .isLength({ max: 15 })
        .custom(existUsername)
        .trim()
        .toLowerCase(),
    body('password', 'Password must be at least 8 characters and strong')
        .notEmpty()
        .isLength({ min: 8 })
        .isStrongPassword()
        .withMessage('Password must conta1in at least one uppercase letter, one lowercase letter, one number, and one symbol'),
    body('phone', 'Phone cannot be empty or is not valid')
        .notEmpty(),
    body('role', 'Invalid role')
        .optional()
        .isIn(['ADMIN', 'CLIENT'])
        .withMessage('Role must be either ADMIN or CLIENT'),
    validateError
];

export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .trim(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isLength({ min: 8 }),
    validateError
];

export const productValidator = [
    body('name', 'Product name cannot be empty')
        .notEmpty()
        .trim()
        .custom(existProductName)
        .isLength({ max: 100 })
        .withMessage('Product name cannot exceed 100 characters'),
    body('description', 'Description cannot exceed 300 characters')
        .optional()
        .trim()
        .isLength({ max: 300 }),
    body('price', 'Price must be a positive number')
        .notEmpty()
        .isFloat({ gt: 0 }),
    body('stock', 'Stock must be a non-negative integer')
        .notEmpty()
        .isInt({ min: 0 }),
    body('category', 'Category ID is required and must be valid')
        .notEmpty()
        .custom(existCategory),
    /*body('image', 'Invalid image URL format')
        .optional()
        .trim()
        .matches(/^(https?:\/\/|\/)?([\w\-./]+)\.(?:png|jpg|jpeg|gif|svg)$/i),*/
    body('bestSeller', 'BestSeller must be a boolean value')
        .optional()
        .isBoolean(),
    body('status', 'Status must be a boolean value')
        .optional()
        .isBoolean(),
    validateError
];

export const categoryValidator = [
    body('name', 'Category name cannot be empty')
        .notEmpty()
        .trim()
        .custom(existCategory)
        .isLength({ max: 50 })
        .withMessage('Category name cannot exceed 50 characters'),
    body('description', 'Description cannot exceed 200 characters')
        .optional()
        .trim()
        .isLength({ max: 200 }),
    body('status', 'Status must be a boolean value')
        .optional()
        .isBoolean(),
    validateError
];
