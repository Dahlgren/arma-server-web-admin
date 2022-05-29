# Arma Server Admin

[![Build Status](https://travis-ci.org/Dahlgren/arma-server-web-admin.svg?branch=master)](https://travis-ci.org/Dahlgren/arma-server-web-admin)

A simple to use web admin panel for Arma servers.

[Screenshots](http://imgur.com/a/Xod6U)

## Features

- Create multiple instances of game servers in the same admin panel
- See server status queryed from the instances with current mission and players
- Download game logs
- Upload missions from your local computer and from Steam Workshop to the server
- Download and update mods from withSIX

## Requirements

- Node.js, https://nodejs.org/
- Pre-installed Arma Server

## Supported Platforms

- Windows
- Linux
- Linux with Windows binary using Wine

## Supported Games

- arma1
- arma2
- arma2oa
- arma3
- arma3_x64
- cwa (does not support linux)
- ofp
- ofpresistance
- reforger

## Config

Key | Description
--- | ---
game | Which game server to launch, see above
path | Folder path to game server
port | Web port to use
host | IP or Hostname to listen on
type | Which kind of server to use, can be 'linux', 'windows' or 'wine'
additionalConfigurationOptions | Additional configuration options appended to server.cfg file
parameters | Extra startup parameters added to servers and headless clients
serverMods | Mods that always and only will be used by the game servers
auth | If both username and password is set, HTTP Basic Auth will be used
prefix | Text prepended to all game servers name
suffix | Text appended to all game servers name

## How to Use

1. Copy `config.js.example` to `config.js`

2. Change values in `config.js` as described above or in the file

3. Install all dependencies with `npm install`

4. Launch the web UI with `npm start` or install as a Windows Service with `npm run install-windows-service`

## System Configuration

### Windows

Make sure to disable Windows Error Reporting or server control will be stuck on a server crash.

Install as a Windows Service with `npm run install-windows-service`.

Remove previously installed Windows Service with `npm run uninstall-windows-service`.

### Wine

Make sure to disable Wine GUI Crash Dialog or server control will be stuck on a server crash.
This is easiest solved using `winetricks` by running `winetricks nocrashdialog`.
It can also be disabled manually.
[Read more at Wine FAQ](http://wiki.winehq.org/FAQ#head-c857c433cf9fc1dcd90b8369ef75c325483c91d6).

## Docker

### Example

To host an Arma 3 x64 server with an existing Arma 3 Server install in subfolder `arma3` with persisted profiles in `profiles` and shared network with host,

```sh
mkdir -p arma3 profiles
touch servers.json
docker run \
  --network=host \
  --env GAME_TYPE=arma3_x64 \
  --env GAME_PATH=/arma3 \
  --volume $PWD/arma3:/arma3 \
  --volume $PWD/servers.json:/app/servers.json \
  --volume $PWD/profiles:"/root/.local/share/Arma 3 - Other Profiles" \
  dahlgren/arma-server-web-admin
```

### Required setup

Mount a preinstalled Arma server folder to the container, currently only the linux server is supported.
Set GAME_TYPE to your desired arma server, for example `--env GAME_TYPE=arma3` or `--env GAME_TYPE=arma3_x64`.
Set GAME_PATH to your mounted volume, for example `--env GAME_PATH=/arma3` and `--volume $PWD/arma3:/arma3`.

### Networking
Host preferably needs to share network with the container or all game ports used will need to be forwarded to the container.
Use `--network=host` to use same network as the host machine.

Web Admin UI is available at port 3000.
If you use `--network=host` you can reach the web ui at `http://localhost:3000` by default.

### Persistence

#### Servers

Mount a file at `/app/servers.json` to persist the servers config.
For example `--volume $PWD/servers.json:/app/servers.json` to use a file named `servers.json` in current folder as persistent servers config file.

#### Profiles

If you need to persist the server profiles such as vars file make sure to mount a volume.
For Arma 3 the default profiles directory will be located at `/root/.local/share/Arma 3 - Other Profiles`

### Environment Variables

Key | Description
--- | ---
GAME_PATH | Required. Absolute folder path to game server in docker container
GAME_TYPE | Required. Type of game server, see above
AUTH_USERNAME | Username used for HTTP Basic Auth
AUTH_PASSWORD | Password used for HTTP Basic Auth
SERVER_ADMINS | Steam IDs that should be set as admins
SERVER_ADDITIONAL_CONFIG | Additional content to add into server.cfg
SERVER_MODS | Mods to be loaded as server side only mods
SERVER_PARAMETERS | Additional parameters to pass on server launch
SERVER_PREFIX | Prefix on all server names
SERVER_SUFFIX | Suffix on all server names
