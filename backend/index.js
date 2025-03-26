// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 8000;
require('dotenv').config();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoute = require('./routes/auth_route');
app.use('/login', authRoute);

// Import user
const userRoute = require('./routes/user_route');
app.use('/users', userRoute);

const menuRote = require('./routes/menu_route');
app.use('/menus', menuRote);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
