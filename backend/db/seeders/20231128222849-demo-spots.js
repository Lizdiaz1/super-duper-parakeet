"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Spots";
		return queryInterface.bulkInsert(options,
			[
				{
					ownerId: 1,
					address: "720 Chalet Lane ",
					city: "Zermatt",
					state: "Village",
					country: "Switzerland",
					lat: 46.02126,
					lng: 7.74912,
					name: "Luxurious Swiss Chalet",
					description: "This chalet includes five deluxe bedroom suites, open-plan living spaces with floor-to-ceiling windows, a private in-house Gourmet Chef, and a carefully curated art collection.",
					price: 48285,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					ownerId: 1,
					address: "666 Forest Place",
					city: "Hell",
					state: "Michigan",
					country: "United States of America",
					lat: 17.7645358,
					lng: -102.4730327,
					name: "A Cabin In The Woods",
					description: "Just a regular cabin in the woods. Definitely not haunted. We are not liable for any loss of souls or future costs of exorcisms after staying a night here. Family friendly, no smoking please.",
					price: 15,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					ownerId: 2,
					address: "3500 Lighthouse Blvd",
					city: "Lusby",
					state: "Maryland",
					country: "United States of America",
					lat: 38.38622 ,
					lng: -76.38200,
					name: "Cove Point Lighthouse Keeper's House",
					description: "This historic site, listed on the National Register of Historic Places, includes accommodation for up to eight guests in three bedrooms. It's an active lighthouse and keeper’s home located on a seven-acre point of land in Chesapeake Bay. The cottage features a screened-in porch with views of the lighthouse and water, and guests have access to a beach. Modern comforts like a full kitchen, laundry room, Wi-Fi, and TV are included",
					price: 325,
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					ownerId: 3,
					address: "123 Where all your dreams come true Lane ",
					city: "Anaheim",
					state: "California",
					country: "United States of America",
					lat: 35.7645358,
					lng: 35.4730327,
					name: "Disney Land",
					description: "It's the entire Disney Land Park. Rent out the whole park",
					price: 350000,
					createdAt: new Date(),
					updatedAt: new Date()
				},
			],
			{ validate: true }
		);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Spots";
		const Op = Sequelize.Op;
		return queryInterface.bulkDelete(
			options,
			{
				state: { [Op.in]: ["California"] },
			},
			{}
		);
	},
};
