import { MongoClient, type Db } from 'mongodb';

/**
 * Cached connection.
 *
 * Serverless functions are recycled constantly. Without this cache every cold
 * start would open a fresh connection pool, and Atlas M0 caps the cluster at
 * 500 connections — you would start seeing throttling within a day of real
 * traffic. Holding the promise (not the client) on the global object means
 * concurrent invocations in the same container share one in-flight connect.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'attaby';

declare global {
  // eslint-disable-next-line no-var
  var __mongo: Promise<MongoClient> | undefined;
}

let indexesReady = false;

export async function db(): Promise<Db> {
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!global.__mongo) {
    global.__mongo = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    }).connect();
  }

  const client = await global.__mongo;
  const database = client.db(dbName);

  if (!indexesReady) {
    indexesReady = true;
    // Fire and forget: TTL indexes are idempotent, and a failure here must not
    // take down a request that would otherwise succeed.
    void ensureIndexes(database).catch(() => {
      indexesReady = false;
    });
  }

  return database;
}

async function ensureIndexes(database: Db) {
  await Promise.all([
    database.collection('rate_limits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    database.collection('conversations').createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }),
    database.collection('contacts').createIndex({ createdAt: -1 }),
  ]);
}
