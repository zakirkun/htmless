// Define the Subscriber type for reactive state
type Subscriber<T> = (value: T) => void;

// Define the State type to specify the API for reactive state
export interface State<T> {
  get: () => T;
  set: (newValue: T) => void;
  subscribe: (subscriber: Subscriber<T>) => () => void;
  update: (updater: (currentValue: T) => T) => void;
  bindElement: (element: Element) => () => void;
}

// Define the Element class
export declare class Element {
  private element: HTMLElement | null;
  private tag: string;
  private props: { [key: string]: any };
  private eventListeners: Map<string, EventListener[]>;
  private childrenFn: (() => (Element | string)[]) | null;
  private textContent: string | null;
  private parent: HTMLElement | null;
  private onMountCallbacks: (() => void)[];
  private onUnmountCallbacks: (() => void)[];

  constructor(tag: string);

  class(className: string): Element;
  setText(text: string): Element;
  value(state: State<any>): Element;
  setStyle(styles: { [key: string]: string }): Element;
  batchStyle(styles: { [key: string]: string }): Element;
  if(condition: boolean | (() => boolean)): Element;
  on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    handler: (event: HTMLElementEventMap[K]) => void
  ): Element;

  child(childrenFn: () => (Element | string)[]): Element;
  child(...children: (Element | string)[]): Element;

  onMount(callback: () => void): Element;
  onUnmount(callback: () => void): Element;

  mount(parent: HTMLElement): void;
  unmount(): void;

  render(): HTMLElement;
}

// Helper functions for mounting, creating, and reactivity
export declare const mount: (root: Element) => void;
export declare const create: (tag: string) => Element;
export declare const reactive: <T>(state: State<T>, renderFn: () => Element) => Element;

// State function to create a reactive state
export declare function state<T>(initialValue: T): State<T>;