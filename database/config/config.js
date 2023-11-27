require('dotenv').config()

module.exports = {
  development: {
    use_env_variable: 'DEV_DATABASE_URL',
    database: process.env.DEV_DATABASE_URL,
    host: process.env.DB_HOST,
    username: process.env.POSTGRESS_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
}