import User from './../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'


const signin = async (req, res) => {
    try {
        let user = await User.findOne({ "email": req.body.email })
        if (!user) res.status('401')
            .json({ error: "Пользователь не найден" }) //'User not found
        
        if ( !user.authenticate(req.body.password) ) {
            return res.status('401')
                .send({ error: "Email и пароль не совпадают" }) //'Email and password don't match
        }

        const token = jwt.sign({ _id: user._id }, config.jwtSecret)

        res.cookie('t', token, { expire: new Date() + 9999 })
        
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        return res.status('401').json("Не удается войти в систему") //'Could not sign in'
    }
}
const signout = (req, res) => {
    res.clearCookie('t')
    return res,status('200').json({ message: "Выход из системы" }) //'Signed out'
}
const requireSignin = ''
const hasAuthorization = (req, res) => {}

export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization,
}