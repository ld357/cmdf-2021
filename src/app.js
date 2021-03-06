import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';

export class App {
    async init() {
        try {
            const app = express();
            await this.registerHandlersAndRoutes(app);

            const PORT = 8000;
            app.listen(PORT, () => {
                console.log(
                    `⚡️[server]: Server is running at http://localhost:${PORT}`
                );
            });
        } catch (error) {
            console.log(error);
        }
    }

    async registerHandlersAndRoutes(app) {
        app.use(bodyParser.json());

        app.get('/', (req, res) => res.send('Hello World'));

        const promotionRouter = new PromotionRouter(promotionController);
        app.use(Route.PROMOTIONS, promotionRouter.getRoutes());

        const enumController = new EnumController();
        const enumRouter = new EnumRouter(enumController);
        app.use(Route.ENUMS, enumRouter.getRoutes());

        const userController = new UserController();
        const userRouter = new UserRouter(userController);
        app.use(Route.USERS, userRouter.getRoutes());

        // middleware needs to be added at end
        app.use(errorHandler);
    }
}

const app = new App();
app.init().then();
