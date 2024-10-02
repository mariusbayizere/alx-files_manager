import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client for interacting with a Redis data store.
 * Provides methods for checking connection status, retrieving, storing, 
 * and deleting key-value pairs from Redis.
 */
class RedisClient {
  /**
   * Initializes a new instance of the RedisClient class.
   * Sets up event listeners to monitor the client's connection status.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;

    // Listen for connection errors and update the connection status accordingly
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });

    // Set the connection status to true once the client connects successfully
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Determines whether the Redis client is currently connected to the server.
   * @returns {boolean} True if the client is connected, otherwise false.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value associated with a specified key from Redis.
   * @param {string} key - The key whose value should be retrieved.
   * @returns {Promise<string | Object>} - A promise resolving to the value 
   *     stored in Redis for the given key, or null if the key does not exist.
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key-value pair in Redis with an expiration time.
   * @param {string} key - The key under which the value will be stored.
   * @param {string | number | boolean} value - The value to store. It will be converted to a string if necessary.
   * @param {number} duration - The time-to-live (TTL) of the key in seconds before it expires.
   * @returns {Promise<void>} - A promise that resolves once the key-value pair is stored.
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Deletes a key and its associated value from Redis.
   * @param {string} key - The key to be removed from Redis.
   * @returns {Promise<void>} - A promise that resolves once the key is deleted.
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
