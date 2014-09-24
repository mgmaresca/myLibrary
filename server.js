var express = require('express'),
	path 	= require('path'),
	http 	= require('http'),
	book 	= require('./routes/books');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser()),
	app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/books', book.findAll);
app.get('/books/:id', book.findById);
app.post('/books', book.addBook);
app.put('/books/:id', book.updateBook);
app.delete('/books/:id', book.deleteBook);

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});