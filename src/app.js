const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const UserController = require('./controller/UserController');
const HabitController = require('./controller/HabitController');
const UserRouter = require('./route/UserRouter');
const HabitRouter = require('./route/HabitRouter');
const models = require("./models");

class App {
    async init() {
        try {
            const app = express();
            await this.registerHandlersAndRoutes(app);
            this.setupData();

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
        app.use(cors({ origin: true }))
        app.get('/', (req, res) => res.send('Hello World'));

        const userRouter = new UserRouter(UserController);
        const habitsRouter = new HabitRouter(HabitController);
        app.use('/users', userRouter.getRoutes());
        app.use('/habits', habitsRouter.getRoutes())
    }

    setupData() {
       models.handleUserTableAndSampleData();
       models.handleHabitTypesTableAndSampleData();
       models.handleHabitsTableAndSampleData();
       models.handleUserHabitsTableAndSampleData();
       models.setupAssociations();
       // return models.addSampleData().then(() => { return; });
    }
}

const app = new App();
app.init().then();
