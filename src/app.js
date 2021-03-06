const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');

class App {
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

        // initialize routers and controllers
        // and link with app.use
    }
}

const app = new App();
app.init().then();
