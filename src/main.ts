import { create, mount, reactive } from "./htmless";
import { state } from "./state";

const todos = state<string[]>([]);
const todo = state<string>("");
const color = state<boolean>(false);

const updateTodo = () => {
  const newTodo = todo.get();
  if (newTodo.split(' ').length === 0 && newTodo.trim()) {
    todos.update(current => [...current, newTodo.trim()]);
  } else {
    todos.update(current => [...current, ...newTodo.split(" ")])
  }
  todo.set('');
}

// Create an Element instance
mount(create("div").class('container').child(() => [
  reactive(todos, () =>
    create('ul').class('todo-list').child(() =>
      todos.get().map((todoItem, index) =>
        create('li')
          .setText(todoItem)
          .on('click', () => {
            todos.update(current =>
              current.filter((_, i) => i !== index)
            );
          })
      )
    )
  ),
  create('input').value(todo).on('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateTodo();
    }
  }),
  create('button')
    .setText('Add Todo')
    .class('btn')
    .on('click', updateTodo),
  create('h1').css('color', () => color.get()).setStyle({ color: 'red' }).setText("Wow")
]));