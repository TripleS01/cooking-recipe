//Libraries
const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


//Files
const routes = require('./routes');
const { authMiddleware } = require('./middlewares/authMiddleware')


//Express
const app = express();
const port = 5111;

app.use(express.static(path.resolve('src/public')));
app.use(express.urlencoded({ extended: false }));

//Cookie-Parser
app.use(cookieParser());

//Auth middleware
app.use(authMiddleware);


//Handlebars
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve('src/views'));

//Router
app.use(routes);

//Mongoose
mongoose.connect('mongodb://localhost:27017/cooking-recipes');
mongoose.connection.on('connected', () => console.log(`Database is connected!`));
mongoose.connection.on('disconnected', () => console.log(`Database is disconnected!`));
mongoose.connection.on('error', (error) => console.log(error));

//Express
app.listen(port, () => console.log(`App is listening on port http://localhost:${port}...`));
