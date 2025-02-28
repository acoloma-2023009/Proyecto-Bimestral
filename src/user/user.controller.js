import User from "./user.model.js"
import { isValidObjectId } from "mongoose"

export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0, role, status } = req.query
        
        let query = {}
        if (role) query.role = role.toUpperCase()
        if (status !== undefined) query.status = status === "true"
        const users = await User.find(query)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        if (users.length === 0) return res.status(404).send({ message: "Users not found", success: false })
        return res.send({
            success: true,
            message: "Users found",
            users,
            total: users.length
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "General error",
            err
        })
    }
}

export const get = async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" })
        const user = await User.findById(id)
        if (!user) return res.status(404).send({ success: false, message: "User not found" });
        return res.send({
            success: true,
            message: "User found",
            user
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "General error",
            err
        })
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        let { password, user, role, ...data } = req.body; 
    
        if (!isValidObjectId(id)) {
            return res.status(400).send({ success: false, message: "Invalid ID" })
        }
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).send({ success: false, message: "User not found" })
        }
        if (userToUpdate.role === "ADMIN") {
            return res.status(403).send({ success: false, message: "Cannot modify an admin user" })
        }
        if (password || user) {
            return res.status(400).send({ success: false, message: "Cannot update password or username" })
        }
        if (role && !["ADMIN", "CLIENT"].includes(role.toUpperCase())) {
            return res.status(400).send({ success: false, message: "Invalid role" })
        }
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
        return res.send({
            success: true,
            message: "User updated successfully",
            updatedUser
        })

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "General error",
            err
        });
    }
};


export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" })
        const deletedUser = await User.findByIdAndUpdate(id, { status: false }, { new: true })
        if (!deletedUser) return res.status(404).send({ success: false, message: "User not found" })
        return res.send({
            success: true,
            message: "User deactivated successfully",
            deletedUser
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: "General error",
            err
        })
    }
}
