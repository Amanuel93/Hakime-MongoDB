'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class First_Aid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  First_Aid.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    source: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'First_Aid',
  });
  return First_Aid;
};