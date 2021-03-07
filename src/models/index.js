'use strict';
const seq = require("sequelize");
const Sequelize = require('sequelize-cockroachdb');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

let users;
let habitTypes;
let habits;
let userHabits;

const sequelize = new Sequelize({
    dialect: "postgres",
    username: "lily",
    password: process.env.COCKROACH_DB_PASSWORD,
    host: process.env.COCKROACH_DB_HOST,
    port: 26257,
    database: process.env.COCKROACH_DB_DATABASE,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(process.env.COCKROACH_DB_CERT_PATH).toString()
        },
    },
    logging: false,
});

exports.handleUserTableAndSampleData = () => {
   users = sequelize.define('Users', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
            defaultValue: seq.DataTypes.UUIDV4,
        },
        firstName: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: seq.DataTypes.STRING,
            allowNull: false
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
    users.associate = function() {
        users.hasMany(userHabits, {
            foreignKey: "userId",
        });
        users.hasMany(habits,{
            foreignKey: "ownerId"
        });
    };
   return users;
}

exports.handleHabitTypesTableAndSampleData = () => {

    habitTypes = sequelize.define('HabitTypes', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
            defaultValue: seq.DataTypes.UUIDV4,
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
    habitTypes.associate = function() {
        habitTypes.hasMany(habits, {
            foreignKey: "habitTypeId",
        });
    }
    return habitTypes;
}

exports.handleHabitsTableAndSampleData = () => {
    habits = sequelize.define('Habits', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
            defaultValue: seq.DataTypes.UUIDV4,
        },
        name: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: seq.DataTypes.STRING,
            allowNull: false,
        },
        ownerId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            }
        },
        numOfLikes: {
            type: seq.DataTypes.INTEGER,
            allowNull: false,
        },
        endDuration: {
            type: seq.DataTypes.INTEGER,
            allowNull: false,
        },
        habitTypeId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "HabitTypes",
                key: "id",
            }
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
    habits.associate = function() {
        habits.hasMany(userHabits, {
            foreignKey: "habitId",
        });

        habits.belongsTo(users,{
            foreignKey: "ownerId",
            onDelete: "CASCADE",
        });

        habits.belongsTo(habitTypes, {
            foreignKey: "habitTypeId",
            onDelete: "CASCADE",
        });
    }
    return habits;
}

exports.handleUserHabitsTableAndSampleData = () => {
    userHabits = sequelize.define('UserHabits', {
        id: {
            type: seq.DataTypes.UUID,
            primaryKey: true,
            defaultValue: seq.DataTypes.UUIDV4,
        },
        userId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            }
        },
        habitId: {
            type: seq.DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Habits",
                key: "id",
            }
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
    userHabits.associate = function() {
        userHabits.belongsTo(users, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });

        userHabits.belongsTo(habits,{
            foreignKey: "habitId",
            onDelete: "CASCADE",
        });
    };
    return userHabits;
}


exports.setupAssociations = () => {

    users.associate = function() {
        users.hasMany(userHabits, {
            foreignKey: "userId",
        });
        users.hasMany(habits,{
            foreignKey: "ownerId"
        });
    };

    userHabits.associate = function() {
        userHabits.belongsTo(users, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });

        userHabits.belongsTo(habits,{
            foreignKey: "habitId",
            onDelete: "CASCADE",
        });
    };

    habits.associate = function() {
        habits.hasMany(userHabits, {
            foreignKey: "habitId",
        });

        habits.belongsTo(users,{
            foreignKey: "ownerId",
            onDelete: "CASCADE",
        });

        habits.belongsTo(habitTypes, {
            foreignKey: "habitTypeId",
            onDelete: "CASCADE",
        });
    }


    habitTypes.associate = function() {
        habitTypes.hasMany(habits, {
            foreignKey: "habitTypeId",
        });
    }

    return sequelize.sync().then((r) => { return; });
}

exports.addSampleData = async () => {
    const userOne = {
        firstName: "Sharon",
        lastName: "He",
        email: 'sharon@gmail.com',
        bio: "Ready to focus on my physical wellness!"
    };
    const userTwo = {
        firstName: "Lily",
        lastName: "Du",
        email: 'lily@gmail.com',
        bio: "Excited to empower one another!"
    };
    const userThree = {
        firstName: "Merissa",
        lastName: "Li",
        email: 'merissa@gmail.com',
        bio: "3,2,1- let's start a habit!"
    };


    const habitTypeOne = { name: "Physical Wellness" };
    const habitTypeTwo = { name: "Productivity" };
    const habitTypeThree = { name: "Mental Wellness" };
    const habitTypeFour = { name: "Social Connections" };
    const habitTypeFive = { name: "Growth"};
    const habitTypeSix = { name: "Hobbies"};

    try {
        const resultUserOne = await users.create(userOne);
        const resultUserTwo = await users.create(userTwo);
        const resultUserThree = await users.create(userThree);

        const resultHabitTypeOne = await habitTypes.create(habitTypeOne);
        const resultHabitTypeTwo = await habitTypes.create(habitTypeTwo);
        const resultHabitTypeThree = await habitTypes.create(habitTypeThree);
        const resultHabitTypeFour = await habitTypes.create(habitTypeFour);
        const resultHabitTypeFive = await habitTypes.create(habitTypeFive);
        const resultHabitTypeSix = await habitTypes.create(habitTypeSix);

        const habitOne = { name: "Let's Get Fit!", ownerId: resultUserOne.id, numOfLikes: 3, description: "Are you interested in morning runs? Join us!", endDuration: 90, habitTypeId: resultHabitTypeOne.id};
        const habitTwo = { name: "It's Focus Time.", ownerId: resultUserTwo.id, numOfLikes: 0, description: "It's 2021, let's get focused!", endDuration: 30, habitTypeId: resultHabitTypeTwo.id};
        const habitThree = { name: "Tune into your wellness!", ownerId: resultUserThree.id, numOfLikes: 5, description: "Care about your mental well-being? Join our affirmations session!", endDuration: 10, habitTypeId: resultHabitTypeThree.id};

        const resultHabitOne = await habits.create(habitOne);
        const resultHabitTwo = await habits.create(habitTwo);
        const resultHabitThree = await habits.create(habitThree);

        const userHabitOne = { userId: resultUserOne.id, habitId: resultHabitOne.id, currentDuration: 3, endDuration: 10 };
        const userHabitTwo = { userId: resultUserThree.id, habitId: resultHabitOne.id, currentDuration: 1, endDuration: 60 };
        const userHabitThree = { userId: resultUserTwo.id, habitId: resultHabitTwo.id, currentDuration: 4, endDuration: 9 };
        const userHabitFour = { userId: resultUserOne.id, habitId: resultHabitTwo.id, currentDuration: 10, endDuration: 80 };
        const userHabitFive = { userId: resultUserThree.id, habitId: resultHabitThree.id, currentDuration: 5, endDuration: 7 };

        const resultUserHabitOne = await userHabits.create(userHabitOne);
        const resultUserHabitTwo = await userHabits.create(userHabitTwo);
        const resultUserHabitThree = await userHabits.create(userHabitThree);
        const resultUserHabitFour = await userHabits.create(userHabitFour);
        const resultUserHabitFive = await userHabits.create(userHabitFive);
    } catch (e) {
        console.log("error in setting up sample data", e);
    }

}

module.exports.UserHabits = this.handleUserHabitsTableAndSampleData();
module.exports.User = this.handleUserTableAndSampleData();
module.exports.HabitTypes = this.handleHabitTypesTableAndSampleData();
module.exports.Habit = this.handleHabitsTableAndSampleData();
module.exports.Sequelize = Sequelize;