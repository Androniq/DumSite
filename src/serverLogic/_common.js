import { mongoAsync } from '../serverStartup';

export async function serverReady() {
  if (mongoAsync.ready) { return; }
  await mongoAsync.serverReadyPromise;
}

const ObjectID = require('mongodb').ObjectID;

// local utilities

export function max(array) {
    const len = array.length;
    if (!len || len < 1) return null;
    let current = array[0];
    let count = 1;
    let firstIndex = 0;
    let lastIndex = 0;
    for (let index = 1; index < len; index++) {
      const val = array[index];
      if (val > current) {
        current = val;
        count = 1;
        firstIndex = index;
        lastIndex = index;
      } else if (val === current) {
        count++;
        lastIndex = index;
      }
    }
    const result = {
      value: current,
      count,
      firstIndex,
      lastIndex,
    };
    return result;
  }

export function getMiddleGround(code1, code2) {
    if (code1 === code2)
      // weird case, but who knows...
      return code1;
    if (code1 > code2) {
          // alphabetical order
      const swap = code1;
      code1 = code2;
      code2 = swap;
    }
    switch (`${code1}+${code2}`) {
      // unique middle-ground codes
      case 'A+AB':
        return 'AAB';
      case 'AB+EQ':
        return 'ABE';
      case 'BA+EQ':
        return 'BAE';
      case 'B+BA':
        return 'BBA';
      case 'EQ+S':
        return 'EQS';
  
      // middle-ground codes that coincide with some 'pure' codes
      case 'AB+BA':
        return 'EQ';
      case 'A+EQ':
        return 'AB';
      case 'B+EQ':
        return 'BA';
    }
    return 'N'; // there is no middle ground
  }

export function shortLabel(str)
{
    const maxlen = 12;
    if (str.length <= maxlen) return str;
    return `${str.substr(0, maxlen - 2)}...`;
}

// Database operations

export async function mongoInsert(collection, item, user)
{
	var now = new Date();
	item.DateCreated = now;
	item.DateUpdated = now;
	if (user)
		item.Owner = user._id;
	return await collection.insert(item);
	//return await collection.insertOne(item);
}

export async function mongoUpdate(collection, item)
{
	var now = new Date();
  item.DateUpdated = now;
  var id = new ObjectID(item._id);
  delete item._id;
	return await collection.updateOne({ _id: id }, { $set: item });
}

export async function mongoDelete(collection, id)
{
  return await collection.deleteOne({ _id: new ObjectID(id) });
}

export async function setServerConfig(config)
{
  for (var propName in config)
  {
    mongoAsync.serverConfig[propName] = config[propName];
  }
  await mongoAsync.dbCollections.serverConfig.updateOne({ _id: mongoAsync.serverConfig._id }, { $set: config });
};