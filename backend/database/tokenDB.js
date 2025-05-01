import Token from '../models/Token.js'

export const findToken = (token) => Token.findOne({ token });

export const deleteToken = (token) => Token.deleteOne({ _id: token._id }); 

export const createToken = (userId, token) => Token.create({
    userId: userId,
    token,
    createdAt: new Date()
});