import { Request, Response } from "express";

// Get example data
export const getExample = (req: Request, res: Response): void => {
  res.status(200).json({
    message: "Example response",
    data: {
      id: 1,
      name: "Example",
      description: "This is an example response",
    },
  });
};
