import { NextFunction, Request, Response } from "express";

export const error = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error) {
    console.error(error.stack)
    res.status(500).send({ error: 'Internal error' })
  } else {
    next()
  }
}