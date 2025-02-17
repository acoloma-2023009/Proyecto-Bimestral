import { Router } from 'express'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { 
    create, 
    get, 
    getAll, 
    remove, 
    update
} from './product.controller.js'
import { productValidator } from '../../helpers/validators.js'

const api = Router()

//Rutas CLIENTE
api.get(
    '/',
    [
        validateJwt
    ],
    getAll
)

//Rutas privadas ADMIN
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
        productValidator
    ],
    create
)

api.put(
    '/:id',
    [
        validateJwt,
        isAdmin,
        productValidator
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