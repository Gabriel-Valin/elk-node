import apm from 'elastic-apm-node'
import { NextFunction, Request, Response } from 'express'

export const userContext = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  apm.setUserContext({
    id: req.user?.userId,
    username: req.user?.name
  })

  next()
}