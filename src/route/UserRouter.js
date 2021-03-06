import { Router } from 'express';

export class UserRouter {
    userRouter = Router();
    userController;

    constructor(usercontroller) {
        this.userController = usercontroller;
    }

    getRoutes() {
      // define endpoints
        return this.userRouter;
    }
}
