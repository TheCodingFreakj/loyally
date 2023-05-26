import express from "express";
import dotenv from "dotenv";
import winston from "winston";
import expressWinston from "express-winston";
import responseTime from "response-time";
import cors from "cors";
// import helmet from "helmet";



// import authRoute from "./authRoute";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
// app.use(helmet());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 5, // 5 calls
//   })
// );

app.use(responseTime());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    colorize:true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);
// app.use("/api", productsRoute);

app.get("/", (req: any, res: any) => {
  res.send("GET Request Called");
});

app.get("/products", (req: any, res: any) => {
  res.send("GET All Products");
});

app.listen(6000, () => {
  console.log("server running");
});
