class Element {
    private element: HTMLElement | null = null;
    private tag: string;
    private props: { [key: string]: any } = {};
    private eventListeners: Map<string, EventListener[]> = new Map();
    private childrenFn: (() => (Element | string)[]) | null = null;
    private textContent: string | null = null;
    private parent: HTMLElement | null = null;
    private onMountCallbacks: (() => void)[] = [];
    private onUnmountCallbacks: (() => void)[] = [];
    private conditionalClasses: { [key: string]: boolean | (() => boolean) } = {}; // for css directive
    
    constructor(tag: string) {
      this.tag = tag;
    }
  
    class(className: string): Element {
      this.props.className = className;
      return this;
    }
  
    setText(text: string): Element {
      this.textContent = text;
      this.updateText();
      return this;
    }
  
    value(state: any): Element {
      if (state && typeof state === 'object' && 'subscribe' in state) {
        state.subscribe((value: string) => {
          if (this.element) {
            (this.element as HTMLInputElement).value = value;
          }
        });
  
        this.on('input', (e) => {
          state.set((e.target as HTMLInputElement).value);
        });
      }
      return this;
    }
  
    setStyle(styles: { [key: string]: string }): Element {
      this.props.style = { ...this.props.style, ...styles };
      this.updateStyles();
      return this;
    }
  
    batchStyle(styles: { [key: string]: string }): Element {
      Object.assign(this.props.style, styles);
      this.updateStyles();
      return this;
    }
  
    if(condition: boolean | (() => boolean)): Element {
      const shouldRender = typeof condition === 'function' ? condition() : condition;
      if (!shouldRender && this.element) {
        this.element.style.display = 'none';
      } else if (this.element) {
        this.element.style.display = '';
      }
      return this;
    }
  
    on<K extends keyof HTMLElementEventMap>(
      eventName: K,
      handler: (event: HTMLElementEventMap[K]) => void
    ): Element {
      const wrappedHandler = ((e: Event) => {
        handler(e as HTMLElementEventMap[K]);
      }) as EventListener;
      
      const handlers = this.eventListeners.get(eventName) || [];
      handlers.push(wrappedHandler);
      this.eventListeners.set(eventName, handlers);
  
      if (this.element) {
        this.element.addEventListener(eventName, wrappedHandler);
      }
      return this;
    }
  
    child(childrenFn: () => (Element | string)[]): Element;
    child(...children: (Element | string)[]): Element;
    child(arg: (() => (Element | string)[]) | Element | string, ...rest: (Element | string)[]): Element {
      if (typeof arg === 'function') {
        this.childrenFn = arg;
      } else {
        const staticChildren = [arg, ...rest];
        this.childrenFn = () => staticChildren;
      }
      return this;
    }
  
    onMount(callback: () => void): Element {
      this.onMountCallbacks.push(callback);
      return this;
    }
  
    onUnmount(callback: () => void): Element {
      this.onUnmountCallbacks.push(callback);
      return this;
    }
  
    mount(parent: HTMLElement): void {
      this.parent = parent;
      this.parent.appendChild(this.render());
  
      this.onMountCallbacks.forEach(callback => callback());
    }
  
    unmount(): void {
      if (this.element && this.parent) {
        this.parent.removeChild(this.element);
        this.parent = null;
        
        this.onUnmountCallbacks.forEach(callback => callback());
      }
    }
  
    // New css directive for conditional classes
    css(className: string, condition: boolean | (() => boolean)): Element {
      this.conditionalClasses[className] = condition;
      this.updateClassList();
      return this;
    }
  
    private updateClassList(): void {
      if (this.element) {
        Object.entries(this.conditionalClasses).forEach(([className, condition]) => {
          const shouldApply = typeof condition === 'function' ? condition() : condition;
          this.element!.classList.toggle(className, shouldApply);
        });
      }
    }
  
    private renderChildren(): void {
      if (!this.element || !this.childrenFn) return;
  
      this.element.innerHTML = ''; // Clear existing children
  
      const children = this.childrenFn();
      children.forEach(child => {
        if (typeof child === 'string') {
          this.element!.appendChild(document.createTextNode(child));
        } else {
          const childElement = child.render();
          this.element!.appendChild(childElement);
        }
      });
    }
  
    private updateText(): void {
      if (this.element && this.textContent !== null) {
        this.element.textContent = this.textContent;
      }
    }
  
    private updateStyles(): void {
      if (this.element && this.props.style) {
        Object.assign(this.element.style, this.props.style);
      }
    }

    // Adds Tailwind utility classes and merges with existing ones
    tailwind(...classNames: string[]): Element {
        const existingClasses = this.props.className ? this.props.className.split(' ') : [];
        const newClasses = classNames.filter(cn => !existingClasses.includes(cn));
        this.props.className = [...existingClasses, ...newClasses].join(' ');
        return this;
    }
  
    render(): HTMLElement {
      const isFirstRender = !this.element;
      
      if (isFirstRender) {
        this.element = document.createElement(this.tag);
  
        this.eventListeners.forEach((handlers, eventName) => {
          handlers.forEach(handler => {
            this.element!.addEventListener(eventName, handler);
          });
        });
      }
  
      Object.entries(this.props).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
          Object.assign(this.element!.style, value);
        } else {
          this.element!.setAttribute(key, value);
        }
      });
  
      this.updateText();
      this.updateClassList();
      this.renderChildren();
  
      return this.element!;
    }
  }
  
  export default Element;
  