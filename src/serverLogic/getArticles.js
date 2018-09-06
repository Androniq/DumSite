import { mongoAsync } from '../serverStartup';

import {
    serverReady,
    max,
    getMiddleGround,
    shortLabel,
    mongoInsert,
    mongoUpdate,
    getLevel,
    checkPrivilege,
    USER_LEVEL_VISITOR,
    USER_LEVEL_MEMBER,
    USER_LEVEL_MODERATOR,
    USER_LEVEL_ADMIN,
    USER_LEVEL_OWNER } from './_common';

export default async function getArticles()
{
  return await mongoAsync.dbCollections.articles.find().toArray();
}