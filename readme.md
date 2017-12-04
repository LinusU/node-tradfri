# Node.js Trådfri library

Controll Trådfri Smart Bulbs with Node.js

## Installation

```sh
npm install --save tradfri
```

## Usage

### Importing library

```js
const Tradfri = require('tradfri')
```

### Setting up identiy

When connecting to a new gateway, a one time setup of a new identity is needed.

```js
// The IP address of the gateway
const ip = '10.0.0.8'

// The code on the back of the gateway
const code = 'jrzig5WPzec71IZN'

Tradfri.createIdentity(ip, code).then((result) => {
  // Store result.identity and result.preSharedKey for later use
})
```

### Controlling light bulbs

```js
// The IP address of the gateway
const ip = '10.0.0.8'

// The previously savied identity
const identity = 'ab452750c31b4bad85873ab0dadf062b'
const preSharedKey = 'eQG5fURURkCcTPlc'

// Create the client
const client = new Tradfri(ip, identity, preSharedKey)

// Turn on the kitchen lights
client.putGroup(150284, { on: true, color: 'f1e0b5', brightness: 203 })
```

## API

### `Tradfri.createIdentity(ip, code)`

Register a new identity with the gateway.

- `ip` (string) The ip address of the gateway
- `code` (string) The code on the back of the gateway

### `new Tradfri(ip, identity, preSharedKey)`

Create a new Trådfri client.

- `ip` (string) The ip address of the gateway
- `identity` (string) The previously generated identity
- `preSharedKey` (string) The previously generated pre shared key

### `Trafri#listGroupIds() => Promise<string[]>`

Return a list of all group ids.

### `Tradfri#getGroup(id: string) => Promise<GroupInfo>`

Get information about a specific group.

- `id` (string) The id of the group

The returned information:

- `id` (string) The id of the group
- `name` (string) The human readable name of the group
- `deviceIds` (string[]) List of ids of the devices connected to this group
- `on` (boolean) Wether the bulbs in this group is turned on or not

### `Tradfri#getDevice(id: string) => Promise<DeviceInfo>`

Get information about a specific device.

- `id` (string) The id of the device

The returned information:

- `id` (string) The id of the device
- `name` (string) The human readable name of the device
- `type` **FIXME**

If the device is a bulb, the following properties also exists:

- `on` (boolean) Wether the bulb is turned on or not
- `color` (string) The current color of the bulb
- `brightness` (number) The current brightness of the bulb (0-255 inclusively)

### `Tradfri#putGroup(id: string, patch: GroupPatch) => Promise<void>`

Update the state of a group. All properties of the `patch` are optional, and only the ones present will be updated.

- `id` (string) The id of the group
- `patch` (object)
  - `on` (boolean) Wether the bulbs in this group should be turned on or not
  - `color` (string) The new color of the bulbs
  - `brightness` (number) The new brightness of the bulbs (0-255 inclusively)
  - `transitionTime` (number) Number of milliseconds during which to transition into the new state (maximum resolution is one tenth of a second)
