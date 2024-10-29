import Element from "./el";

type Subscriber<T> = (value: T) => void;

export function state<T>(initialValue: T) {
    let value = initialValue;
    const subscribers = new Set<Subscriber<T>>();
    const boundElements = new Map<Element, Set<string>>();
  
    const notify = () => {
      subscribers.forEach(subscriber => subscriber(value));
      boundElements.forEach((_, element) => {
        element.render();
      });
    };
  
    return {
      get: () => value,
  
      set: (newValue: T) => {
        if (value !== newValue) {
          value = newValue;
          notify();
        }
      },
  
      subscribe: (subscriber: Subscriber<T>) => {
        subscribers.add(subscriber);
        subscriber(value);
        return () => subscribers.delete(subscriber);
      },
  
      update: (updater: (currentValue: T) => T) => {
        const newValue = updater(value);
        if (newValue !== value) {
          value = newValue;
          notify();
        }
      },
  
      bindElement: (element: Element, prop: string = "value") => {
        if (!boundElements.has(element)) {
          boundElements.set(element, new Set());
        }
        boundElements.get(element)!.add(prop);
  
        const unbind = () => {
          const props = boundElements.get(element);
          if (props) {
            props.delete(prop);
            if (props.size === 0) {
              boundElements.delete(element);
            }
          }
        };
  
        return unbind;
      },
  
      unbindAll: () => {
        boundElements.clear();
      }
    };
  }