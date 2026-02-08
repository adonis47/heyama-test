"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_REGEX = exports.ALLOWED_IMAGE_EXTENSIONS = exports.ALLOWED_IMAGE_TYPES = exports.MAX_FILE_SIZE = exports.PASSWORD_MIN_LENGTH = exports.JWT_EXPIRATION = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.API_VERSION = void 0;
exports.API_VERSION = 'v1';
exports.DEFAULT_PAGE_SIZE = 10;
exports.MAX_PAGE_SIZE = 100;
exports.JWT_EXPIRATION = '7d';
exports.PASSWORD_MIN_LENGTH = 8;
exports.MAX_FILE_SIZE = 5 * 1024 * 1024;
exports.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
exports.ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
exports.EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//# sourceMappingURL=index.js.map