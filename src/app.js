// import docs from 'documentation/index';

import express from 'express';
import 'dotenv';
// import { serve, setup } from 'swagger-ui-express';
// import morgan from 'morgan';
import cors from 'cors';
// import formData from 'express-form-data';
import http from 'http';
import routes from './routes/index';
import passport from 'passport';
import session from 'express-session';

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: '*'
  })
);
// app.use(morgan('dev'));

app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(formData.parse());
// app.use(formData.union());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);
// app.use('/api-docs', serve, setup(docs));
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Barefoot Nomad.' });
});

app.get('*', (req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('server up running on port ', port);
});

export default server;
