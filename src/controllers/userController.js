const UserService = require('../services/userService')

class UserController {
    static async getUsers(req, res){

        const result = await UserService.getUsers(req.query)

        return res.status(200).json({
            success:true,
            message:'Get Users | Sucesso',
            params: req.params,
            result: result
        })
    }

}

module.exports = UserController