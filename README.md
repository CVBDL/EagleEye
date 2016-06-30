# EagleEye Application

[![Join the chat at https://gitter.im/CVBDL](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CVBDL)

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Installation

* Install Git (https://git-scm.com/download/win)
* Install Node.js (https://nodejs.org/dist/v4.4.5/node-v4.4.5-x64.msi)
* Install Ruby (http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.4-x64.exe)
* Install the compass gem:

> Note: You may need to add `C:\Ruby22-x64\bin` to system path.

```sh
gem install compass
```

* Install `yo`, `grunt-cli`, `bower`, `generator-angular` and `generator-karma`:

```sh
npm install -g grunt-cli bower yo generator-karma generator-angular
```

* Install application packages:

```sh
npm install
```

```sh
bower install
```

## Build & development

```sh
# Build the project
grunt
```

```sh
# Preview the application in browser
grunt serve
```


## Testing

Running `grunt test` will run the unit tests with karma.
