import formsDB from './pouchdb-sync';

export async function fetchForms() {
  try {
    const allForms = await formsDB.allDocs({ include_docs: true });
    return allForms.rows.map(row => row.doc);
  } catch (err) {
    console.error('Error fetching forms:', err);
    throw err;
  }
}
