module.exports = (sequelize, DataTypes) => {
    const Ad = sequelize.define('Ad', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
        desc: { type: DataTypes.STRING },
        price: { type: DataTypes.INTEGER }
    }, {
        freezeTableName: true,
        tableName: 'Ads'
    })

    Ad.associate = models => {
        Ad.belongsTo(models.User)
        Ad.hasMany(models.Image)
    }

    return Ad
}
