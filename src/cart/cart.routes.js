import { Router } from "express";
import {
    createCart,
    getCart,
    updateCart,
    deleteCart,
    getAllCarts
} from "./cart.controller.js";
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js";
import { isCartOwner } from "../../middlewares/validate.jwt.js";
import { cartValidator } from "../../helpers/validators.js";

const api = Router();

api.post("/", 
    [
        validateJwt, 
        isCartOwner,
        cartValidator
    ], 
    createCart
)

api.get("/", 
    [
        validateJwt, 
        isCartOwner
    ], 
    getCart
)

api.put("/", 
    [
        validateJwt,
        isCartOwner,
        cartValidator
    ], 
    updateCart
)

api.delete("/", 
    [
        validateJwt,
        isCartOwner
    ], 
    deleteCart
)

api.get("/all", 
    [
        validateJwt,
        isAdmin
    ], 
    getAllCarts
    )

export default api;