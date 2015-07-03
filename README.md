https://safe-basin-4405.herokuapp.com/
http://52.4.102.54/
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
* and many others in package.json and bower.json


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

The main source of how to get OpsWorks and Docker running came from an [AWS blog post](https://blogs.aws.amazon.com/application-management/post/Tx2FPK7NJS5AQC5/Running-Docker-on-AWS-OpsWorks). There were some [chef recipes on github](https://github.com/coryflucas/opsworks-docker) that were modified with the installation code from the blog post. The result is in a [forked git repository](https://github.com/TRI-COR/opsworks-docker) that is used as a custom recipe source in AWS OpsWorks.

#### Setting up OpsWorks

1. Create a stack
2. Create a Layer following the opsworks-docker readme (the Berkshelf version is very important) with the following changes:
  * The short name needs to be "docker"
  * Under Add a Layer > Recipes > Deploy: owdocker::docker-image-deploy is replaced with owdocker::docker-deploy.
3. Create an App
  * Use "Other" as the type
  * Set the App source type to Git
  * Set the repository url to https://github.com/TRI-COR/tricor-bpa-prototype
  * Setup environment variables. They should match up with what's in the AWS blog post above. E.g.
    * layer : docker
    * service_port : 80
    * container_port : 3000
4. Add an instance to the "docker" layer:
  * The instance type is mostly defaults except for the size. Ended up using c3.large instance. The smaller instances may not run well.

#### Travis CI and OpsWorks

Integrating with Travis CI was done following [OpsWorks deployment on Travis CI](http://docs.travis-ci.com/user/deployment/opsworks/). One special note is that the app-id is the OpsWorks ID of the App that was created in Step 3 above (it is a UUID).