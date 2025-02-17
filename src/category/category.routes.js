import { Router } from "express"
import { 
    create, 
    get, 
    getAll, 
    remove, 
    update 
} from "./category.controller.js"
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { categoryValidator } from "../../helpers/validators.js"

const api = Router()

//Rutas CLIENTE
api.get(
    '/',
    [
        validateJwt
    ],
    getAll
)

//Rutas ADMIN
api.get(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    get
)

api.post(
    '/',
    [
        validateJwt,
        isAdmin,
        categoryValidator
    ],
    create
)

api.put(
    '/:id',
    [
        validateJwt,
        isAdmin,
        categoryValidator
    ],
    update
)

api.delete(
    '/:id',
    [
        validateJwt,
        isAdmin
    ],
    remove
)

export default api