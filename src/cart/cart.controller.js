import Cart from "./cart.model.js"
import Product from "../product/product.model.js"

export const createCart = async (req, res) => {
    try {
        const existingCart = await Cart.findOne({ user: req.user._id });
        if (existingCart) {
            return res.status(400).send({ success: false, message: "Cart already exists" })
        }
        const { products } = req.body
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).send({ success: false, message: "Invalid products data" });
        }
        for (const item of products) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(404).send({ success: false, message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).send({ 
                    success: false, 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
                })
            }
        }

        const newCart = new Cart({
            user: req.user._id,
            products
        });

        await newCart.save()
        return res.status(201).send({
            success: true,
            message: "Cart created successfully",
            cart: newCart
        });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}

export const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).send({ success: false, message: "Cart not found" })
        }
        const { products } = req.body;
        if (!Array.isArray(products)) {
            return res.status(400).send({ success: false, message: "Invalid products format" })
        }
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).send({ success: false, message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).send({ 
                    success: false, 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
                })
            }
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === item.product)
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += item.quantity
            } else {
                cart.products.push(item);
            }
        }
        await cart.save();
        return res.send({ success: true, message: "Cart updated successfully", cart })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("products.product", "name price stock");
        if (!cart) {
            return res.status(404).send({ success: false, message: "Cart not found" });
        }
        return res.send({ success: true, message: "Cart retrieved successfully", cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).send({ success: false, message: "Cart not found" })
        }
        const { productId } = req.body
        if (!productId) {
            return res.status(400).send({ success: false, message: "Product ID is required" })
        }
        cart.products = cart.products.filter(item => item.product.toString() !== productId)
        await cart.save()
        return res.send({ success: true, message: "Product removed from cart successfully", cart })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}

export const clearCart = async (req, res) => {
    try {
        const { cartId } = req.params
        if (!cartId) {
            return res.status(400).send({ success: false, message: "Cart ID is required" })
        }
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).send({ success: false, message: "Cart not found" })
        }
        cart.products = [];
        await cart.save();

        return res.send({ success: true, message: "Cart has been cleared successfully", cart })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
}

export const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate("user", "username email").populate("products.product", "name price stock");
        return res.send({ success: true, message: "Carts retrieved successfully", carts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
};