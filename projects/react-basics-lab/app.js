// LESSON 1: tag, props, children
function Card (props) {
    // props = {title: "...", price: "..."}
    return React.createElement("div", {className: "card"},
      React.createElement("h3", null, props.title),
      React.createElement("p", null, "Price: $" + props.price)
    )
}

// LESSON 2: useState, setState, re-render
function App () {
    const [count, setCount] = React.useState(0);
    const [name, setName] = React.useState("");

    return React.createElement("div", {className: "app"},
      React.createElement("h1", null, "React Basics Lab"),
      React.createElement("p", null, "Count is:" + count),
      React.createElement("button", {onClick: () => setCount(count + 1)}, "Add 1"),
      React.createElement("hr", null),
      React.createElement("input", {
        placeholder: "type your name",
        value: name,
        onInput: (e) => setName(e.target.value)   // onInput not onChange in vanilla
      }),
      React.createElement("p", null, "Hello " + name),

      React.createElement("hr", null),
      React.createElement(Card, {title: "Headphone", price: 20}),
      React.createElement(Card, {title: "Mouse", price: 10})
    )
}

// LESSON 3: createRoot + root.render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App, null));