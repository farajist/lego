# Lego

a simplisitic callback container

## Motivation

Lego is a simple plugin system for functional modules, it creates a key/value container capable of resolving functions-as-dependencies from different paths (including `node_modules`)

## How it works ?

### Plugin definition

A plugin can be defined by adding a simple `lego.yml` file next to your callback definition with the following attributes:

```yml
version: '0.0.0'
name: 'hello' # should be unique
main: 'main.js'
```

`name` is used as a the module identifier and `main` should point to the entry point containing the callback export.

```
hello-project
│   README.md
│   main.js
│   lego.yml
```

### Using the plugin container

All that is left to do is to call the `createContainer` function with proper plugin locations:

```ts
const { resolve } = createContainer({ paths: ['node_modules', 'my_plugins'] });
// resolve performs simple callback lookup using plugin name
const sayHello = resolve('hello');
// sayHello now can be called like a normal function
console.log(sayHello());
```

## Roadmap

- [] Add container tests
- [] Provide context to loaded callbacks
- [] Support various versionning schemes
- [] Support other export types ? (classes, objects)
