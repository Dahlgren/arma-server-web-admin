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
