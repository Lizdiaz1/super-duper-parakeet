'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Association with User
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
      });

      // Association with Spot
      Review.belongsTo(models.Spot, { // Replace 'Entity' with 'Spot'
        foreignKey: 'spotId',
        as: 'spot',
        onDelete: 'CASCADE',
      });

      // Association with ReviewImage
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        as: 'images',
        onDelete: 'CASCADE',
      });
    }
  };

  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Replace 'Entity' with the actual entity name
      references: { model: 'Entities', key: 'id' }
    },
    // Other fields like review content, rating, etc.
  }, {
    sequelize,
    modelName: 'Review',
  });

  return Review;
};
