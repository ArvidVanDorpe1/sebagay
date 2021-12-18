import express from "express";
import userService from "../service/users.js";

const router = express.Router();

router.put("/:id", userService.updateUserById);
router.delete("/:id", userService.deleteUserById);
router.get("/:id", userService.getUserById);
router.put("/:id/follow", userService.volgUserById);
router.put("/:id/unfollow", userService.ontvolgUserById);
router.get("/friends/:userId", userService.getAlleVrienden);

export default router;
