'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await User.bulkCreate([
        {
          email: 'demo@user.io',
          username: 'Demo-lition',
          hashedPassword: bcrypt.hashSync('password'),
          firstName: 'Demo',
          lastName: 'Lition'
        },
        {
          email: 'user1@user.io',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password2'),
          firstName: 'Fake',
          lastName: 'Userone'
          // Add firstName and lastName if your User model requires them
        },
        {
          email: 'user2@user.io',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password3'),
          firstName: 'Fake',
          lastName: 'Usertwo'
          // Add firstName and lastName if your User model requires them
        },
      ], { validate: true });
    } catch (error) {
      console.error('Seeding error:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
