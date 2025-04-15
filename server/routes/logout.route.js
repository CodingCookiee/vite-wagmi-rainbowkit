/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import express from "express";

import { logoutUser } from "../controllers/logout.controller.js";

const router = express.Router();

router.post("/logout", logoutUser);
