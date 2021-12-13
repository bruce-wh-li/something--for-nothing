const express = require('express');
const bodyParser = require('body-parser');
const defaultLog    = require('./logger');
const HttpError = require('./api/helper/model/httpErrors');
const usersRoutes = require('./routes/user-routes');
const itemRoutes = require('./routes/item-routes');
const ehloRoutes = require('./routes/ehlo-routes');

const mongoose = require('mongoose');
const app = express();
const path = require('path');
//iE7e2ODW9r2TkvlT

app.use(bodyParser.json());
//enable cor
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader( 'Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
	next();
});

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/api/user', usersRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/ehlo', ehloRoutes);

app.use((req, res, next) => {
	const error = new HttpError('Could not find this route.', 404);
	throw error;
});

//handel any error that I may not think of
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({message: error.message || 'An unknown error occurred!'});
});
console.log(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_ADDRESS}/${process.env.DB_NAME}?retryWrites=true&w=majority`);
mongoose
	.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_ADDRESS}/${process.env.DB_NAME}?retryWrites=true&w=majority`)
	.then(() => {
		app.listen(process.env.PORT || 5000, function() {
			defaultLog.accessLog.info('Started server on port',process.env.PORT ||5000);
		});
	})
	.catch(err => {
		console.log(err);
	});

