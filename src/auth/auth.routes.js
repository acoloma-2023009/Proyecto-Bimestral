import { Router } from 'express'
import { 
    login,
    registerAdmin,
    registerClient,
    test
 } from './auth.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidator, registerValidator } from '../../helpers/validators.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.error.js'

const api = Router()

//Rutas públicas
api.post(
    '/registerAdmin', 
    [
        registerValidator,
        validateJwt,
        isAdmin,
        deleteFileOnError
    ], 
    registerAdmin
)

api.post(
    '/register', 
    [
        registerValidator,
        deleteFileOnError
    ], 
    registerClient
)
api.post(
    '/login', 
    [
        loginValidator
    ], 
    login
)

//Rutas privadas
api.get('/test', validateJwt, test)


export default api