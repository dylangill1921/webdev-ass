"use strict"

import express, {Request, Response} from "express";
import Database from "./database.js";

//Express router
const router = express.Router();

interface Members {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
}