root    = exports ? this
cache   = null
enabled = false

level =
	ERROR: 'error'
	WARNING: 'warning'
	INFO: 'info'
	DEBUG: 'debug'
	LOG: 'log'

Logger = ->
	Logger.make()

if exports?
	module.exports = Logger if module? and module.exports

	root.Logger = Logger
else
	root.Javie = {} unless root.Javie?
	root.Javie.Logger = Logger

array_make = (args) ->
	Array.prototype.slice.call(args)

dispatch = (type, message) ->
	return false unless enabled
	post(type, message)

post = (type, message) ->
	c = console
	switch type
		when 'info'
			c.info(message)
			true
		when 'debug' and c.debug?
			c.debug(message)
			true
		when 'warning'
			c.warn(message)
			true
		when 'error' and c.error?
			c.error(message)
			true
		when 'log'
			c.log(message)
			true
		else
			c.log("[#{type.toUpperCase()}]", message)
			true

class Dispatcher
	logs: []
	dispatch: (type, message) ->
		result = dispatch(type, message)

		message.unshift(type)
		@logs.push(message)

		result
	info: ->
		@dispatch(level.INFO, array_make(arguments))
	debug: ->
		@dispatch(level.DEBUG, array_make(arguments))
	warning: ->
		@dispatch(level.WARNING, array_make(arguments))
	log: ->
		@dispatch(level.LOG, array_make(arguments))
	post: (type, message) ->
		@dispatch(type, [message])

Logger.enable = ->
	enabled = true

Logger.disable = ->
	enabled = false

Logger.status = ->
	enabled

Logger.make = ->
	cache = new Dispatcher unless cache?
	cache
