import { mongoAsync } from '../serverStartup';

import {
    serverReady,
    max,
    getMiddleGround,
    shortLabel,
    mongoInsert,
    mongoUpdate,
    mongoDelete } from './_common';

import {
	getLevel,
	checkPrivilege,
	USER_LEVEL_VISITOR,
	USER_LEVEL_MEMBER,
	USER_LEVEL_MODERATOR,
	USER_LEVEL_ADMIN,
    USER_LEVEL_OWNER } from '../utility';

const ObjectID = require('mongodb').ObjectID;
    
export default async function deleteArticle(user, id)
{
	if (!checkPrivilege(user, USER_LEVEL_ADMIN))
    {
        return { success: false, message: "Insufficient privileges" };
    }
    var objId = new ObjectID(id);
    var article = mongoAsync.dbCollections.articles.findOne({ _id: objId });
    if (!article)
    {
        return { success: false, message: "Article not found" };
    }
    var arguments = await mongoAsync.dbCollections.arguments.find({ Article: objId });
    var works = arguments.map(arg => mongoDelete(mongoAsync.dbCollections.arguments, arg._id));
    works.push(mongoDelete(mongoAsync.dbCollections.articles, id));
    await Promise.all(works);
	return { success: true };
}