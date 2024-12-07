import { Request, Response, NextFunction } from "express";
import { AuthService, AuthTokenPayload } from "../services/auth.service";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export class AuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const payload = this.authService.verifyToken(token);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

  checkRole = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    };
  };
}
