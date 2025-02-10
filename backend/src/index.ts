import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import { NODE_ENV, PORT, APP_ORIGIN } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/http";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);

app.use(cookieParser());

app.get("/", (req, res, next) => {
    res.status(OK).json({
        status: "healthy", 
    });
});

app.use(errorHandler);

app.listen(
    PORT,
    async () => {
        console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment.`);
        await connectToDatabase();
    }
);