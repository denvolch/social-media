import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Требуется ввести Имя' //'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email уже существует', //'Email already exists'
        match: [/.+\@.+\..+/, 'Пожалуйста, укажите действующий адрес электронной почты'], //'Please fill a valid email address'
        required: 'Требуется указать email' //'Email is required'
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: 'Необходимо добавить пароль' //'Password is required'
    },
    salt: String
})
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
    })

UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function() {
        return Math.round(( new Date().valueOf * Math.random() )) + ''
    }
}

UserSchema.path('hashed_password')
    .validate(function(v) {
        if (this._password && this._password < 6) {
            this.invalidate('password', 'Пароль длжен содержать не меньше 6 символов') //Password must be at least 6characters.
        }
        if (this.isNew && !this._password) {
            this.invalidate('password', 'Необходимо добавить пароль' ) //'Password is required'
        }
    }, null)

export default mongoose.model('User', UserSchema)