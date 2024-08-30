import crypto from 'node:crypto';
import multer from 'multer';
import { resolve } from 'node:path';
import { Request, Response, NextFunction } from 'express';


export function upload(destination: string) {
  return multer({
    storage: multer.diskStorage({
      destination: resolve(__dirname, "..", destination),
      filename: (req, file, cb) => {
        const fileHash = crypto.randomBytes(16).toString('hex');
        const filename = `${fileHash}-${file.originalname}`;

        cb(null, filename);
      },
    }),
  }).single('file'); // 'arquivo' é o nome do campo no formulário que contém o arquivo
}