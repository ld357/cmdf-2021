const { Router } = require('express')

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
        return this.userRouter;
    }
}