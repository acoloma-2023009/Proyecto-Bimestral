import Product from "./product.model.js"
import Category from "../category/category.model.js"
import { isValidObjectId } from "mongoose"

export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0, category, bestSeller, status } = req.query
        let query = {}
        if (category && isValidObjectId(category)) query.category = category
        if (bestSeller !== undefined) query.bestSeller = bestSeller === "true"
        if (status !== undefined) query.status = status === "true"
        const products = await Product.find(query)
            .populate("category", "name")
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        if (!products.length) return res.status(404).send({ message: "No products found", success: false })
        return res.send({
            success: true,
            message: "Products found",
            products,
            total: products.length
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
}

export const get = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" })
        const product = await Product.findById(id).populate("category", "name")
        if (!product) return res.status(404).send({ success: false, message: "Product not found" })
        return res.send({ success: true, message: "Product found", product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
}

export const create = async (req, res) => {
    try {
        let data = req.body;
        let existingProduct = await Product.findOne({ name: data.name })
        if (existingProduct) return res.status(400).send({ success: false, message: "Product name already exists" })
        if (!isValidObjectId(data.category) || !(await Category.findById(data.category))) {
            return res.status(400).send({ success: false, message: "Invalid category" })
        }
        if (data.price <= 0) return res.status(400).send({ success: false, message: "Price must be greater than 0" })
        if (data.stock < 0) return res.status(400).send({ success: false, message: "Stock cannot be negative" })
        let newProduct = new Product(data)
        await newProduct.save()
        return res.status(201).send({
            success: true,
            message: "Product created successfully",
            product: newProduct
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error", err })
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params
        let data = req.body
        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" })
        if (data.name) {
            let existingProduct = await Product.findOne({ name: data.name, _id: { $ne: id } })
            if (existingProduct) return res.status(400).send({ success: false, message: "Product name already in use" })
        }
        if (data.category && (!isValidObjectId(data.category) || !(await Category.findById(data.category)))) {
            return res.status(400).send({ success: false, message: "Invalid category" })
        }
        if (data.price !== undefined && data.price <= 0) {
            return res.status(400).send({ success: false, message: "Price must be greater than 0" })
        }
        if (data.stock !== undefined && data.stock < 0) {
            return res.status(400).send({ success: false, message: "Stock cannot be negative" })
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
        if (!updatedProduct) return res.status(404).send({ success: false, message: "Product not found" })
        return res.send({ success: true, message: "Product updated successfully", product: updatedProduct })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" })
        const deletedProduct = await Product.findByIdAndUpdate(id, { status: false }, { new: true })
        if (!deletedProduct) return res.status(404).send({ success: false, message: "Product not found" })
        return res.send({ success: true, message: "Product deactivated successfully", product: deletedProduct })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
};
