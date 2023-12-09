'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      // Association with Review
      ReviewImage.belongsTo(models.Review, {
        foreignKey: 'reviewId',
        as: 'review',
        onDelete: 'CASCADE',
      });
    }
  };

  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reviews',
        key: 'id',
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });

  return ReviewImage;
};
