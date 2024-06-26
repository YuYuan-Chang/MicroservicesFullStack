import express, {Request, Response} from 'express';
import { body } from 'express-validator'
import  jwt  from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/Bad-request-error';

const router = express.Router();

router.get('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min : 4, max : 20})
        .withMessage('Password must be between 4 and 20 characters')

], validateRequest,
async (req: Request, res: Response) => {
    
    const { email, password} = req.body;
    const existingUser = await User.findOne({email});
   
    if (existingUser) {
        console.log("email in use");
        throw new BadRequestError('Email in use')
    }

    const user = User.build({email, password});
    // Save user to database
    await user.save();

    //Generate JWT
    //if (!process.env.JWT_KEY) {
    //    throw new Error('laksjfd');
    //}
    const userJwt = jwt.sign(
        {
            id: user.id,
            email: user.email
        }, 
        process.env.JWT_KEY!
    );

    //Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export {router as signupRouter};