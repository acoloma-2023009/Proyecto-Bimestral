import { Router } from 'express'
import { 
    get, 
    getAll, 
    remove, 
    update
} from './user.controller.js'
import { isAdmin, validateJwt, validateUserOwnership } from '../../middlewares/validate.jwt.js'

const api = Router()

//Rutas privadas
api.get(
    '/', 
    [
        validateJwt,
        isAdmin
    ],
    getAll
)
api.get(
    '/:id', 
    [
        validateJwt,
        isAdmin
    ],
    get
)
api.put(
    '/:id',
    [
        validateJwt,
        validateUserOwnership
    ],
    update
)

api.delete(
    '/:id',
    [
        validateJwt,
        validateUserOwnership
    ],
    remove
)

export default api