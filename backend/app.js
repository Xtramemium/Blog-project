require('dotenv').config();

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const { notFound, errorHandler } = require('./middlewares/error-handler');

const port = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(cookieParser());
app.use(express.json());

app.use(authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

connectDatabase()
	.then(() => {
		app.listen(port, () => console.log(`Server started on port ${port}`));
	})
	.catch((error) => {
		console.error('Database connection failed', error);
		process.exit(1);
	});
