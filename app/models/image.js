module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      freezeTableName: true,
      tableName: 'Images'
    })

    Image.associate = models => {
      Image.belongsTo(models.Ad)
    }

    return Image
  }
