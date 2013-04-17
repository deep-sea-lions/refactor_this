var App = {
  lists: [],

  init: function() {
    var newTodo = new NewTodo()
    var todoCreator = new TodoCreatorView({
      el: $('.todo-creator'),
      model: newTodo
    });

    newTodo.on('save', function(){
      var model = this;
      $.ajax({
        url: model.url,
        method: 'post',
        data: { todo: model.attributes },
        success: function(data){
          console.log(data);
          // $(this).find('input[type="text"]').val("");  clear inputs
          var list = App.findOrCreateTodoList(data.list_name);
          var todo = new Todo(data);
          list.addTodo(todo.render());
        }
      });
    });

    this.addListeners();
    this.populateTodoLists();

    $('body').removeClass('loading');
  },

  addListeners: function() {

    $('.todos h2').on('click', this.toggleList);
    $('.todos li a').mouseenter(this.showTooltip).mouseleave(this.hideTooltip);
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

var NewTodo = Backbone.Model.extend({
  defaults: {
    title: '',
    body: '',
    list_name: ''
  },

  url: '/todos'
})

Backbone.sync = function(){}
