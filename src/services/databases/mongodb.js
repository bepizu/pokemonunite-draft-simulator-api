const { MongoClient, ObjectId } = require('mongodb');
const environment = require('../../config/environment');

const IndexType = ObjectId;

const mongoDbUri = environment.MONGODB_URI;
const MONGODB_DATABASE = environment.MONGODB_DATABASE;

async function findAll(collection, query, options = null) {
  const mongoDbClient = new MongoClient(mongoDbUri);

  try {
    await mongoDbClient.connect();

    const cursor =
      (await mongoDbClient.db(MONGODB_DATABASE).collection(collection).find) <
      WithId >
      (query, options);

    const data = await cursor.toArray();

    return data;
  } catch (error) {
    console.error('findAll error', error);
  } finally {
    await mongoDbClient.close();
  }

  return [];
}

async function findOne(collection, query, options = null) {
  const mongoDbClient = new MongoClient(mongoDbUri);

  try {
    await mongoDbClient.connect();

    const data = await mongoDbClient
      .db(MONGODB_DATABASE)
      .collection(collection)
      .findOne(query, options);

    return data;
  } catch (error) {
    console.error('findOne error', error);
  } finally {
    await mongoDbClient.close();
  }

  return null;
}

async function insert(collection, document, options = null) {
  const mongoDbClient = new MongoClient(mongoDbUri);

  try {
    await mongoDbClient.connect();

    const data = await mongoDbClient
      .db(MONGODB_DATABASE)
      .collection(collection)
      .insertOne(document);

    return data.insertedId.toString();
  } catch (error) {
    console.error('insert error', error);
  } finally {
    await mongoDbClient.close();
  }

  return null;
}

async function update(collection, filter, document, options = null) {
  const mongoDbClient = new MongoClient(mongoDbUri);

  try {
    await mongoDbClient.connect();

    const data = await mongoDbClient
      .db(MONGODB_DATABASE)
      .collection(collection)
      .updateOne(filter, { $set: document });

    return data.modifiedCount > 0;
  } catch (error) {
    console.error('update error', error);
  } finally {
    await mongoDbClient.close();
  }

  return false;
}

async function remove(collection, filter, options = null) {
  const mongoDbClient = new MongoClient(mongoDbUri);

  try {
    await mongoDbClient.connect();

    const data = await mongoDbClient
      .db(MONGODB_DATABASE)
      .collection(collection)
      .deleteOne(filter);

    return data.deletedCount > 0;
  } catch (error) {
    console.error('remove error', error);
  } finally {
    await mongoDbClient.close();
  }

  return false;
}

module.exports = {
  IndexType,
  findAll,
  findOne,
  insert,
  update,
  remove,
};
