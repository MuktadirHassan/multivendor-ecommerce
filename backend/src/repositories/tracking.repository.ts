import { PrismaClient, Tracking, Prisma } from "@prisma/client";
import { BaseRepository } from "../types/repository";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../utils/appError";

export interface ITrackingRepository extends BaseRepository<Tracking> {
  findByOrder(orderId: number): Promise<Tracking | null>;
  updateTrackingStatus(trackingId: number, status: string): Promise<Tracking>;
  addTrackingUpdate(
    trackingId: number,
    update: Prisma.JsonValue
  ): Promise<Tracking>;
}

export class TrackingRepository implements ITrackingRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Tracking | null> {
    try {
      return await this.prisma.tracking.findUnique({
        where: { id },
        include: {
          order: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(): Promise<Tracking[]> {
    try {
      return await this.prisma.tracking.findMany({
        include: {
          order: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Omit<Tracking, "id">): Promise<Tracking> {
    try {
      const { updates, ...trackingData } = data;
      return await this.prisma.tracking.create({
        data: {
          ...trackingData,
          updates: updates as Prisma.InputJsonValue[],
        },
        include: {
          order: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, data: Partial<Tracking>): Promise<Tracking> {
    try {
      const tracking = await this.findById(id);
      if (!tracking) {
        throw new NotFoundError("Tracking not found");
      }

      const { updates, ...updateData } = data;
      return await this.prisma.tracking.update({
        where: { id },
        data: {
          ...updateData,
          ...(updates && { updates: updates as Prisma.InputJsonValue[] }),
        },
        include: {
          order: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.tracking.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundError("Tracking not found");
      }
      throw this.handleError(error);
    }
  }

  async findByOrder(orderId: number): Promise<Tracking | null> {
    try {
      return await this.prisma.tracking.findUnique({
        where: { orderId },
        include: {
          order: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTrackingStatus(
    trackingId: number,
    status: string
  ): Promise<Tracking> {
    try {
      const tracking = await this.findById(trackingId);
      if (!tracking) {
        throw new NotFoundError("Tracking not found");
      }

      return await this.prisma.tracking.update({
        where: { id: trackingId },
        data: { status },
        include: {
          order: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addTrackingUpdate(
    trackingId: number,
    update: Prisma.JsonValue
  ): Promise<Tracking> {
    try {
      const tracking = await this.findById(trackingId);
      if (!tracking) {
        throw new NotFoundError("Tracking not found");
      }

      return await this.prisma.tracking.update({
        where: { id: trackingId },
        data: {
          updates: {
            push: update as Prisma.InputJsonValue,
          },
        },
        include: {
          order: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ValidationError("Unique constraint violation");
        case "P2014":
          throw new ValidationError("Invalid ID");
        case "P2025":
          throw new NotFoundError("Record not found");
        default:
          throw new DatabaseError(`Database error: ${error.message}`);
      }
    }

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    throw new DatabaseError("Internal server error");
  }
}
