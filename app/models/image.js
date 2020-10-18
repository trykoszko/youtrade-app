module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
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
