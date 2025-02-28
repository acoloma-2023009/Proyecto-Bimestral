import { Router } from "express";
import {
    createCart,
    getCart,
    updateCart,
    getAllCarts,
    deleteCartItem,
    clearCart
} from "./cart.controller.js";
import { isAdmin, isCartOwner, validateJwt } from "../../middlewares/validate.jwt.js"
import { cartValidator } from "../../helpers/validators.js"

const router = Router();

router.post("/", 
    [
        validateJwt,
        cartValidator,
        isCartOwner
    ], 
    createCart
);

router.get("/", 
    [
        validateJwt, 
        isCartOwner
    ], 
    getCart
);

router.put("/", 
    [
        validateJwt,
        cartValidator,
        isCartOwner
    ], 
    updateCart
);

router.delete("/", 
    [
        validateJwt,
        isCartOwner
    ], 
    deleteCartItem
);
router.delete("/clear/:cartId", 
    [
        validateJwt,
        isCartOwner
    ], 
    clearCart
);
router.get("/all", 
    [
        validateJwt,
        isAdmin
    ], 
    getAllCarts
);

export default router;