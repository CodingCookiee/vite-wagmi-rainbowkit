/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import express from "express";

import { verifyMessage } from "../controllers/verify.controller.js";

const router = express.Router();

router.post("/verify", verifyMessage);
