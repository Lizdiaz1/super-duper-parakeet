"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Booking extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */

		static associate(models) {
			Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
			Booking.belongsTo(models.User, { foreignKey: "userId" });
		}
	}
	Booking.init(
		{
			userId: DataTypes.INTEGER,
			spotId: DataTypes.INTEGER,

			startDate: {
				type: DataTypes.DATE,
				allowNull: false,
				unique: true,
				validate: {
					isAfter(value) {
						const currDate = new Date();
						//console.log(currDate)
						if (this.startDate < currDate) {
							// console.log(currDate < this.startDate);
							// console.log(this.startDate);
							throw new Error("Date cannot be in the past");
						}
					},
				},
			},
			endDate: {
				type: DataTypes.DATE,
				allowNull: false,
				// isAfter: startDate,
				validate: {
					isAfter(value) {
						if (this.startDate > this.endDate) {
							throw new Error("Start date must be before the end date");
						}
					},
				},
			},
		},
		{
			indexes: [
				{
					unique: true,
					fields: ["spotId", "startDate"],
				},
				{
					unique: true,
					fields: ["spotId", "endDate"],
				},
			],
			sequelize,
			modelName: "Booking",
		}
	);
	return Booking;
};
