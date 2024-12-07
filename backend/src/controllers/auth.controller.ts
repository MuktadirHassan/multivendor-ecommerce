import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { Role } from "@prisma/client";
import { RegisterDTO } from "../repositories/auth.repository";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const registerData: RegisterDTO = {
        email,
        password,
        name,
        phone,
        role: role as Role,
      };

      const result = await this.authService.register(registerData);
      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "Email already exists") {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Missing credentials" });
      }

      const result = await this.authService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await this.authService.getCurrentUser(userId);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
