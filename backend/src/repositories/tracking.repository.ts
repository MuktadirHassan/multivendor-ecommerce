import { Tracking } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface ITrackingRepository extends BaseRepository<Tracking> {
  findByOrder(orderId: number): Promise<Tracking | null>;
  updateTrackingStatus(trackingId: number, status: string): Promise<Tracking>;
  addTrackingUpdate(trackingId: number, update: any): Promise<Tracking>;
}
