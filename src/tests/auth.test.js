//import mongoose from "mongoose";
import request from 'supertest';
import express from 'express';
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/auth.js'
import { register, login} from '../controllers/auth.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessAndRefreshTokens} from '../service/auth.js'

jest.mock('../models/auth.js');
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../utils/cloudinary.js')
jest.mock('../service/auth.js')

const app = express();
app.use(express.json());
app.use('/auth', express.Router().post('/register', register).post('/login', login));

describe('Auth Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });
})

describe('register', () => {
    it('should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/auth/register').send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.message).toBe('All fields are required')
    });
})
