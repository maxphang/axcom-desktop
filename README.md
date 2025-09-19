# axcom-desktop

## Building a Windows executable

1. Install the dependencies with a Node.js version that matches Electron 13 (Node 14 or 16 are recommended because they ship prebuilt binaries for the native `serialport` module).
2. Run `npm install` inside the project root.
3. Execute `npm run dist` to produce a distributable installer using `electron-builder`.

The packaged installer (`.exe`) is written to the `out/` directory. When building from Linux or macOS you will also need a working Wine/Mono environment so that `electron-builder` can produce Windows binaries.

## Configuration file location

The application now keeps its `config.json` file inside Electron's user data directory so that packaged builds can create and update the file without requiring elevated permissions.

- **Windows:** `%APPDATA%/AXWMS-Desktop/config.json`
- **macOS:** `~/Library/Application Support/AXWMS-Desktop/config.json`
- **Linux:** `~/.config/AXWMS-Desktop/config.json`

When upgrading, any existing `config.json` file that lives alongside the application sources will be migrated to the new location automatically the next time the app starts.
