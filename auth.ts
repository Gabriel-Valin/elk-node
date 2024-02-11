import {Request, Response, NextFunction} from 'express'

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token === "x-autenticate") {
    req.user = { userId: 1, name: "Gregory House", departament: "Diagnostics" };
    next();
  } else {
    res.sendStatus(401);
  }
};
