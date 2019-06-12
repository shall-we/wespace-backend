var ShareDB = require('sharedb');
ShareDB.types.register(require('rich-text').type);

module.exports = new ShareDB({
  db: require('sharedb-mongo')(process.env.MONGODB_URI || 'mongodb://wespace:wespace@15.164.154.155:27983/quill-test?auto_reconnect=true')
});
