const UserService = require('../services/userService')

class UserController {
    static async getUsers(req, res){

        const result = await UserService.getUsers(req.query)

        return res.status(200).json(result)
    }

    static async getUserById(req, res) {
        // Extracts the user ID from the URL parameters
        const { id } = req.params;
        
        // Calls the Service to fetch the specific user
        const result = await UserService.getUserById(id);

        // Standard REST behavior: if not found, return 404
        if (!result) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    }

    static async createUser(req, res) {
        // Extracts the payload from the request body
        const result = await UserService.createUser(req.body);

        return res.status(201).json(result);
    }

    static async updateUser(req, res) {
        // Extracts the user ID from the URL parameters and the payload from the body
        const { id } = req.params;
        const result = await UserService.updateUser(id, req.body);

        return res.status(200).json(result);
    }

    static async deleteUser(req, res) {
        // Extracts only the user ID from the URL parameters
        const { id } = req.params;
        const result = await UserService.deleteUser(id);

        return res.status(200).json(result);
    }

}

module.exports = UserController