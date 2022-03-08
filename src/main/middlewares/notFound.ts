import { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({ error: 'Resource not found' })
}