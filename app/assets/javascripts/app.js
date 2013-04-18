$(document).ready(function() {
  init();
});

var init = function() {

  var todoCollection = new Backbone.Collection();

  $.ajax({
    url: '/todos',
    method: 'get',
    dataType: 'json',
    success: function(todoItems){
      todoCollection.reset(todoItems);
    }
  })

  var todosList = new TodosListsView({
    el: $('.todo-lists'),
    collection: todoCollection
  })

  var newTodo = new NewTodoModel();

  newTodo.on('create', function(){
    var model = this;
    $.ajax({
      url: '/todos',
      method: 'post',
      data: { todo: model.attributes },
      success: function(data){
        todoCollection.add(data);
        model.doneCreating();
      }
    });
  });

  var todoCreator = new TodoCreatorView({
    el: $('.todo-creator'),
    model: newTodo
  });

  $('body').removeClass('loading');
}

var NewTodoModel = Backbone.Model.extend({
  doneCreating: function(){
    this.clear();
    this.trigger('created')
  }
})

var TodoCreatorView = Backbone.View.extend({
  events: {
    'click .new-todo-button': 'toggleVisibility',
    'submit .new-todo-form': 'create',
    'blur .new-todo-form': 'fieldBlur',
  },

  initialize: function(){
    var self = this;
    self.model.on('created', function(){
      self.$el.toggleClass('collapsed', true);
    })

    self.model.on('change', function(model){
      _.each(model.changed, function(value, attribute){
        self.$el.find("[name='" + attribute + "']").val(value);
      });
    });
  },

  toggleVisibility: function(e) {
    e.preventDefault();
    this.$el.toggleClass('collapsed');
  },

  create: function(e){
    e.preventDefault();
    this.model.trigger('create');
  },

  fieldBlur: function(e){
    this.model.set($(e.target).attr('name'), $(e.target).val())
  }

});

var TodosListsView = Backbone.View.extend({
  todoListTemplate: _.template("<div class='todo-list' data-name='<%- listName %>'><h2><%- listName %></h2><ul><%= todoListItemsHTML %></ul></div>"),

  todoItemTemplate: _.template("<li><a href='/todos/<%- id %>'><%- title %>: <%- body %></a></li>"),

  collectionEvents: {
    'reset': 'render',
  },

  initialize: function(){
    this.collection.on('reset', this.render.bind(this));
    this.collection.on('add', this.render.bind(this));
  },

  render: function(){
    var self = this;
    this.$el.html('');
    _.each(this.groupListsByListName(), function(todoList, listName){
      var todoListItemsHTML = _.map(todoList, function(todoListItem){
        return self.todoItemTemplate(todoListItem.attributes);
      }).join('')
      self.$el.append(self.todoListTemplate({listName: listName, todoListItemsHTML: todoListItemsHTML}));
    });
  },

  groupListsByListName: function(){
    return this.collection.groupBy('list_name')
  }
});

Backbone.sync = function(){}
