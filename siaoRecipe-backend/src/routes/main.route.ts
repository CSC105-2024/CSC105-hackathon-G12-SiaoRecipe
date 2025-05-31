import { Hono } from "hono";

import userRoute from "./user.route.js";
import recipeRoute from "./recipe.route.js";
import likeRoute from "./like.route.js";
import { commentRoute } from "./comment.route.js";


const mainRouter = new Hono();

mainRouter.route("/users", userRoute);
mainRouter.route("/recipes", recipeRoute);
mainRouter.route("/likes", likeRoute);
mainRouter.route("/comments", commentRoute );

export default mainRouter;
