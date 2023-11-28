# backend-test-practice

- This project is written using NodeJS, Sequelize and the databases I used postgres

- The project is written in a service controller format, the services in their respective
   service directory deal directly with models. Controllers in their respective controller
   folder call services on request.

- For testing the routes you can use postman

# how to test

- run `npm run install` then `npm run dev`
- add a .env file with the following variables:

        - DEV_DATABASE_URL=postgres://postgres:post@127.0.0.1:5432/qt_test

        - SECRETE=uIxV

        - CLIENT_ID=843268837721-oel0k36in0cabrl0t4bgoa9v3269vb5n.apps.googleusercontent.com
        - CLIENT_SECRETE=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
        - CALLBACK_URL=http://localhost:5000/api/auth/google/redirect

        - MAILGUN_API_KEY=97ece296bdac983c51ec4786400f568e-5d2b1caa-5382e64c
        - MAILGUN_DOMAIN=bishinga.mailgun.com

        - FRONT_END_URL=http://localhost:4000
        - BASE_URL=localhost:5000

        - PORT=5000

        - POSTGRESS_USER=postgres
        - POSTGRES_PASSWORD=post

# Folder conventions

- The folders are named using camel case convention
- all the modules are within the source folder except the database models and migrations which are in the root folder

# API refernce

<Users>

- register user: `basePath/user/register`
- login: `basePath/user/login`
- logout: `basePath/user/logout`
- reset password request: `basePath/user/reset-password-request`
- reset password: `basePath/user/reset-password/:token`
- update profile: `basePath/user/update-profile`

<Tasks>

- create task: `basePath/task/create-task`
- delete task: `basePath/task/:id`
- update task: `basePath/task/:id`
- view all tasks: `basePath/task/:offset/:limit/:filter`
- download tasks: `basePath/task/download-excel`
- get all projects: `basePath/task/projects`

# Emial

On reset password request you will receive an email with reset link from this address `bishingalandry@gmail.com`
