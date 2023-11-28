'use strict';
const {
  Model
} = require('sequelize');
const { taskPriority } = require('../../src/utils/task.utils');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Project }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      this.belongsTo(Project, {
        foreignKey: 'project_id',
        as: 'project'
      });
    }
  }
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    assignees: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    priority: {
      type: DataTypes.ENUM,
      values: taskPriority,
      defaultValue: 'HIGH'
    },
    file_attachment: {
      type: DataTypes.TEXT,
      defaultValue:
        ''
    },
    select_projects: DataTypes.STRING,
    project_id: {
      type: DataTypes.INTEGER,
      default: null,
      references: {
        model: 'Project',
        key: 'id',
        as: 'project_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      default: null,
      references: {
        model: 'User',
        key: 'id',
        as: 'user_id'
      }
    },
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};