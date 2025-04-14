"use strict"

import express, {Request, Response} from "express";
import Database from "./database.js";

//Express router
const router = express.Router();

interface Event {
    id: string;
    name: string;
    date: Date;
    location: string;
    decription: string;
}