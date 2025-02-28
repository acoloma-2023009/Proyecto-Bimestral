import { Router } from "express";
import {
    createBill,
    getBill,
    deleteBill,
    getAllBills
} from "./bill.controller.js";
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js";
import { billValidator } from "../../helpers/validators.js";

const api = Router();

api.post("/", [validateJwt, isAdmin, billValidator], createBill);

api.get("/:id", [validateJwt, isAdmin], getBill);

api.delete("/:id", [validateJwt, isAdmin], deleteBill);

api.get("/all", [validateJwt, isAdmin], getAllBills);

export default api;