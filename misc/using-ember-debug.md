## Functions

### `app: function([name])`

Returns the named application. `name` defaults to `main`.

### `routes: function()`

Returns the names of all routes.

### `route: function([name])`

Returns the named route. `name` defaults to the current route.

### `router: function([name])`

Returns the named router instance. `name` defaults to `main`.

### `model: function([name])`

Returns the model for the named controller. `name` defaults to the the current route.

### `view: function(idOrDomElement)`

Return the View instance with the specified id e.g. `ember352`. If an object
is provided (such as a DOM element) then the `id` property of the object will be
used.

### `controller: function([name])`

Returns the named controller. `name` defaults to the current route.

### `log: function(promise[, property[, getEach]])`

Resolves the `promise` and logs the resolved value using `console.log`.
Also sets `window.$E` to the resolved value so you can access it in the dev
tools console.

If `property` is specified then `$E.get(property)` will be logged.

If `getEach` is true then `$E.getEach(property)` will be logged.

#### Examples:

```
> log(store.find('organisation')) => undefined
> $E.get('length') => 3
> log(store.find('organisation'), 'length') => 3
> log(store.find('organisation'), 'name', true) => array of names
```

### `className: function(object)`

Returns the class name of the object.

### `registry`

Returns the hash of objects in the `container` registry.

### `lookup: function(name)`

Performs a lookup for the named entry in the `container`, which will in turn
ask its `resolver` if it's not found.

### `lookupFactory: function(name)`

Performs a lookup for the named factory (as opposed to a new instance) in the `container`,
which will in turn ask its `resolver` if it's not found.

### `containerNameFor: function(obj)`

Searches the `container` registry to find the name for the specified object
(if any).

### `templates()`

Returns the keys of all the `Ember.TEMPLATES`.

### `inspect`

Does what it says, in a manner of speaking. Alias to `Ember.inspect`.

### `logResolver: function(bool = true)`

Switch logging for the resolver on or off.

### `logAll: function(bool = true)`

Switch logging for all the things on/off.

### `globalize: function()`

Attach all of these useful functions to the `window` object (eww!) - useful
for accessing in the console.

### `store`

The Ember Data `Store`.

### `typeMaps`

The Ember Data 'type map'.
