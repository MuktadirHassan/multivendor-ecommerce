import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request | Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
export default catchAsync;
