const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const FbAuth = require('../util/FbAuth')
const cors = require('cors');
const UserController = require('./controller/UserController');
const UserRouter = require('./route/UserRouter');
const models = require('./models')

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

        // initialize routers and controllers
        // and link with app.use
        app.use('/users', new UserRouter(UserController).getRoutes())
    }

    setupData() {
       models.setupDatabase();
       models.handleUserTableAndSampleData();
       models.handleHabitTypesTableAndSampleData();
       models.handleHabitsTableAndSampleData();
       models.handleUserHabitsTableAndSampleData();
       models.setupAssociations();
       models.addSampleData().then(() => { return; });
    }
}

const app = new App();
app.init().then();
