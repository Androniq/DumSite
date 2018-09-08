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

// User privileges

export const USER_LEVEL_VISITOR = 1;
export const USER_LEVEL_MEMBER = 2;
export const USER_LEVEL_MODERATOR = 3;
export const USER_LEVEL_ADMIN = 4;
export const USER_LEVEL_OWNER = 5;

export function getLevel(user)
{
	if (!user)
		return USER_LEVEL_VISITOR; // not logged in - visitor
	if (user.blocked || !user.confirmed)
		return USER_LEVEL_VISITOR; // email unconfirmed or user banned
	switch (user.role)
	{
		case 'member': return USER_LEVEL_MEMBER;
		case 'moderator': return USER_LEVEL_MODERATOR;
		case 'admin': return USER_LEVEL_ADMIN;
		case 'owner': return USER_LEVEL_OWNER;
	}
	return USER_LEVEL_VISITOR;
}

export function checkPrivilege(user, level)
{
	return getLevel(user) + 0.1 /* sorry, I'm C# paranoid - scary number comparison */ >= level;
}