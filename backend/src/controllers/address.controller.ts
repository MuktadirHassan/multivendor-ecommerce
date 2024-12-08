import { Request, Response } from "express";
import { AddressService } from "../services/address.service";
import catchAsync from "../utils/catchAsync";
import sendApiResponse from "../utils/sendApiResponse";
import { ValidationError } from "../utils/appError";

export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  getAllAddresses = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const addresses = await this.addressService.getAllAddresses(userId);
    sendApiResponse(res, 200, "Addresses retrieved successfully", addresses);
  });

  getAddressById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    const address = await this.addressService.getAddressById(
      parseInt(id),
      userId
    );
    sendApiResponse(res, 200, "Address retrieved successfully", address);
  });

  createAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const addressData = { ...req.body, userId };
    const address = await this.addressService.createAddress(addressData);
    sendApiResponse(res, 201, "Address created successfully", address);
  });

  updateAddress = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    const address = await this.addressService.updateAddress(
      parseInt(id),
      req.body,
      userId
    );
    sendApiResponse(res, 200, "Address updated successfully", address);
  });

  deleteAddress = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    await this.addressService.deleteAddress(parseInt(id), userId);
    sendApiResponse(res, 200, "Address deleted successfully");
  });

  setDefaultAddress = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    const address = await this.addressService.setDefaultAddress(
      userId,
      parseInt(id)
    );
    sendApiResponse(res, 200, "Default address set successfully", address);
  });

  getDefaultAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const address = await this.addressService.getDefaultAddress(userId);
    if (!address) {
      throw new ValidationError("No default address found");
    }
    sendApiResponse(
      res,
      200,
      "Default address retrieved successfully",
      address
    );
  });
}
