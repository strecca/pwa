const nano = require("nano");
const couchDBUrl = process.env.COUCHDB_URL;
const couch = nano(couchDBUrl);

// Databases
const subscriptionsDB = couch.db.use("subscriptions");
const formsDB = couch.db.use("forms");
const submissionsDB = couch.db.use("submissions");

// Ensure databases exist (create them if they don't exist)
const ensureDBsExist = async () => {
    const dbs = ["subscriptions", "forms", "submissions"];
    for (const dbName of dbs) {
        const dbExists = await couch.db.list().then((dbList) => dbList.includes(dbName));
        if (!dbExists) {
            await couch.db.create(dbName);
            console.log(`Database created: ${dbName}`);
        }
    }
};

ensureDBsExist().catch((err) => console.error("Error ensuring CouchDB databases:", err));

module.exports = { subscriptionsDB, formsDB, submissionsDB };
