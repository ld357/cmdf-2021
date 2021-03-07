const { Router } = require('express');

module.exports = class HabitRouter {
    habitRouter = Router();
    habitController;

    constructor(habitController) {
        this.habitController = habitController;
    }

    getRoutes() {
        this.habitRouter.post('/', this.habitController.addHabit);
        this.habitRouter.post('/:habit_id/like', this.habitController.upvoteHabit);
        this.habitRouter.post('/:habit_id/dislike', this.habitController.downvoteHabit);
        this.habitRouter.get('/', this.habitController.getHabits);
        this.habitRouter.get('/:habit_id', this.habitController.getHabit);
        return this.habitRouter;
    }
}