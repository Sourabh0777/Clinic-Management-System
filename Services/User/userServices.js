const User = require("../../Models/UserModel");

const createUserService= async (values) => {
    const user = await User.create(values);
    return user
}
module.exports= {createUserService}