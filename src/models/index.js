'use strict';
const seq = require("sequelize");
const Sequelize = require('sequelize-cockroachdb');

let user;
let habitTypes;
let habit;
let userHabits;
let sequelize;

exports.setupDatabase= () => {
    sequelize = new Sequelize({
        dialect: "postgres",
        username: "root",
        password: "admin",
        host: "localhost",
        port: 51703,
        database: "cmdf",
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
                // For secure connection:
                /*ca: fs.readFileSync('certs/ca.crt')
                          .toString()*/
            },
        },
        logging: false,
    });
    console.log("finished setup");
}

exports.handleUserTableAndSampleData = () => {
   user = sequelize.define('User', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
        },
        firstName: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
    });
    console.log("finished user setup");
}

exports.handleHabitTypesTableAndSampleData = () => {

    habitTypes = sequelize.define('HabitTypes', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
    });
}

exports.handleHabitsTableAndSampleData = () => {
    habit = sequelize.define('Habit', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        endDuration: {
            type: seq.DataTypes.INTEGER,
            allowNull: false,
        },
        habitTypeId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
        },
        createdAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
    });
}

exports.handleUserHabitsTableAndSampleData = () => {
    userHabits =  sequelize.define('UserHabits', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
        },
        userId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
        },
        ownerId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
        },
        habitId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
        },
        currentDuration: {
            type: seq.DataTypes.INTEGER,
            allowNull: false,
        },
        endDuration: {
            type: seq.DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: seq.DataTypes.DATE,
            allowNull: false,
        },
    });
}


exports.setupAssociations = () => {
    userHabits.belongsTo(user, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });

    userHabits.belongsTo(user,{
        foreignKey: "ownerId",
        onDelete: "CASCADE",
    });

    userHabits.belongsTo(habit,{
        foreignKey: "habitId",
        onDelete: "CASCADE",
    });

    habit.hasMany(userHabits, {
        foreignKey: "habitId",
    });

    habit.belongsTo(habitTypes, {
        foreignKey: "habitTypeId",
        onDelete: "CASCADE",
    });

    habitTypes.hasMany(habit, {
        foreignKey: "habitTypeId",
    });

    user.hasMany(userHabits, {
        foreignKey: "userId",
    });
    sequelize.sync();
}

exports.addSampleData = async () => {
    const userOne = {
        id: "603cc548-a359-4908-b054-a82bbf5abb00",
        firstName: "Sharon",
        lastName: "He",
        bio: "Ready to focus on my physical wellness!"
    };
    const userTwo = {
        id: "603cc548-a359-4908-b054-a82bbf5abb01",
        firstName: "Lily",
        lastName: "Du",
        bio: "Excited to empower one another!"
    };
    const userThree = {
        id: "603cc548-a359-4908-b054-a82bbf5abb02",
        firstName: "Merissa",
        lastName: "Li",
        bio: "3,2,1- let's start a habit!"
    };


    const habitTypeOne = { id: "403cc548-a359-4908-b054-a82bbf5abb06", name: "Physical Wellness" };
    const habitTypeTwo = { id: "403cc548-a359-4908-b054-a82bbf5abb07", name: "Productivity" };
    const habitTypeThree = { id: "403cc548-a359-4908-b054-a82bbf5abb08", name: "Mental Wellness" };
    const habitTypeFour = { id: "403cc548-a359-4908-b054-a82bbf5abb09", name: "Social Connections" };
    const habitTypeFive = { id: "403cc548-a359-4908-b054-a82bbf5abb10", name: "Growth"};
    const habitTypeSix = { id: "403cc548-a359-4908-b054-a82bbf5abb11", name: "Hobbies"};

    const habitOne = { id: "503cc548-a359-4908-b054-a82bbf5abb03", name: "Let's Get Fit!", description: "Are you interested in morning runs? Join us!", endDuration: 90, habitTypeId: "403cc548-a359-4908-b054-a82bbf5abb06"};
    const habitTwo = { id: "503cc548-a359-4908-b054-a82bbf5abb04", name: "It's Focus Time.", description: "It's 2021, let's get focused!", endDuration: 30, habitTypeId: "403cc548-a359-4908-b054-a82bbf5abb07"};
    const habitThree = { id: "503cc548-a359-4908-b054-a82bbf5abb05", name: "Tune into your wellness!", description: "Care about your mental well-being? Join our affirmations session!", endDuration: 10, habitTypeId: "403cc548-a359-4908-b054-a82bbf5abb08"};

    const userHabitOne = { id: "303cc548-a359-4908-b054-a82bbf5abb12", userId: "603cc548-a359-4908-b054-a82bbf5abb00", ownerId: "603cc548-a359-4908-b054-a82bbf5abb00", habitId: "503cc548-a359-4908-b054-a82bbf5abb03", currentDuration: 3, endDuration: 10 };
    const userHabitTwo = { id: "303cc548-a359-4908-b054-a82bbf5abb13", userId: "603cc548-a359-4908-b054-a82bbf5abb02", ownerId: "603cc548-a359-4908-b054-a82bbf5abb00", habitId: "503cc548-a359-4908-b054-a82bbf5abb03", currentDuration: 1, endDuration: 60 };
    const userHabitThree = { id: "303cc548-a359-4908-b054-a82bbf5abb14", userId: "603cc548-a359-4908-b054-a82bbf5abb01", ownerId: "603cc548-a359-4908-b054-a82bbf5abb01", habitId: "503cc548-a359-4908-b054-a82bbf5abb04", currentDuration: 4, endDuration: 9 };
    const userHabitFour = { id: "303cc548-a359-4908-b054-a82bbf5abb15", userId: "603cc548-a359-4908-b054-a82bbf5abb00", ownerId: "603cc548-a359-4908-b054-a82bbf5abb01", habitId: "503cc548-a359-4908-b054-a82bbf5abb04", currentDuration: 10, endDuration: 80 };
    const userHabitFive = { id: "303cc548-a359-4908-b054-a82bbf5abb16", userId: "603cc548-a359-4908-b054-a82bbf5abb02", ownerId: "603cc548-a359-4908-b054-a82bbf5abb02", habitId: "503cc548-a359-4908-b054-a82bbf5abb05", currentDuration: 5, endDuration: 7 };

    try {
        await user.create(userOne);
        await user.create(userTwo);
        await user.create(userThree);

        await habitTypes.create(habitTypeOne);
        await habitTypes.create(habitTypeTwo);
        await habitTypes.create(habitTypeThree);
        await habitTypes.create(habitTypeFour);
        await habitTypes.create(habitTypeFive);
        await habitTypes.create(habitTypeSix);

        await habit.create(habitOne);
        await habit.create(habitTwo);
        await habit.create(habitThree);

        await userHabits.create(userHabitOne);
        await userHabits.create(userHabitTwo);
        await userHabits.create(userHabitThree);
        await userHabits.create(userHabitFour);
        await userHabits.create(userHabitFive);
    } catch (e) {
        console.log("error in setting up sample data", e);
    }

}

module.exports.UserHabits = userHabits;
module.exports.User = user;
module.exports.HabitTypes = habitTypes;
module.exports.Habit = habit;
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;