import { Request, Response } from 'express';

import { CowWithBirthAverage } from '../../model';
import cowService from '../../service/service';

export const getCowsWithBirthAverage = async (req: Request, res: Response) => {
  try {
    const cowsWithBirthAverage = await cowService.getCowsWithBirthAverage();
    res.status(200).json(cowsWithBirthAverage);
    return;
  } catch (error) {
    res.status(503).json({ message: 'Database error' });
    return;
  }
};
