

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

const { SpotImage, sequelize } = require("../models");

module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "SpotImages";
		return queryInterface.bulkInsert(options, [
			{
				url: "",
				spotId: 1,
				isPreview: true,
			},
			{
				url: "",
				spotId: 1,
				isPreview: false,
			},
			{
				url: "",
				spotId: 1,
				isPreview: false,
			},
			{
				url: "",
				spotId: 1,
				isPreview: false,
			},
			{
				url: "",
				spotId: 3,
				isPreview: true,
			},
			{
				url: "",
				spotId: 3,
				isPreview: false,
			},
			{
				url: "",
				spotId: 3,
				isPreview: false,
			},
			{
				url: "",
				spotId: 3,
				isPreview: false,
			},
			{
				url: "",
				spotId: 3,
				isPreview: false,
			},
			{
				url: "",
				spotId: 2,
				isPreview: true,
			},
			{
				url: "",
				spotId: 2,
				isPreview: false,
			},
			{
				url: "",
				spotId: 2,
				isPreview: false,
			},
			{
				url: "",
				spotId: 2,
				isPreview: false,
			},
			{
				url: "",
				spotId: 2,
				isPreview: false,
			},
			{
				url: "",
				spotId: 4,
				isPreview: true,
			},
			{
				url: "",
				spotId: 4,
				isPreview: false,
			},
			{
				url: "",
				spotId: 4,
				isPreview: false,
			},
			{
				url: "",
				spotId: 4,
				isPreview: false,
			},
			{
				url: "",
				spotId: 4,
				isPreview: false,
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "SpotImages";
		const Op = sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				spotId: 1,
			},
			{}
		);
	},
};
