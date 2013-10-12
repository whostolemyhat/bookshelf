(function(e){var t=[{title:"Javascript the Good Parts",author:"Douglas Crockford",tags:"javascript",url:""},{title:"Javascript the Definitive Guide",author:"David Flanagan",tags:"javascript",url:""},{title:"Head First Design Patterns",author:"Elisabeth Freeman, Eric Freeman, Bert Bates, Kathy Sierra, Elisabeth Robson",tags:"java, design patterns",url:""},{title:"Learning Javascript Design Patterns",author:"Addy Osmani",tags:"javascript, design patterns",url:""},{title:"Head First Java",author:"Bert Bates, Kathy Sierra",tags:"java",url:""},{title:"The Pragmatic Programmer",author:"Andy Hunt, Dave Thomas",tags:"programming",url:""}],n=Backbone.Model.extend({defaults:{img:"/img/placeholder.png"}}),r=Backbone.Collection.extend({model:n}),i=Backbone.View.extend({tagName:"article",className:"book-container",template:e("#bookTemplate").html(),render:function(){var e=_.template(this.template);this.$el.html(e(this.model.toJSON()));return this}}),s=Backbone.View.extend({el:e("#books"),tags:[],initialize:function(){this.collection=new r(t);this.render();console.log(this.getTypes())},render:function(){var e=this;_.each(this.collection.models,function(t){e.renderBook(t)},this)},renderBook:function(e){var t=new i({model:e});this.$el.append(t.render().el)},getTypes:function(){return _.uniq(this.collection.map(function(e){return e.get("tags").split(",")}))}}),o=new s})(jQuery);