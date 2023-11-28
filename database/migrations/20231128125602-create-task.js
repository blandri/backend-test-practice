'use strict';
const { taskPriority } = require('../../src/utils/task.utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize, DataTypes) {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      file_attachment: {
        type: Sequelize.TEXT,
        defaultValue:
          ''
      },
      priority: {
        type: Sequelize.ENUM,
        values: taskPriority,
        defaultValue: 'HIGH'
      },
      assignees: {
        type: Sequelize.STRING
      },
      select_projects: {
        type: Sequelize.STRING
      },
      project_id: {
        type: Sequelize.INTEGER,
        default: null,
        references: {
          model: 'Projects',
          key: 'id',
          as: 'project_id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        default: null,
        references: {
          model: 'Users',
          key: 'id',
          as: 'Users_id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks');
  }
};