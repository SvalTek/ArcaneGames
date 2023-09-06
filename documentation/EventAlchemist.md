# EventAlchemist

Welcome to the EventAlchemist library, a powerful tool for managing events and event namespaces in your TypeScript projects. With EventAlchemist, you can weave the magic of event-driven programming into your code effortlessly.

## Table of Contents

- [EventAlchemist](#eventalchemist)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
    - [Decorating Classes](#decorating-classes)
    - [Decorating Methods](#decorating-methods)
    - [Example](#example)
    - [Creating Event Namespaces](#creating-event-namespaces)
  - [Testing](#testing)
  - [Contributing](#contributing)


## Usage

1. Import the necessary components in your code:

   ```typescript
   import { EventAlchemy, EventElixer, Eventful } from '@libs/EventAlchemist';
   ```

### Decorating Classes

To make a class capable of emitting events, decorate it with the `@EventAlchemy` decorator:
_**Note:** The `@EventAlchemy` decorator will automatically create a new event namespace if one with the specified name does not already exist._
_**Note:** The `@EventAlchemy` decorator must be applied to the class before any `@EventElixer` decorators are applied to methods within the class._

```typescript
@EventAlchemy('myNamespace', 'Optional Description')
class MyClass implements Eventful {
  // ...
}
```

### Decorating Methods

Decorate methods within a class with `@EventElixer` to make them emit events:

```typescript
@EventElixer('eventName', (result, ...args) => {
  // Modify the result or perform other actions here
  return result;
}, 'additionalArg1', 'additionalArg2')
myMethod(arg1, arg2) {
  // Your method logic here
}
```

### Example

Here's an example of how you can use EventAlchemist:

```typescript
import { EventAlchemy, EventElixer, Eventful } from '@libs/EventAlchemist';

@EventAlchemy('myNamespace')
class MyClass implements Eventful {
  @EventElixer('myEvent')
  myMethod(arg1, arg2) {
    // Your method logic here
  }
}

const instance = new MyClass();
instance.events.on('myEvent', (result, ...args) => {
  // Handle the emitted event here
});

instance.myMethod('arg1', 'arg2'); // This will emit the 'myEvent' event
```

### Creating Event Namespaces

Event namespaces are essential for organizing and categorizing events. You can create a new event namespace using the `createEventNamespace` method:
_**Note:** Namespaces MUST be unique. Attempting to create a namespace with a name that already exists will throw an error._
_**Note:** The `createEventNamespace` method will automatically create a new event namespace if one with the specified name does not already exist._

```typescript
import { EventAlchemist } from '@libs/EventAlchemist';
const eventEmitter = EventAlchemist.createEventNamespace('myNamespace', 'Optional Description');
```


## Testing

We've included a set of tests using Jest to ensure the reliability of EventAlchemist. To run the tests, use the following command:

```bash
npm test
```

## Contributing

We welcome contributions from fellow adventurers in the digital realm. If you have ideas, bug reports, or enhancements, please submit a pull request or open an issue on our GitHub repository.
