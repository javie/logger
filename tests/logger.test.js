describe('Javie.Logger', function () {
	var Logger, l;

	Logger = require(__dirname+'/../logger.js');
	l      = Logger.make();
	
	it('should return status true when Logger is enabled', function (done) {
		Logger.enable();

		if (Logger.status() === true) {
			done();
		}
	});

	it('should return status false when Logger is disabled', function (done) {
		Logger.disable();

		if (Logger.status() === false) {
			done();
		}
	});
});