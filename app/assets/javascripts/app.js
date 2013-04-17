$(document).ready(function() {
  init();
});

var init = function() {

  var todoCollection = new Backbone.Collection();
  window.todoCollection = todoCollection;

  $.ajax({
    url: '/',
    method: 'get',
    dataType: 'json',
    success: function(todoItems){
      todoCollection.reset(todoItems);
    }
  })

  var todosList = new TodosListView({
    el: $('.todos'),
    collection: todoCollection
  })

  var newTodo = new Backbone.Model()

  newTodo.on('save', function(){
    var model = this;
    $.ajax({
      url: '/todos',
      method: 'post',
      data: { todo: model.attributes },
      success: function(data){
      }
    });
  });

  var todoCreator = new TodoCreatorView({
    el: $('.todo-creator'),
    model: newTodo
  });

  $('body').removeClass('loading');
}

var TodoCreatorView = Backbone.View.extend({
  events: {
    'click .new-todo-button': 'toggleVisibility',
    'submit .new-todo-form': 'save',
    'blur .new-todo-form': 'fieldBlur'
  },

  toggleVisibility: function(e) {
    e.preventDefault();
    this.$el.toggleClass('collapsed');
  },

  save: function(e){
    e.preventDefault();
    this.model.trigger('save');
  },

  fieldBlur: function(e){
    this.model.set($(e.target).attr('name'), $(e.target).val())
  }

});

var TodosListView = Backbone.View.extend({
  collectionEvents: {
    'reset': 'render',
  },

  initialize: function(){
    this.collection.on('reset', this.render.bind(this));
  },

  render: function(){
    console.log(this.collection)
  }
});

Backbone.sync = function(){}
