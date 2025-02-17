import Category from "./category.model.js"
import Product from "../product/product.model.js"
import { isValidObjectId } from "mongoose"

const getOrCreateDefaultCategory = async () => {
    let defaultCategory = await Category.findOne({ name: "Uncategorized" })
    if (!defaultCategory) {
        defaultCategory = new Category({
            name: "Uncategorized",
            description: "Default category for unassigned products",
            status: true
        })
        await defaultCategory.save()
    }
    return defaultCategory._id;
}

export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0, status } = req.query
        let query = {};
        if (status !== undefined) query.status = status === "true"
        const categories = await Category.find(query)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        if (!categories.length) return res.status(404).send({ message: "No categories found", success: false })
        return res.send({
            success: true,
            message: "Categories found",
            categories,
            total: categories.length
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
}

export const get = async (req, res) => {
    try {
        const { id } = req.params

        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" });

        const category = await Category.findById(id)

        if (!category) return res.status(404).send({ success: false, message: "Category not found" });

        return res.send({ success: true, message: "Category found", category })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error", err })
    }
}

export const create = async (req, res) => {
    try {
        let data = req.body;
        let existingCategory = await Category.findOne({ name: data.name });
        if (existingCategory) return res.status(400).send({ success: false, message: "Category name already exists" })
        let newCategory = new Category(data)
        await newCategory.save()
        return res.status(201).send({
            success: true,
            message: "Category created successfully",
            category: newCategory
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params
        let data = req.body
        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" })
        if (data.name) {
            let existingCategory = await Category.findOne({ name: data.name, _id: { $ne: id } })
            if (existingCategory) return res.status(400).send({ success: false, message: "Category name already in use" })
        }
        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true })
        if (!updatedCategory) return res.status(404).send({ success: false, message: "Category not found" })
        return res.send({ success: true, message: "Category updated successfully", category: updatedCategory })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
}

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).send({ success: false, message: "Invalid ID" })
        const defaultCategoryId = await getOrCreateDefaultCategory()
        await Product.updateMany({ category: id }, { category: defaultCategoryId })
        const deletedCategory = await Category.findByIdAndUpdate(id, { status: false }, { new: true })
        if (!deletedCategory) return res.status(404).send({ success: false, message: "Category not found" })
        return res.send({
            success: true,
            message: "Category deleted successfully and products reassigned",
            category: deletedCategory
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "General error", err })
    }
}
