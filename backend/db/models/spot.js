"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Spot extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Spot.belongsTo(models.User, { foreignKey: "ownerId" });
			Spot.hasMany(models.SpotImage, { foreignKey: "spotId" });
			Spot.hasMany(models.Review, { foreignKey: "spotId" });
			Spot.hasMany(models.Booking, { foreignKey: "spotId" });
		}
	}
	Spot.init(
		{
			ownerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: {
						args: [10, 100],
						msg: "address must be between 10 and 100 characters",
					},
				},
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			state: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			country: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lat: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					min: {
						args: [-90],
						msg: "latitude is invalid "
					},
					max: {
						args: [90],
						msg: "latitude is invalid "
					},
				},
			},
			lng: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					min: {
						args: [-180],
						msg: "longitude is invalid "
					},
					max: {
						args: [180],
						msg: "longitude is invalid "
					},
				},
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					len: {
						args: [10, 50],
						msg: "name must be between 10 and 50 characters",
					},
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [10, 256],
						msg: "description must be between 10 and 256 characters",
					},
				},
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: {
						args: [1],
						msg: "Price is invalid"
					},
				},
			},
			avgRating: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			previewImage: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isUrl: true,
				},
			},
		},
		{
			sequelize,
			modelName: "Spot",
			// defaultScope: {
			// 	attributes: {
			// 		exclude: ["avgRating", "previewImage"],
			// 	},
			// }
		}
	);
	return Spot;
};
