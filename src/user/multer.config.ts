import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/profiles',
    filename: (req, file, callback) => {
      const fileExtName = extname(file.originalname);
      const randomName = uuidv4();
      callback(null, `${randomName}${fileExtName}`);
    },
  }),
};
