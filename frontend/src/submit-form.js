import PouchDB from 'pouchdb-browser';

const submissionsDB = new PouchDB('submissions');
const remoteSubmissionsDB = new PouchDB('http://admin:youradminpassword@localhost:5984/submissions');

// Sync submissions between PouchDB and CouchDB
submissionsDB.sync(remoteSubmissionsDB, {
  live: true,
  retry: true,
}).on('change', info => {
  console.log('Sync change:', info);
}).on('error', err => {
  console.error('Sync error:', err);
});

export async function submitForm(formId, formData) {
  try {
    const submission = {
      _id: new Date().toISOString(),
      formId,
      formData,
      submittedAt: new Date(),
    };

    await submissionsDB.put(submission);
    console.log('Form submission saved locally');
  } catch (err) {
    console.error('Error submitting form:', err);
    throw err;
  }
}
