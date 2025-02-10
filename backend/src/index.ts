import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import { NODE_ENV, PORT, APP_ORIGIN } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";

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

app.get("/", 
    catchErrors(async (req, res, next) => {
        throw new Error("This is an test error");
        res.status(200).json({
            status: "healthy", 
        });
    })
);

app.use(errorHandler);

app.listen(
    4004,
    async () => {
        console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment.`);
        await connectToDatabase();
    }
);