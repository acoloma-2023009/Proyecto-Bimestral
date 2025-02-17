import { Router } from 'express'
import { 
    login,
    register,
    test
 } from './auth.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidator, registerValidator } from '../../helpers/validators.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.error.js'

const api = Router()

//Rutas públicas
api.post(
    '/register', 
    [
        registerValidator,
        deleteFileOnError
    ], 
    register
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