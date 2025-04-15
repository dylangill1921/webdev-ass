import express from 'express';
import { ObjectId } from 'mongodb';
import Database from './database';
import * as memberRoutes from './memberRoutes';

const router = express.Router();

// Your Member interface
interface Member {
    id?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
}

// POST: Register a new member
/*
router.post('/register', async (req, res) => {
    const newMember: Member = req.body;
    try {
        const db = await Database.getInstance().connect();
        const result = await db.collection('members').insertOne(newMember);
        res.status(201).json({ message: 'Member registered', id: result.insertedId });
    } catch (err) {
        console.error('Error registering member:', err);
        res.status(500).json({ error: 'Failed to register member' });
    }
});
*/

// GET: Retrieve all members
/*
router.get('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const members = await db.collection('members').find().toArray();
        res.json(members);
    } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});
*/

// GET: Retrieve a member by ID
/*
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const db = await Database.getInstance().connect();
        const member = await db.collection('members').findOne({ _id: new ObjectId(id) });
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (err) {
        console.error('Error fetching member:', err);
        res.status(500).json({ error: 'Failed to fetch member' });
    }
});
*/

/*
router.post('/register', async (req, res) => {
    const db = await Database.getInstance().connect();
    const members = db.collection('members');

    const existing = await members.findOne({ emailAddress: req.body.email });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    const newMember = {
        firstName: req.body.fullName.split(' ')[0],
        lastName: req.body.fullName.split(' ')[1] || '',
        phoneNumber: req.body.phone,
        emailAddress: req.body.email,
        password: req.body.password
    };

    await members.insertOne(newMember);
    res.status(201).json({ message: 'User registered successfully' });
});
*/

/*
router.post('/login', async (req, res) => {
    const db = await Database.getInstance().connect();
    const members = db.collection('members');

    const user = await members.findOne({ emailAddress: req.body.username, password: req.body.password });

    if (!user) return res.status(401).json({ message: 'Invalid login' });

    res.json({
        username: user.emailAddress,
        fullName: `${user.firstName} ${user.lastName}`
    });
});
*/

export default router;