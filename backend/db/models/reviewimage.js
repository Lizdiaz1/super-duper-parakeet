'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {foreignKey: "reviewId"})
    }
  }
  ReviewImage.init(
		{
			url: {
				allowNull: false,
        type: DataTypes.STRING,
				validate: {
					isUrl: true,
				},
			},
			reviewId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'Reviews' },
    },
		},
		{
			sequelize,
			modelName: "ReviewImage",
		}
	);
  return ReviewImage;
};
