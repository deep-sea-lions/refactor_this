var App = {
  lists: [],

  init: function() {
    var todoCreator = new TodoCreatorView({el: $('.todo-creator')});

    this.addListeners();
    this.populateTodoLists();

    $('body').removeClass('loading');
  },

  addListeners: function() {

    $('.todos h2').on('click', this.toggleList);
    $('.todos li a').mouseenter(this.showTooltip).mouseleave(this.hideTooltip);
  },

  appendTodo: function(event, data) {
    $(this).find('input[type="text"]').val("");
    var list = App.findOrCreateTodoList(data.list_name);
    var todo = new Todo(data);
    list.addTodo(todo.render());
  },


  toggleList: function(e){
    $(this).next('ul').toggle();
  },

  showTooltip: function(e) {
    $('.tooltip').html($(this).text().split(':')[1].trim()).addClass('active');
  },

  hideTooltip: function(e) {
    $('.tooltip').empty().removeClass('active');
  },

  appendTodoList: function(todoList) {
    $('.todos').append(todoList);
  },

  findOrCreateTodoList: function(name) {
    var list = this.findList(name)
    if (!list) {
       list = new TodoList(name);
       App.appendTodoList(list.render());
    }
    return list
  },

  populateTodoLists: function() {
    var self = this;
    $('.todos ul').each(function(i, list) { self.lists.push(new TodoList(list.id)) })
  },

  findList: function(name) {
    return $.grep(App.lists, function(list){ return list.name == name; })[0];
  }

}

$(document).ready(function() {
  App.init();
});

var TodoCreatorView = Backbone.View.extend({

  events: {
    'click .new-todo-button': 'toggleVisibility',
    'ajax:success .new-todo-form': App.appendTodo
  },

  toggleVisibility: function(e) {
    e.preventDefault();
    this.$el.toggleClass('collapsed');
  }

});
