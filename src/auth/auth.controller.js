import User from '../user/user.model.js';
import { checkPassword, encrypt } from '../../utils/encrypt.js';
import { generateJwt } from '../../utils/jwt.js';

export const test = (req, res) => {
    console.log('Test is running');
    return res.send({ message: 'Test is running' });
};

export const registerClient = async (req, res) => {
    try {
        let data = req.body;
        let existingUser = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        })
        if (existingUser) return res.status(400).send({ message: 'Email or username already in use' })
        data.password = await encrypt(data.password);
        data.role = 'CLIENT';
        let user = new User(data)
        await user.save()
        return res.status(201).send({
            message: `Client registered successfully. Now you can log in with username: ${user.username}`,
            user: {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error during registration', error: err.message })
    }
}

export const registerAdmin = async (req, res) => {
    try {
        let data = req.body;
        let existingUser = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        });
        if (existingUser) return res.status(400).send({ message: 'Email or username already in use' });
        data.password = await encrypt(data.password);
        if (data.role && ['ADMIN', 'CLIENT'].includes(data.role.toUpperCase())) {
            data.role = data.role.toUpperCase();
        } else {
            data.role = 'CLIENT';
        }
        let user = new User(data);
        await user.save();
        return res.status(201).send({
            message: `User registered successfully. Now you can log in with username: ${user.username}`,
            user: {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error during registration', error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        let { userLoggin, password } = req.body;
        let user = await User.findOne({
            $or: [{ email: userLoggin }, { username: userLoggin }]
        });
        if (!user || !user.status) return res.status(400).send({ message: 'Invalid credentials or inactive user' });
        const isPasswordValid = await checkPassword(password, user.password);
        if (!isPasswordValid) return res.status(400).send({ message: 'Invalid credentials' });
        let loggedUser = {
            uid: user._id,
            name: user.name,
            username: user.username,
            role: user.role
        };
        let token = await generateJwt(loggedUser);
        return res.status(200).send({
            message: `Welcome ${user.name}`,
            loggedUser,
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error during login', error: err.message });
    }
};