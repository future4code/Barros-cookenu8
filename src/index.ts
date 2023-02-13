import app from "./app";
import { recipeRouter } from "./routes/RecipeRouter";
import { userRouter } from "./routes/UserRouter";

app.use("/users", userRouter)
app.use("/recipes", recipeRouter)