import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const localDB = new PouchDB('form-pwa');
const remoteDB = new PouchDB('http://localhost:5984/form-pwa'); // CouchDB URL

// Sync local PouchDB with CouchDB
localDB.sync(remoteDB, {
  live: true,
  retry: true,
});

export default localDB;