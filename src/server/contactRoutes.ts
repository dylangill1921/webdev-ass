import express, { Request, Response } from 'express';
// import Database from './database.js'; // Uncomment when needed

const router = express.Router();

// Define Contact interface
interface Contact {
    id: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    message: string;
}

// Basic route for testing
router.get('/', (req: Request, res: Response) => {
    res.send('Contact routes');
});

export default router;