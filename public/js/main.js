var AppRouter = Backbone.Router.extend({
	routes: {
		"" : "home",
		"books"	: "list",
		"books/page/:page"	: "list",
		"books/add" : "addBook",
		"books/:id" : "bookDetails",
	},

	initialize: function () {
		this.headerView = new HeaderView();
		$('.header').html(this.headerView.el);
	},

	home: function (id) {
		if (!this.homeView) {
			this.homeView = new HomeView();
		}
		$('#content').html(this.homeView.el);
		this.headerView.selectMenuItem('home-menu');
	},

	list: function(page) {
		var p = page ? parseInt(page, 10) : 1;
		var bookList = new BookCollection();
		bookList.fetch({success: function(){
			$("#content").html(new BookListView({model: bookList, page: p}).el);
		}});
		this.headerView.selectMenuItem('home-menu');
	},

	bookDetails: function (id) {
		var book = new Book({_id: id});
		book.fetch({success: function(){
			$("#content").html(new BookView({model: book}).el);
		}});
		this.headerView.selectMenuItem();
	},

	addBook: function() {
		var book = new Book();
		$('#content').html(new BookView({model: book}).el);
		this.headerView.selectMenuItem('add-menu');
	}
});

utils.loadTemplate(['HomeView', 'HeaderView', 'BookView', 'BookListItemView'], function() {
app = new AppRouter();
Backbone.history.start();
});