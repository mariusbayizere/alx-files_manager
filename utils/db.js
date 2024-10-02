import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

/**
 * Represents a MongoDB client to interact with a MongoDB database.
 * Provides methods to check connection status, retrieve user and file counts,
 * and access the `users` and `files` collections.
 */
class DBClient {
  /**
   * Initializes a new instance of the DBClient class.
   * Loads environment variables and connects to the MongoDB server.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Determines if the MongoDB client is connected to the database server.
   * @returns {boolean} True if the client is connected, otherwise false.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Returns the total number of users in the `users` collection.
   * @returns {Promise<number>} A promise that resolves to the count of users in the collection.
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Returns the total number of files in the `files` collection.
   * @returns {Promise<number>} A promise that resolves to the count of files in the collection.
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Retrieves a reference to the `users` collection in the database.
   * @returns {Promise<Collection>} A promise that resolves to the `users` collection object.
   */
  async usersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves a reference to the `files` collection in the database.
   * @returns {Promise<Collection>} A promise that resolves to the `files` collection object.
   */
  async filesCollection() {
    return this.client.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;

