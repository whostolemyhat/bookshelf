(function($) {
    var books = [
        { title: "Javascript the Good Parts", author: "Douglas Crockford", tags: "javascript", url: "" },
        { title: "Javascript the Definitive Guide", author: "David Flanagan", tags: "javascript", url: "" },
        { title: "Head First Design Patterns", author: "Elisabeth Freeman, Eric Freeman, Bert Bates, Kathy Sierra, Elisabeth Robson", tags: "java, design patterns", url: "" },
        { title: "Learning Javascript Design Patterns", author: "Addy Osmani", tags: "javascript, design patterns", url: "" },
        { title: "Head First Java", author: "Bert Bates, Kathy Sierra", tags: "java", url: "" },
        { title: "The Pragmatic Programmer", author: "Andy Hunt, Dave Thomas", tags: "programming", url: "" }
    ];

    var Book = Backbone.Model.extend({
        defaults: {
            img: "/img/placeholder.png"
        }
    });

    var Bookshelf = Backbone.Collection.extend({
        model: Book
    });

    var BookView = Backbone.View.extend({
        tagName: "article",
        className: "book-container",
        template: $('#bookTemplate').html(),
        editTemplate: _.template($('#editTemplate').html()),

        render: function() {
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },

        events: {
            'click .delete': 'deleteBook',
            'click .edit': 'editBook',
            'click .tag': 'addTag',
            'click .save': 'saveEdits',
            'click .cancel': 'cancelEdit'
        },

        deleteBook: function() {
            var removedTag = this.model.get('tags').toLowerCase();
            this.model.destroy();
            this.remove();

            if(_.indexOf(bookshelf.getTags(), removedTag) === -1) {
                bookshelf.$el.find('#filter select').children('[value="' + removedTag + '"]').remove();
            }
        },

        editBook: function() {
            this.$el.html(this.editTemplate(this.model.toJSON()));

            var newOpt = $('<option />', {
                html: '<em>Add new...</em>',
                value: 'addTag'
            });

            this.select = directory.createSelect().addClass('tag')
                            .val(this.$el.find('tags').val()).append(newOpt)
                            .insertAfter(this.$el.find('title'));
            this.$el.find('input[type="hidden"]').remove();

            if(this.select.val() === 'addTag') {
                this.select.remove();

                $('<input />', {
                    'class': 'tags'
                }).insertAfter(this.$el.find('.title')).focus();
            }
        },

        saveEdits: function(e) {
            e.preventDefault();

            var formData = {};
            var prev = this.model.previousAttributes();

            $(e.target).closest('form').find(':input').add('img').each(function() {
                var el = $(this);
                formData[el.attr('class')] = el.val();
            });

            if(formData.img === '') {
                delete formData.img;
            }

            this.model.set(formData);
            this.render();

            if(prev.img === '/img/placeholder.png') {
                delete prev.img;
            }

            _.each(books, function(book) {
                if(_.isEqual(book, prev)) {
                    books.splice(_.indexOf(books, book), 1, formData);
                }
            });
        },

        cancelEdit: function() {
            this.render();
        }
    });

    var BookshelfView = Backbone.View.extend({
        el: $('#books'),

        initialize: function() {
            this.collection = new Bookshelf(books);
            this.render();
            this.$el.find('#filter').append(this.createNav());
            this.on('change:filterType', function() {
                console.log(this.filterType);
                this.filterByTag();
            }, this);
            this.collection.on('reset', this.render, this);
            this.collection.on('remove', this.removeBook, this);
        },

        render: function() {
            this.$el.find('article').remove();

            _.each(this.collection.models, function(item) {
                this.renderBook(item);
            }, this);
        },

        renderBook: function(item) {
            var bookView = new BookView({
                model: item
            });
            this.$el.append(bookView.render().el);
        },

        removeBook: function(removedModel) {
            var removed = removedModel.attributes;

            if(removed.img === '/img/placeholder.png') {
                delete removed.img;
            }
            _.each(books, function(book) {
                if(_.isEqual(book, removed)) {
                    books.splice(_.indexOf(books, book), 1);
                }
            });
        },

        getTags: function() {
            // tags is a list of comma-separated strings
            var tags = _.map(this.collection.pluck('tags'), function(tags) {
                return _.map(tags.split(','), function(tag) {
                    return tag.trim();
                });
            });
            
            return _.uniq(_.flatten(tags));
        },

        createNav: function() {
            var select = $('<select />', {
                html: '<option value="all">All</option>'
            });

            _.each(this.getTags(), function(tag) {
                var option = $('<option />', {
                    value: tag.toLowerCase(),
                    text: tag.toLowerCase()
                }).appendTo(select);
            });

            return select;
        },

        events: {
            'change #filter select': 'setFilter',
            'click #add': 'addBook',
            'click #showForm': 'showForm'
        },

        setFilter: function(e) {
            this.filterType = e.currentTarget.value;
            this.trigger('change:filterType');
        },

        filterByTag: function() {
            if(this.filterType === 'all') {
                this.collection.reset(books);
                booksRouter.navigate('filter/all');
            } else {
                this.collection.reset(books, { silent: true });

                var filterType = this.filterType;
                filtered = _.filter(this.collection.models, function(item) {
                    // match whole word
                    var re = new RegExp('\\b' + filterType + '\\b', 'g');
                    return re.test(item.get('tags'));
                });

                this.collection.reset(filtered);
                booksRouter.navigate('filter/' + filterType);
            }
        },

        showForm: function() {
            this.$el.find('#addContact').slideToggle();
        }
    });

    var BooksRouter = Backbone.Router.extend({
        routes: {
            'filter/:tag': 'urlFilter'
        },

        urlFilter: function(tag) {
            console.log(tag);
            bookshelf.filterType = tag;
            bookshelf.trigger('change:filterType');
        }
    });

    var bookshelf = new BookshelfView();
    var booksRouter = new BooksRouter();
    Backbone.history.start();

})(jQuery);