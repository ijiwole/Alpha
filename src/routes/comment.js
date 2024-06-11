import express from "express";
import { protect_user } from "../middlewares/auth.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.js";

const commentRouter = express.Router()
commentRouter.use(protect_user)

commentRouter.route("/add").put(addComment)
commentRouter.route("/update").patch(updateComment)
commentRouter.route("/delete").delete(deleteComment)
commentRouter.route("/").get(getAllComments)

export default commentRouter