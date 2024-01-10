import multer, { Multer, StorageEngine } from "multer";
import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "Store-Photos");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix =  Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop() || ''; // Handle the case where the extension is missing
    const uniqueFilename = `${uuidv4()}-${uniqueSuffix}.${fileExtension}`;
    cb(null, uniqueFilename);
  }
});

function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ storage, fileFilter });


// File size formatter
const fileSizeFormatter = (bytes: number, decimal: number) => {
  if(bytes === 0){
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", 
  "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " "
    + sizes[index]
  );
};


export { upload, fileSizeFormatter };
