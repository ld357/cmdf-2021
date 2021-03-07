const {Habit, User, UserHabits, HabitTypes} = require("../models");

exports.addHabit = (req, res) => {

    const existingUser = User.count({
        where: {
            id: req.body.ownerId,
        }
    });

    const existingHabitType = HabitTypes.count({
        where: {
            id: req.body.habitTypeId,
        }
    });

    if (!existingUser || !existingHabitType) {
        return res.status(400);
    }

    const habit = {
        name: req.body.name,
        ownerId: req.body.ownerId,
        numOfLikes: req.body.numOfLikes,
        description: req.body.description,
        endDuration: req.body.endDuration,
        habitTypeId: req.body.habitTypeId,
    }

    return Habit.create(habit).then((createdHabit) => {
        const userHabit = {
            userId: req.body.ownerId,
            habitId: createdHabit.id,
            currentDuration: 0,
            endDuration: createdHabit.endDuration,
        };

        UserHabits.create(userHabit);
        return res.status(201).json({status: 'Success'});
    });

}

exports.getHabits = (req, res) => {

    const promises = [];
    promises.push(Habit.findAll());
    promises.push(UserHabits.findAll());
    return Promise.all(promises).then((entities) => {
        return res.json(entities);
    }).catch(console.error);
}

exports.getHabit = (req, res) => {
    const promises = [];
    promises.push(Habit.findOne({
        where: {
            id: req.params.habit_id,
        },
    }));
    promises.push(UserHabits.findOne({
        where: {
            habitId: req.params.habit_id,
        }
    }));
    return Promise.all(promises).then((result) => {
        res.json(result);
    }).catch(console.error);
}

exports.upvoteHabit = (req, res) => {
    return Habit.increment('numOfLikes', { where: { id: req.params.habit_id } }).then(() => {
        return res.status(201).json({status: 'Success'});
    }).catch((e) => {
        return res.status(400);
    });
}

exports.downvoteHabit = (req, res) => {
    return Habit.decrement('numOfLikes', { where: { id: req.params.habit_id } }).then(() => {
        return res.status(201).json({status: 'Success'});
    }).catch((e) => {
        return res.status(400);
    });
}