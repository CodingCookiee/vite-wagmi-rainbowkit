/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import express from "express";

import { generateNonce } from "../controllers/nonce.controller.js";

const router = express.Router();

// Route to generate a nonce
router.get("/generate", generateNonce);

export { router };
