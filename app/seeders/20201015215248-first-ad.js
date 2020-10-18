const slugify = require('slugify')
const { v4: uuidv4 } = require('uuid')

const {
  User
} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findAll({ limit: 1 })
    const userId = user.length ? user.shift().id : null
    let items = []
    for (let i = 0; i < 10; i++) {
      const title = `Fancy chair ${i}`
      items.push({
        id: uuidv4(),
        name: title,
        slug: slugify(title, { lower: true }),
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed fringilla sapien.',
        price: 100,
        UserId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('Ads', items, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Ads', null, {})
  }
}
