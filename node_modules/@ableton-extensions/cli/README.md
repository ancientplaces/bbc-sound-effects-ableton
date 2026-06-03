# @ableton-extensions/cli

CLI for developing, running, and packaging Ableton Live extensions built with
`@ableton-extensions/sdk`.

The SDK is currently in beta and is **not published to npm**. It is distributed
as a zip from Centercode containing everything you need to build extensions:
the SDK and CLI packages, an extension generator, and official documentation.

Requires Node.js 24.14.1 or newer.

## Commands

```
extensions-cli run [dir]        Run the extension in Live's Extension Host
                                  --live <path>          override EXTENSION_HOST_PATH environment variable
                                  --storage-directory <path>
                                  --temp-directory <path>
                                  --inspect              attach VS Code debugger

extensions-cli package [dir]    Build a .ablx archive
                                  -o, --output <path>
                                  -i, --include <p...>
```

`run` reads `EXTENSION_HOST_PATH` from the environment or a `.env` file in the
extension directory. The path can point at:

- the `ExtensionHostNodeModule.node` file itself.

Learn about finding the location of `ExtensionHostNodeModule.node` in the
bundled docs.

## Scaffolding

To start a new extension from scratch, use the project creator
(`@ableton-extensions/create-extension`) included in the distribution zip. See
the Quick Start in the bundled docs for the full flow.
