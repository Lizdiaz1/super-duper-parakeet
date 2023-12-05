const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SpotImage extends Model {}

  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots', // Assuming 'Spots' is the name of your Spot table
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    // Additional model options as needed
  });

  return SpotImage;
};
