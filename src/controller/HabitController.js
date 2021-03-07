const {Habit} = require("../models");

exports.addHabit = (req, res) => {
    const habit = {
        name: req.body.name,
        description: req.body.description,
        endDuration: req.body.endDuration,
        habitTypeId: req.body.habitTypeId,
    }

    Habit.create(habit);
    return res.status(201).json({ status: 'Success' });
}

exports.getHabits = (req, res) => {
    Habit.findAll().then(res.json).catch(console.error);
}

exports.getHabit = (req, res) => {
    Habit.findAll({ where: { id: req.params.habit_id }, limit: 1 }).then(res.json).catch(console.error)
}