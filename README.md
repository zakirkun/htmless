# Htmless

A lightweight front-end framework that eliminates the need for traditional HTML templates or JSX. This library provides a seamless way to create and manage DOM elements using pure JavaScript functions, with built-in reactive state management for building interactive user interfaces.

## Features

- **Declarative Element Creation**: Create and manage DOM elements using simple JavaScript classes and methods.
- **Reactive State Management**: Bind reactive state to DOM elements, automatically updating the UI on state changes.
- **Lifecycle Hooks**: Utilize mount and unmount callbacks for lifecycle management of components.
- **Dynamic Styles and Classes**: Easily set styles and classes on elements with simple methods.
- **Conditional Rendering**: Render elements based on conditions or reactive states.
- **Event Handling**: Attach multiple event listeners to elements with ease.
- **Children Management**: Add child elements dynamically using functions or static arrays.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zakirkun/htmless.git
   cd htmless
   ```

    Install dependencies:

    ```bash
    npm install
    ```
    Build the library:
    ```bash
    npm run build
    ```
2. Usage
- Creating Elements
    To create and mount an element, use the following code:

    ```javascript
    import { create, mount } from 'htmless';

    const app = create('div').setText('Hello, World!').class('app-container');

    // Mount to the body
    mount(app);
    ```
- Using Reactive State
    Bind a reactive state to an element:
    ```javascript
    import { create, mount, reactive } from 'htmless';

    const state = reactive('Click me');

    const button = create('button')
        .setText(state.get())
        .on('click', () => state.set('Clicked!'));

    // Bind state to the button
    reactive(state, () => {
        button.setText(state.get());
    });

    // Mount the button
    mount(button);
    ```

## API
- create(tag: string): Element
Creates a new Element instance with the specified HTML tag.

- mount(root: Element): void
Mounts the specified root Element to the document body.

- reactive(state: any, renderFn: () => Element): Element
Binds a reactive state to an element, allowing for automatic updates when the state changes.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

License
This project is licensed under the MIT License - see the LICENSE file for details.