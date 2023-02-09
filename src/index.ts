import app from "./app";
import { userRouter } from "./routes/UserRouteR";

app.use("/users", userRouter)