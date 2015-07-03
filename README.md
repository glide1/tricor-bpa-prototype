https://safe-basin-4405.herokuapp.com/

TRICor-BPA-prototype
====

[![Build Status](https://travis-ci.org/TRI-COR/tricor-bpa-prototype.svg)](https://travis-ci.org/TRI-COR/tricor-bpa-prototype)
[![Dependency Status](https://david-dm.org/TRI-COR/tricor-bpa-prototype.svg)](https://david-dm.org/TRI-COR/tricor-bpa-prototype)

# Prerequisites

* node version ^0.12
* npm version ^2.11

Node and npm are available on https://nodejs.org. Alternatively, use N or NVM to manage node installations.

# Installation

After cloning this project run

`> npm install <project directory>`

To run the server run

`> cd <project directory> && npm run start`

For development you probably want gulp installed.

`> npm install -g gulp`

Then run gulp from the project directory

`> gulp`

This will run the server and watchers for modifications to files.

# Development

There are a couple commands that are important to run during development process. 
* `gulp` 
  - Runs the node JS application and runs watchers that'll build and reload the server on changes.
  - Sets up watchers that'll run livereload when there are client assets have changed.
* `gulp ctest`
  - Runs continuous testing. It sets up watchers and continuous runs tests on changes.

## Open source projects used 

* [Nodejs](https://github.com/joyent/node)
* [Express](https://github.com/strongloop/express)
* [Gulp](https://github.com/gulpjs/gulp)
* [Typescript](https://github.com/Microsoft/TypeScript)
* [Bower](https://github.com/bower/bower)
* and many others


# Continuous Integration
Continuous Integration is handled by travis-ci. Details are within the .travis.yml file. Travis CI automatically runs `npm test` which is setup in *package.json*. 

# Continuous Deployment
## Heroku

Heroku setup required going through some of the steps in the [Getting Started with Node.js with Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) guide.

Main steps to follow were:
* Setup
* Prepare the app
* Define a Procfile (one is in the repo)
* Deploy the app

### Travis-CI deployment
Integrating with travis CI was done by following the [Heroku Deployment](http://docs.travis-ci.com/user/deployment/heroku/) and making appropriate edits to the .travis.yml file.

### Alternatives to Heroku for Buildpacks

* [Dokku](https://github.com/progrium/dokku)
* [Deis](http://deis.io/get-deis/)
* [Cloud Foundry](https://docs.cloudfoundry.org/buildpacks/)


## AWS OpWorks

AWS Opsworks was more involved to setup. The dependency on Node 0.12 means that the default [opsworks nodejs layer](http://docs.aws.amazon.com/opsworks/latest/userguide/workinglayers-servers.html) could not be used. There was also a requirement to use containers. So that led to:

### Setting up OpsWorks to use Docker

