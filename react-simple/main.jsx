function createElement(type, props, ...children) {
  if (typeof type === 'function') {
    return type({ ...props, children });
  }

  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type);

  Object.keys(element.props)
    .filter((propKey) => propKey !== 'children')
    .forEach((propKey) => {
      dom[propKey] = element.props[propKey];
    });

  element.props.children.forEach((child) => {
    render(child, dom);
  });

  container.appendChild(dom);
}

const states = [];
let stateIndex = 0;

function useState(initialState) {
  console.log(states);
  const localStateIndex = stateIndex;
  states[localStateIndex] = states[localStateIndex] || initialState;
  const setState = (newState) => {
    states[localStateIndex] = newState;
    rerender();
  };

  stateIndex++;
  return [states[localStateIndex], setState];
}

const React = {
  createElement,
  useState,
};

const ReactDOM = {
  render,
};

function rerender() {
  stateIndex = 0;
  document.getElementById('app').firstChild.remove();
  ReactDOM.render(<App />, container);
}

const App = () => {
  const [countOne, setCountOne] = useState(0);
  const [countTwo, setCountTwo] = useState(0);

  return (
    <div title="foo" className="test" style="background: pink">
      <h1>Count One {countOne}</h1>
      <button onclick={() => setCountOne(countOne + 1)}>+</button>
      <button onclick={() => setCountOne(countOne - 1)}>-</button>
      <h1>Count Two {countTwo}</h1>
      <button onclick={() => setCountTwo(countTwo + 1)}>+</button>
      <button onclick={() => setCountTwo(countTwo - 1)}>-</button>
    </div>
  );
};

const container = document.getElementById('app');
ReactDOM.render(<App />, container);
