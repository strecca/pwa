const nano = require("nano");

// CouchDB configuration
const couchDBUrl = process.env.COUCHDB_URL || "http://localhost:5984";
const couch = nano({
  url: couchDBUrl,
  requestDefaults: {
    auth: {
      user: process.env.COUCHDB_USER || "admin", // Default username
      pass: process.env.COUCHDB_PASSWORD || "MavieDog5", // Default password
    },
  },
});

// Databases to manage
const databases = {
  subscriptionsDB: process.env.COUCHDB_SUBSCRIPTIONS_DB || "subscriptions",
  formsDB: process.env.COUCHDB_FORMS_DB || "forms",
  submissionsDB: process.env.COUCHDB_SUBMISSIONS_DB || "submissions",
};

// Exports for database instances
const dbInstances = {
  subscriptionsDB: couch.db.use(databases.subscriptionsDB),
  formsDB: couch.db.use(databases.formsDB),
  submissionsDB: couch.db.use(databases.submissionsDB),
};

// Validate CouchDB Connection
const validateConnection = async () => {
  try {
    const info = await couch.info(); // Validate connection by fetching CouchDB server info
    console.log("Connected to CouchDB:", info);
  } catch (err) {
    console.error("Error connecting to CouchDB. Please verify your CouchDB URL and credentials.", err);
    throw err;
  }
};

// Ensure databases exist (create them if they don't exist)
const ensureDBsExist = async () => {
  try {
    const dbList = await couch.db.list();
    for (const [key, dbName] of Object.entries(databases)) {
      if (!dbList.includes(dbName)) {
        await couch.db.create(dbName);
        console.log(`Database created: ${dbName}`);
      } else {
        console.log(`Database already exists: ${dbName}`);
      }
    }
  } catch (err) {
    console.error("Error ensuring databases exist:", err);
    throw err;
  }
};

// Initialize CouchDB
const initializeCouchDB = async () => {
  try {
    console.log("Initializing CouchDB...");
    await validateConnection();
    await ensureDBsExist();
    console.log("CouchDB initialization complete.");
  } catch (err) {
    console.error("CouchDB initialization failed:", err);
    process.exit(1); // Exit the process if CouchDB initialization fails
  }
};

// Automatically initialize CouchDB when this module is loaded
initializeCouchDB().catch((err) => {
  console.error("Unhandled error during CouchDB initialization:", err);
  process.exit(1);
});

module.exports = { ...dbInstances };