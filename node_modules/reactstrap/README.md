[![reactstrap](https://cloud.githubusercontent.com/assets/399776/13906899/1de62f0c-ee9f-11e5-95c0-c515fee8e918.png)](https://reactstrap.github.io)

[![Build Status](https://travis-ci.org/reactstrap/reactstrap.svg?branch=master)](https://travis-ci.org/reactstrap/reactstrap) [![Coverage Status](https://coveralls.io/repos/github/reactstrap/reactstrap/badge.svg?branch=master)](https://coveralls.io/github/reactstrap/reactstrap?branch=master)

# reactstrap

Stateless React Components for Bootstrap 4.

## Getting Started

Follow the [create-react-app instructions](https://github.com/facebookincubator/create-react-app#getting-started) up to the `Adding Bootstrap` section and instead follow the reactstrap version of [adding bootstrap](#adding-bootstrap).

### tl;dr

```
npm install -g create-react-app

create-react-app my-app
cd my-app/
npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app. The initial structure of your app is setup. Next, let's [add reactstrap and bootstrap](#adding-bootstrap).

### Adding Bootstrap

Install reactstrap and Bootstrap from NPM. Reactstrap does not include Bootstrap CSS so this needs to be installed as well:

```
npm install bootstrap@4.0.0-alpha.6 --save
npm install --save reactstrap react-transition-group react react-dom
```

Import Bootstrap CSS in the ```src/index.js``` file:

```js
import 'bootstrap/dist/css/bootstrap.css';
```

Import required reactstrap components within ```src/App.js``` file or your custom component files:

```js
import { Button } from 'reactstrap';
```

Now you are ready to use the imported reactstrap components within your component hierarchy defined in the render method. Here is an example [`App.js`](https://gist.github.com/eddywashere/e13033c0e655ab7cda995f8bc77ce40d) redone using reactstrap.

## About the Project

This library contains React Bootstrap 4 components that favor composition and control. The library does not depend on jQuery or Bootstrap javascript. However, [Tether](http://tether.io/) is relied upon for advanced positioning of content like Tooltips, Popovers, and auto-flipping Dropdowns.

There are a few core concepts to understand in order to make the most out of this library.

1. Your content is expected to be composed via props.children rather than using named props to pass in Components.

    ```js
    // Content passed in via props
    const Example = (props) => {
      return (
        <p>This is a tooltip <TooltipTrigger tooltip={TooltipContent}>example</TooltipTrigger>!</p>
      );
    }

    // Content passed in as children (Preferred)
    const PreferredExample = (props) => {
      return (
        <p>
          This is a <a href="#" id="TooltipExample">tooltip</a> example.
          <Tooltip target="TooltipExample">
            <TooltipContent/>
          </Tooltip>
        </p>
      );
    }
    ```

2. Attributes in this library are used to pass in state, conveniently apply modifier classes, enable advanced functionality (like tether), or automatically include non-content based elements.

    Examples:

    - `isOpen` - current state for items like dropdown, popover, tooltip
    - `toggle` - callback for toggling `isOpen` in the controlling component
    - `color` - applies color classes, ex: `<Button color="danger"/>`
    - `size` - for controlling size classes. ex: `<Button size="sm"/>`
    - `tag` - customize component output by passing in an element name or Component
    - boolean based props (attributes) when possible for alternative style classes or `sr-only` content


## [Documentation](https://reactstrap.github.io)

https://reactstrap.github.io

## [Contributing](CONTRIBUTING.md)

## Development

Install dependencies:

```sh
npm install
```

Run examples at [http://localhost:8080/](http://localhost:8080/) with webpack dev server:

```sh
npm start
```

Run tests & coverage report:

```sh
npm test
```

Watch tests:

```sh
npm run test-watch
```

## In the wild

Organizations and projects using `reactstrap`

- [availity-reactstrap-validation](https://availity.github.io/availity-reactstrap-validation/)
- [component-template](https://reactstrap.github.io/component-template/)
- [video-react](https://video-react.github.io/)
- [CoreUI-Free-Bootstrap-Admin-Template](https://github.com/mrholek/CoreUI-Free-Bootstrap-Admin-Template) - [demo](http://coreui.io/demo/React_Demo/#/)

Submit a PR to add to this list!

Looking to build, document and publish reusable components built on top of `reactstrap`? Consider forking https://github.com/reactstrap/component-template to kickstart your project!
