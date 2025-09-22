import type { Request, Response } from "express";

export const respondWithUploadedFiles = (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];

  const makeUrl = (filename: string) => `${req.protocol}://${req.get("host")}/uploads/${filename}`;

  const payload = files.map((f) => ({
    field: f.fieldname,
    filename: f.filename,
    originalName: f.originalname,
    mimeType: f.mimetype,
    size: f.size,
    url: makeUrl(f.filename),
  }));

  res.status(201).json({ success: true, files: payload });
};

