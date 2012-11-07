/**
 * Client-side and Node.js Logger Helper
 * ==========================================================
 *
 * @package     Javie
 * @require     underscore, console
 * @since       0.1
 * @author      Mior Muhammad Zaki <https://github.com/crynobone>
 * @license     MIT License
 */

(function (console) { 'use strict';

	var root, Logger, _, cache;

	// Save a reference to global object (`window` in the browser, `global` on the server)
	root   = this;

	// Create a safe reference to the Logger object for use below.
	Logger = {};

	// Export the object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `Profiler` as a global object via a string identifier,
	// for Closure Compiler "advanced" mode.
	if ('undefined' !== typeof exports) {
		if ('undefined' !== typeof module && module.exports) {
			exports = module.exports = Logger;
		}

		exports.Logger = Logger;
	}
	else {
		// Register Javie namespace if it's not available yet. 
		if ('undefined' === typeof root.Javie) {
			root.Javie = {};
		}

		root.Javie.Logger = Logger;
	}

	// load all dependencies
	_ = root._;

	// Require Underscore, if we're on the server, and it's not already present.
	if (!_ && ('undefined' !== typeof require)) {
		_ = require('underscore');
	}

	// throw an error if underscore still not available
	if (!_) {
		throw new Error('Expected Underscore.js not available');
	}

	// turn arguments into array
	function makeArray (args) {
		return Array.prototype.slice.call(args);
	}

	/**
	* Allow no conflict for Logger
	*
	* @return {object} Logger
	*/
	Logger.noConflict = function noConflict() {
		root.Logger = previous;
		return this;
	};

	// To allow client-side logging (default to false)
	Logger.enabled = false;

	// constants
	Logger.ERROR   = 'error';
	Logger.WARNING = 'warning';
	Logger.INFO    = 'info';
	Logger.DEBUG   = 'debug';
	Logger.LOG     = 'log';

	// Enable Logger to run in this environment
	Logger.enable = function enable () {
		this.enabled = true;
	};

	// Disable Logger to run in this environment
	Logger.disable = function disable () {
		this.enabled = false;
	};

	// Get Logger enabled status
	Logger.status = function status () {
		return this.enabled;
	};

	Logger.make = function make () {
		var self, post;

		// return instance from cache
		if (!_.isNull(cache) && !_.isUndefined(cache)) {
			return cache;
		}

		self = this;

		// Post message using console.log
		post = function post (type, message) {
			var args;

			if (self.enabled === false) {
				return null;
			}

			args = makeArray(arguments);
			type = args.shift();

			// if there only one index, set output to single string
			if (args.length === 1) {
				args = args[0];
			}

			switch (type) {
			case 'info':
				console.info(args);
				break;
			case 'debug':
				console.debug(args);
				break;
			case 'warning':
				console.warn(args);
				break;
			case 'error':
				console.error(args);
				break;
			case 'log':
				console.log(args);
				break;
			default:
				console.log('[' + type.toUpperCase() + ']', args);
				break;
			}
		};

		cache = {
			// List of cached logs
			logs: [],

			/**
			* log marked as info
			*/
			info: function info () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.INFO);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked as debug
			*/
			debug: function debug () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.DEBUG);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked as error
			*/
			warning: function warning () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.WARNING);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked as error
			*/
			error: function error () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.ERROR);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked other than error, debug or info
			*/
			log: function log () {
				var args;

				args = makeArray(arguments);
				args.unshift(self.LOG);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			},

			/**
			* log marked other than error, debug or info (with log type as first parameter)
			*/
			post: function post () {
				var args;

				args = makeArray(arguments);

				this.logs.push(args);
				post.apply(this, args);

				return this;
			}
		};

		return cache;
	};

}).call(this);