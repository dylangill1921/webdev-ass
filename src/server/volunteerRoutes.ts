"use strict"

import express, {Request, Response} from "express";
import Database from "./database.js";

//Express router
const router = express.Router();

interface Volunteer {
    id: string;
    fullName: string;
    emailAddress: string;
}