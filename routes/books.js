var mongo = require('mongodb');

var Server = mongo.Server,
		Db = mongo.Db,
		BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});

db = new Db('bookdb', server, {safe: true});

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'bookdb' database");
		db.collection('books', {safe:true}, function(err, collection) {
			if (err) {
				console.log("The 'books' collection doesn't exist. Creating it with sample data...");
				populateDB();
			}
		});
	}
});

exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving book: ' + id);

	db.collection('books', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.findAll = function(req, res) {
	db.collection('books', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.addBook = function(req, res) {
	var book = req.body;
	console.log('Adding book: ' + JSON.stringify(wine));

	db.collection('books', function(err, collection) {
		collection.insert(book, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateBook = function(req, res) {
	var id = req.params.id;
	var book = req.body;

	delete book._id;

	console.log('Updating book: ' + id);
	console.log(JSON.stringify(book));

	db.collection('books', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, book, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error updating book: ' + err);
				res.send({'error':'An error has occurred'});
			} else {
				console.log('' + result + ' document(s) updated');
				res.send(book);
			}
		});
	});
}

exports.deleteBook = function(req, res) {
	var id = req.params.id;

	console.log('Deleting book: ' + id);

	db.collection('books', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred - ' + err});
			} else {
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

	var books = [

	{
		title: "El Juego de Ender",
		author: "Orson Scott Card",
		cathegory: "Literatura",
		descrption: "La Tierra está amenazada por una especie extraterrestre de insectos que pretende destruir la humanidad. Para vencerlos se precisa la intervención de un genio militar, por lo cual se permite el nacimiento de Ender, tercer hijo de una pareja en un mundo que limita a dos el número de descendientes. Ender se entrenará en una estación espacial, superará a sus rivales y se convertirá en la persona capaz de dirigir las flotas terrestres contra los insectos de otros mundos.",
		picture: "img1.jpg"
	},

	{
	 	title: "Juego de tronos",
	 	author: "George R. R. Martin",
	 	cathegory: "Batallas",
	 	description: "Tras el largo verano, el invierno se acerca a los Siete Reinos. Lord Eddard Stark, señor de Invernalia, deja sus dominios para unirse a la corte de su amigo el rey Robert Baratheon, llamado el Usurpador, hombre díscolo y otrora guerrero audaz cuyas mayores aficiones son comer, beber y engendrar bastardos. Eddard Stark ocupará el cargo de Mano del Rey e intentará desentrañar una maraña de intrigas que pondrá en peligro su vida y la de todos los suyos. En un mundo cuyas estaciones pueden durar decenios y en el que retazos de una magia inmemorial y olvidada surgen en los rincones más sombríos y maravillosos, la traición y la lealtad, la compasión y la sed de venganza, el amor y el poder hacen del juego de tronos una poderosa trampa que atrapará en sus fauces a los personajes... y al lector.",
	 	picture: "img2.jpg"
	},

	{
	 	title: "I robot",
	 	author: "Isaac Asimov",
	 	cathegory: "Ficción",
	 	description: "Los robots de Isaac Asimov son máquinas capaces de llevar a cabo muy diversas tareas, y que a menudo se plantean a sí mismos problemas de 'conducta humana'. Pero estas cuestiones se resuelven en Yo, robot en el ámbito de las tres leyes fundamentales de la robótica, concebidas por Asimov, y que no dejan de proponer extraordinarias paradojas que a veces se explican por errores de funcionamiento y otras por la creciente complejidad de los 'programas'. Las paradojas que se plantean en estos relatos futuristas no son sólo ingeniosos ejercicios intelectuales sino sobre todo una indagación sobre la situación del hombre actual en relación con los avances tecnológicos y con la experiencia del tiempo.",
	 	picture: "img3.jpg"
	}


	];

	db.collection('books', function(err, collection) {
		collection.insert(books, {safe:true}, function(err, result) {});
	});
};