var Todo = function(data) {
  this.title = data.title;
  this.body = data.body;
  this.id   = data.id;
}

Todo.prototype.render = function() {
  return HandlebarsTemplates['todo-item']({title: this.title, body: this.body, id: this.id})
}
