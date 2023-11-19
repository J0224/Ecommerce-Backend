import {Request, Response,} from "express";

const errorHandler = (err: Error, req:Request, res: Response ) =>{
  const statusCode = res.statusCode ? res.
statusCode: 500
res.status(statusCode)
res.json({
  message: err.message,
  stack: process.env.NODE_ENV === "development"? err.stack : null
})
};

export default errorHandler;