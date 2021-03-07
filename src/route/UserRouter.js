const { Router } = require('express')
const FbAuth = require('../../util/FbAuth')

module.exports = class UserRouter {
    userRouter = Router();
    userController;

    constructor(usercontroller) {
        this.userController = usercontroller;
    }

    getRoutes() {
        // define endpoints
        this.userRouter.post('/signup', this.userController.signup)
        this.userRouter.post('/login', this.userController.login)
        this.userRouter.get('/', FbAuth, this.userController.getUsers)
        this.userRouter.get('/:user_id', FbAuth, this.userController.getUser)
        return this.userRouter;
    }
}