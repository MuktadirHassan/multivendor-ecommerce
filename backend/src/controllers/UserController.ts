// controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { UserRepositoryImpl } from "../storage/UserRepositoryImpl";
import { IUser } from "../model/User";

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.json(users);
  }

  async getUserById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const user = await userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  async createUser(req: Request, res: Response) {
    const user: IUser = req.body;
    const newUser = await userService.createUser(user);
    res.status(201).json(newUser);
  }

  async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const userData: IUser = req.body;
    const updatedUser = await userService.updateUser(id, userData);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    await userService.deleteUser(id);
    res.status(204).send();
  }
}
