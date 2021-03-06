'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());

  var args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
      this.env.options.indexFile = require(path.join(process.cwd(), 'bower.json')).indexFile
    } catch (e) {}
    this.env.options.webAppPath = 'web-app;'
    this.env.options.appPath = this.env.options.appPath || 'web-app/angular/app';
    this.env.options.indexFile = this.env.options.indexFile || 'grails-app/views/index.gsp' 
  }
  this.appPath = this.env.options.appPath;

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(process.cwd() + '/' + this.appPath + '/**/*.coffee', {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  if (typeof this.env.options.minsafe === 'undefined') {
    this.option('minsafe');
    this.env.options.minsafe = this.options.minsafe;
    args.push('--minsafe');
  }

  this.hookFor('grails-angular:common', {
    args: args
  });

  this.hookFor('grails-angular:main', {
    args: args
  });

  this.hookFor('grails-angular:controller', {
    args: args
  });

  this.hookFor('grails-karma:app', {
    args: [false] // run karma hook in non-interactive mode
  });

  this.on('end', function () {
    console.log('\nI\'m all done. Just run ' + 'npm install && bower install --dev'.bold.yellow + ' to install the required dependencies.');
  });
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }, {
    name: 'compassBootstrap',
    message: 'If so, would you like to use Twitter Bootstrap for Compass (as opposed to vanilla CSS)?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }, {
    name: 'coffee',
    message: 'Would you like to use CoffeeScript',
    default: 'Y/n',
    warning: 'Yes: CoffeeScript will be used for your Angular app'
 
  }];

  this.prompt(prompts, function(err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.bootstrap = (/y/i).test(props.bootstrap);
    this.compassBootstrap = (/y/i).test(props.compassBootstrap);
    this.env.options.coffee = (/y/i).test(props.coffee);
    cb();
  }.bind(this));
};

Generator.prototype.askForModules = function askForModules () {
  var cb = this.async();

  var prompts = [{
    name: 'resourceModule',
    message: 'Would you like to include angular-resource.js?',
    default: 'Y/n',
    warning: 'Yes: angular-resource added to bower.json'
  }, {
    name: 'cookiesModule',
    message: 'Would you like to include angular-cookies.js?',
    default: 'Y/n',
    warning: 'Yes: angular-cookies added to bower.json'
  }, {
    name: 'sanitizeModule',
    message: 'Would you like to include angular-sanitize.js?',
    default: 'Y/n',
    warning: 'Yes: angular-sanitize added to bower.json'
  }];

  this.prompt(prompts, function(err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.resourceModule = (/y/i).test(props.resourceModule);
    this.cookiesModule = (/y/i).test(props.cookiesModule);
    this.sanitizeModule = (/y/i).test(props.sanitizeModule);

    cb();
  }.bind(this));
};

// Duplicated from the SASS generator, waiting a solution for #138
Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  var appPath = this.appPath;
  if (this.compassBootstrap) {
    var cb = this.async();

    this.write(path.join(appPath, 'styles/main.scss'), '@import "compass_twitter_bootstrap";');
    this.remote('vwall', 'compass-twitter-bootstrap', 'v2.2.2.2', function (err, remote) {
      if (err) {
        return cb(err);
      }
      remote.directory('stylesheets', path.join(appPath, 'styles') );
      cb();
    });
  } else if (this.bootstrap) {
    this.log.writeln('Writing compiled Bootstrap to ' + this.appPath);
    this.copy( 'bootstrap.css', path.join(appPath, 'styles/bootstrap.css') );
  }

  if (this.bootstrap || this.compassBootstrap) {
    //this.directory( 'images', 'app/images' );
  }
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.template('../../templates/common/index.html', path.join(this.appPath, 'index.html') );
};

Generator.prototype.packageFiles = function () {
  this.template( '../../templates/common/bower.json', 'bower.json' );
  this.template( '../../templates/common/package.json', 'package.json' );
  this.template( '../../templates/common/Gruntfile.js', 'Gruntfile.js' );
};
