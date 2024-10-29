import Element from "./el";

export const mount = (root: Element): void => {
    const rootEl = root.render();
    document.body.appendChild(rootEl);
}

export const create = (tag: string): Element => {
    return new Element(tag);
}

export const reactive = (state: any, renderFn: () => Element): Element => {
    const element = renderFn();
    state.bindElement(element);
    return element;
}