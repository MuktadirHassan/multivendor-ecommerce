import { Tracking } from "@prisma/client";
import { ITrackingRepository } from "../repositories/tracking.repository";
import { NotFoundError, ValidationError } from "../utils/appError";

export interface TrackingUpdateDTO {
  status?: string;
  carrier?: string;
  trackingNo?: string;
  update?: any;
}

export class TrackingService {
  constructor(private readonly trackingRepository: ITrackingRepository) {}

  async findByOrder(orderId: number): Promise<Tracking | null> {
    return this.trackingRepository.findByOrder(orderId);
  }

  async create(orderId: number, data: TrackingUpdateDTO): Promise<Tracking> {
    const existingTracking = await this.trackingRepository.findByOrder(orderId);
    if (existingTracking) {
      throw new ValidationError("Tracking already exists for this order");
    }

    return this.trackingRepository.create({
      orderId,
      carrier: data.carrier || null,
      trackingNo: data.trackingNo || null,
      status: data.status || "Pending",
      updates: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(trackingId: number, data: TrackingUpdateDTO): Promise<Tracking> {
    const tracking = await this.trackingRepository.findById(trackingId);
    if (!tracking) {
      throw new NotFoundError("Tracking not found");
    }

    return this.trackingRepository.update(trackingId, data);
  }

  async updateStatus(trackingId: number, status: string): Promise<Tracking> {
    const tracking = await this.trackingRepository.findById(trackingId);
    if (!tracking) {
      throw new NotFoundError("Tracking not found");
    }

    return this.trackingRepository.updateTrackingStatus(trackingId, status);
  }

  async addUpdate(trackingId: number, update: any): Promise<Tracking> {
    const tracking = await this.trackingRepository.findById(trackingId);
    if (!tracking) {
      throw new NotFoundError("Tracking not found");
    }

    return this.trackingRepository.addTrackingUpdate(trackingId, update);
  }

  async delete(trackingId: number): Promise<boolean> {
    const tracking = await this.trackingRepository.findById(trackingId);
    if (!tracking) {
      throw new NotFoundError("Tracking not found");
    }

    return this.trackingRepository.delete(trackingId);
  }
}
