import jwt from 'jsonwebtoken'
import Cart from '../src/cart/cart.model.js'

export const validateJwt = async (req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        if (!authorization) 
            return res.status(401).send({ message: 'Unauthorized' })
        let user = jwt.verify(authorization, secretKey)
        const validateUser = await User.findById(user.uid)
        if (!validateUser) 
            return res.status(404).send({
                success: false,
                message: 'User not found - Unauthorized'
            })
        if (!validateUser.status) 
            return res.status(403).send({
                success: false,
                message: 'User account is inactive'
            })
        req.user = validateUser;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send({ message: 'Invalid token or expired' })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const { user } = req
        if (!user || user.role !== 'ADMIN') 
            return res.status(403).send({
                success: false,
                message: `You don't have access | username ${user.username}`
            })
        next()
    } catch (err) {
        console.error(err);
        return res.status(403).send({
            success: false,
            message: 'Unauthorized role'
        })
    }
}

export const validateUserOwnership = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized - User not found'
            })
        }
        if (user.role === 'ADMIN') {
            return next();
        }
        if (user._id.toString() !== id) {
            return res.status(403).send({
                success: false,
                message: 'Forbidden - You can only modify or delete your own account'
            })
        }
        next()
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}



export const isCartOwner = async (req, res, next) => {
    try {
        const { user } = req
        const { id } = req.params
        if (!user) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized action"
            });
        }
        if (!id) {
            req.body.user = user._id.toString()
            return next();
        }
        let cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).send({ success: false, message: "Cart not found" });
        }
        if (cart.user.toString() !== user._id.toString()) {
            return res.status(403).send({
                success: false,
                message: `You can only modify your own cart | username ${user.username}`
            });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({
            success: false,
            message: "Unauthorized action"
        })
    }
}
