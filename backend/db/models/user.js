"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.Spot, { foreignKey: "id" })
			User.hasMany(models.Review, { foreignKey: "id"})
			User.hasMany(models.Booking, {foreignKey: "id"})

		}
	}

	User.init({

		username: {
			type: DataTypes.STRING,
			allowNull: false,
			//unique: true,
			validate: {
				len: [4, 30],
				isNotEmail(value) {
					if (Validator.isEmail(value)) {
						throw new Error("Username cannot be an email.");
					}
				},
			},
			unique: {
				args: true,
				msg: "User with that username already exists"
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
			  len: {
				args: [3, 256],
         		 msg: "Invalid email"
        },
        isEmail: {
          args: true,
          msg: "Invalid email"
        },
        notNull: {
          args: true,
          msg: "Invalid email"
        },
      },
      unique: {
        args: true,
        msg: "User with that email already exists"
      },
    },
		hashedPassword: {
			type: DataTypes.STRING.BINARY,
			allowNull: false,
			validate: {
				len: [60, 60],
			},
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 30],
			},
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 30],
			},
		},
	},
	{
		sequelize,
		modelName: "User",
		defaultScope: {
			attributes: {
				exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
			},
		},
	});
	return User;
};
