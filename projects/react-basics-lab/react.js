// Global Memory for useState
let states = [];
let stateIndex = 0;

function createElement (tag, props, ...children) {
    // tag = "div" or "button" or function
    // props = {class: "card", onClick: () =>...}
    // children = what's inside: text or other elements
    // flat() = flatten nested arrays so [[div], div] becomes [div, div]
    return {tag, props: props || {}, children: children.flat()}
}

function useState (initialValue) {
    let currentIndex = stateIndex;
    if (states[currentIndex] === undefined) {
        states[currentIndex] = initialValue   // first time, save it
    }
    function setState(newValue) {
        states[currentIndex] = newValue;   // update memory
        stateIndex = 0;   // reset for next render
        rootRender();     // re-paint everything
    }
    stateIndex++;
    return [states[currentIndex], setState];
}

function render (element, container) {
    if (typeof element === "string" || typeof element === "number") {
        container.appendChild(document.createTextNode(element));
        return;
    }
    if (typeof element.tag === "function") {
        const componentResult = element.tag(element.props);
        render(componentResult, container);
        return;
    }
    const dom = document.createElement(element.tag);
    // Loop props
    for (let name in element.props) {
        let value = element.props[name];
        if (name.startsWith("on")) {
            // startsWith("on") means it's event: onClick -> click
            dom.addEventListener(name.toLowerCase().substring(2), value);
        } else if (name === "className") {
            dom.className = value;
        } else {
            dom.setAttribute(name, value);
        }
    }
    element.children.forEach(child => render(child, dom));
    container.appendChild(dom);
}

let rootContainer = null;
let rootComponent = null;

function createRoot (container) {
    // createRoot = find the #root div in HTML
    rootContainer = container;
    return {
        render: function (component) {
            // root.render() = remember what to render and paint it
            rootComponent = component;
            rootRender();
        }
    }
}

function rootRender () {
    if (!rootContainer || !rootComponent) return;
    rootContainer.innerHTML = ""  // clear
    stateIndex = 0;   // reset hook counter
    render(rootComponent, rootContainer);
}

// Make global like React 
window.React = {createElement, useState};
window.ReactDOM = {createRoot};    // ReactDOM is just object that holds createRoot