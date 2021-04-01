import express from 'express'
import authCltr from './../controllers/auth.controller'

const router = express.Router()

router.route('/auth/signin')
    .post(authCltr.signin)
router.route('/auth/signout')
    .get(authCltr.signout)

export default router