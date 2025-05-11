import PouchDB from 'pouchdb-browser';

const formsDB = new PouchDB('forms');
const remoteFormsDB = new PouchDB('http://admin:youradminpassword@localhost:5984/forms');

// Sync forms between PouchDB and CouchDB
formsDB.sync(remoteFormsDB, {
  live: true,
  retry: true,
}).on('change', info => {
  console.log('Sync change:', info);
}).on('error', err => {
  console.error('Sync error:', err);
});

export default formsDB;
