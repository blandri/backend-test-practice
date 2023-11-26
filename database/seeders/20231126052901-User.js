// const { hashPassword } = require('../../src/helpers/hashPassword');

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'dave',
          password: 'dave2gmail',
          email: 'dave@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'rock',
          password: 'rock2gmail',
          email: 'rock@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
