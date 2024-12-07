import multer from "multer";
import { ValidationError } from "../utils/appError";
import { NextFunction } from "express";

// Configure storage in memory since we'll be uploading to Supabase
const storage = multer.memoryStorage();

// File filter function to validate image types
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new ValidationError("Only image files are allowed"));
    return;
  }

  // Accept only specific image types
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(
      new ValidationError("Invalid image type. Allowed types: JPEG, PNG, WebP")
    );
    return;
  }

  cb(null, true);
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 5, // Max number of files
  },
});

// Error handler for multer size limit
export const handleMulterError = (
  err: any,
  req: Express.Request,
  res: Express.Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new ValidationError("File size too large. Maximum size is 5MB")
      );
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(new ValidationError("Too many files. Maximum is 5 files"));
    }
  }
  next(err);
};
