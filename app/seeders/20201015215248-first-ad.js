const slugify = require('slugify')

const {
  User
} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const title = 'Fancy chair'
    const user = await User.findAll({ limit: 1 })
    await queryInterface.bulkInsert('Ads', [{
      name: title,
      slug: slugify(title, { lower: true }),
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed fringilla sapien.',
      price: 100,
      UserId: user.length ? user.shift().id : null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Ads', null, {})
  }
}
