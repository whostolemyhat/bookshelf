(function($) {
    var books = [
        { title: "Javascript the Good Parts", author: "Douglas Crockford", tags: "javascript", url: "" },
        { title: "Javascript the Definitive Guide", author: "David Flanagan", tags: "javascript", url: "" },
        { title: "Head First Design Patterns", author: "Elisabeth Freeman, Eric Freeman, Bert Bates, Kathy Sierra, Elisabeth Robson", tags: "java, design patterns", url: "" },
        { title: "Learning Javascript Design Patterns", author: "Addy Osmani", tags: "javascript, design patterns", url: "" },
        { title: "Head First Java", author: "Bert Bates, Kathy Sierra", tags: "Java", url: "" },
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

        render: function() {
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        }
    });

})(jQuery);