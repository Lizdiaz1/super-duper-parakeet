"use strict";

const { Booking } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
		return queryInterface.bulkInsert(options,
			[
				{
					userId: 1,
					spotId: 1,
					startDate: new Date("2024-12-24").toJSON(),
					endDate: new Date("2024-12-25").toJSON(),
				},
				{
					userId: 2,
					spotId: 1,
					startDate: new Date("2024-12-26").toJSON(),
					endDate: new Date("2024-12-27").toJSON(),
				},
				{
					userId: 1,
					spotId: 1,
					startDate: new Date("2024-12-28").toJSON(),
					endDate: new Date("2024-12-29").toJSON(),
				},
				{
					userId: 1,
					spotId: 2,
					startDate: new Date("2024-12-30").toJSON(),
					endDate: new Date("2024-12-31").toJSON(),
				},
				{
					userId: 3,
					spotId: 1,
					startDate: new Date("2024-1-24").toJSON(),
					endDate: new Date("2024-1-25").toJSON(),
				},
				{
					userId: 4,
					spotId: 1,
					startDate: new Date("2024-1-26").toJSON(),
					endDate: new Date("2024-1-27").toJSON(),
				},
				{
					userId: 4,
					spotId: 1,
					startDate: new Date("2024-1-28").toJSON(),
					endDate: new Date("2024-1-29").toJSON(),
				},
			],
			{ validate: true }
		);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Bookings";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(options, {
			spotId: 1,
		});
	},
};
