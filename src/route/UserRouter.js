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
        this.userRouter.get('/habits/:user_id', FbAuth, this.userController.getUserHabits)
        this.userRouter.post('/habits/:user_id', FbAuth, this.userController.postUserHabit)
        this.userRouter.post('/habits/:user_id/new', FbAuth, this.userController.postNewHabit)
        return this.userRouter;
    }
}