

var express = require('express'),
	path 	= require('path'),
	http 	= require('http'),
	io		= require('socket.io'),
	book 	= require('./routes/books');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser()),
	app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app);
io = io.listen(server);

io.configure(function () {
	io.set('authorization', function (handshakeData, callback) {
		if (handshakeData.xdomain) {
			callback('Cross-domain connections are not allowed');
		} else {
			callback(null, true);
		}
	});
});

server.listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});

app.get('/books', book.findAll);
app.get('/books/:id', book.findById);
app.post('/books', book.addBook);
app.put('/books/:id', book.updateBook);
app.delete('/books/:id', book.deleteBook);

io.sockets.on('connection', function (socket) {
	socket.on('message', function (message) {
		console.log("Got message: " + message);
		ip = socket.handshake.address.address;
		url = message;
		io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': '***.***.***.' + ip.substring(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
});

socket.on('disconnect', function () {
		console.log("Socket disconnected");
		io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
	});
});