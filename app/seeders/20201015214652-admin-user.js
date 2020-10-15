const slugify = require('slugify')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const name = 'Michal Trykoszko'
    await queryInterface.bulkInsert('Users', [{
      nicename: name,
      username: slugify(name, { lower: true }),
      email: 'trykoszkom@gmail.com',
      isAdmin: true,
      password: await bcrypt.hash('qwe', SALT_ROUNDS),
      acceptTerms: true,
      acceptGdpr: true,
      isActivated: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
