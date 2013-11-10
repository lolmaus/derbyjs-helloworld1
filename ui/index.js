var config = {
  filename: __filename
, styles: '../styles/ui'
, scripts: {
    connectionAlert: require('./connectionAlert'),
    codeField: require('./codeField')
  }
};

module.exports = function(app, options) {
  app.createLibrary(config, options);
};
