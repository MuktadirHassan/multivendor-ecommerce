import { Request, Response } from "express";
import { TrackingService } from "../services/tracking.service";
import catchAsync from "../utils/catchAsync";
import sendApiResponse from "../utils/sendApiResponse";

export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  getTrackingByOrder = catchAsync(async (req: Request, res: Response) => {
    const tracking = await this.trackingService.findByOrder(
      Number(req.params.orderId)
    );
    sendApiResponse(res, 200, "Tracking info retrieved", tracking);
  });

  createTracking = catchAsync(async (req: Request, res: Response) => {
    const tracking = await this.trackingService.create(
      Number(req.params.orderId),
      req.body
    );
    sendApiResponse(res, 201, "Tracking created", tracking);
  });

  updateTracking = catchAsync(async (req: Request, res: Response) => {
    const tracking = await this.trackingService.update(
      Number(req.params.id),
      req.body
    );
    sendApiResponse(res, 200, "Tracking updated", tracking);
  });

  updateStatus = catchAsync(async (req: Request, res: Response) => {
    const tracking = await this.trackingService.updateStatus(
      Number(req.params.id),
      req.body.status
    );
    sendApiResponse(res, 200, "Tracking status updated", tracking);
  });

  addUpdate = catchAsync(async (req: Request, res: Response) => {
    const tracking = await this.trackingService.addUpdate(
      Number(req.params.id),
      req.body.update
    );
    sendApiResponse(res, 200, "Tracking update added", tracking);
  });

  deleteTracking = catchAsync(async (req: Request, res: Response) => {
    await this.trackingService.delete(Number(req.params.id));
    sendApiResponse(res, 200, "Tracking deleted");
  });
}
