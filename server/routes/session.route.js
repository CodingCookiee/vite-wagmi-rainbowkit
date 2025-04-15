/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import express from "express";

import { getSession } from "../controllers/session.controller.js";

const router = express.Router();

router.get("/session", getSession);
