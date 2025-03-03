import Bill from "./bill.model.js"
import Cart from "../cart/cart.model.js"
import Product from "../product/product.model.js"

export const createBill = async (req, res) => {
    try {
        const { cartId, discount = 0 } = req.body;
        const cart = await Cart.findById(cartId).populate("products.product")
        if (!cart) {
            return res.status(404).send({ success: false, message: "Cart not found" });
        }
        const existingBill = await Bill.findOne({ cart: cartId })
        if (existingBill) {
            return res.status(400).send({ success: false, message: "Bill already exists for this cart" })
        }
        let subtotal = 0
        const products = []
        for (const item of cart.products) {
            const product = await Product.findById(item.product._id)
            if (!product) {
                return res.status(404).send({ success: false, message: `Product not found: ${item.product._id}` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).send({ 
                    success: false, 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
                })
            }
            product.stock -= item.quantity
            await product.save()
            subtotal += item.quantity * product.price
            products.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            })
        }
        const total = subtotal - discount
        if (total < 0) {
            return res.status(400).send({ success: false, message: "Discount cannot exceed subtotal" })
        }
        const newBill = new Bill({
            cart: cart._id,
            user: cart.user,
            products,
            subtotal,
            discount,
            total
        })
        await newBill.save();
        return res.status(201).send({ success: true, message: "Bill created successfully", bill: newBill })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}

export const getBill = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findById(id).populate("user", "username email").populate("products.product", "name price")
        if (!bill) {
            return res.status(404).send({ success: false, message: "Bill not found" })
        }
        return res.send({ success: true, message: "Bill retrieved successfully", bill })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}

export const deleteBill = async (req, res) => {
    try {
        const { id } = req.params
        const bill = await Bill.findByIdAndDelete(id)
        if (!bill) {
            return res.status(404).send({ success: false, message: "Bill not found" })
        }
        return res.send({ success: true, message: "Bill deleted successfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}

export const getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().populate("user", "username email").populate("products.product", "name price");
        return res.send({ success: true, message: "Bills retrieved successfully", bills })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}
