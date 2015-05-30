# Arma Server Admin

## Requirements

- Node.js, https://nodejs.org/
- Pre-installed Arma Server

## Supported Games

- arma1
- arma2
- arma2oa
- arma3
- cwa (does not support linux)
- ofp
- ofpresistance

## Config

Key | Description
--- | --- | ---
game | Which game server to launch, see above
path | Folder path to game server
port | Web port to use
host | IP or Hostname to listen on
type | Which kind of server to use, can be 'linux', 'windows' or 'wine'
auth | If both username and password is set, HTTP Basic Auth will be used

## How to Use

1. Copy `config.js.example` to `config.js`

2. Change values in `config.js` as described above or in the file

3. Install all dependencies with `npm install`

4. Launch the web UI with `npm start`

## System Configuration

### Windows

Make sure to disable Windows Error Reporting or server control will be stuck on a server crash.

### Wine

Make sure to disable Wine GUI Crash Dialog or server control will be stuck on a server crash.
This is easiest solved using `winetricks` by running `winetricks nocrashdialog`.
It can also be disabled manually.
[Read more at Wine FAQ](http://wiki.winehq.org/FAQ#head-c857c433cf9fc1dcd90b8369ef75c325483c91d6).
