import { ErrorRequestHandler } from "express";

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);
    res.status(500).send("Internal Server Error");
}

export default errorHandler;