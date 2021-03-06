const { v4: uuidv4 } = require('uuid')

const {
  Ad
} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ad = await Ad.findAll({ limit: 1 })
    await queryInterface.bulkInsert('Images', [{
      id: uuidv4(),
      url: 'https://dummyimage.com/600x400/000/fff',
      AdId: ad.length ? ad.shift().id : null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Images', null, {})
  }
};
