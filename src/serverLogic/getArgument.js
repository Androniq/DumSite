import { mongoAsync } from '../serverStartup';

import {
  serverReady,
  max,
  getMiddleGround,
  shortLabel,
  mongoInsert,
  mongoUpdate,
} from './_common';

import {
  getLevel,
  checkPrivilege,
  USER_LEVEL_VISITOR,
  USER_LEVEL_MEMBER,
  USER_LEVEL_MODERATOR,
  USER_LEVEL_ADMIN,
  USER_LEVEL_OWNER,
} from '../utility';

import { ObjectID } from 'mongodb';

export async function getArgument(id) {
  const arg = await mongoAsync.dbCollections.arguments.findOne({
    _id: new ObjectID(id),
  });
  const article = await mongoAsync.dbCollections.articles.findOne({
    ID: arg.Article,
  });
  const votes = mongoAsync.preloads.votes;
  const priorities = mongoAsync.preloads.priorities;
  votes.forEach(vote => {
    vote.ShortDescription = vote.ShortDescriptionTemplate.replace(
      '%A%',
      article.ShortA,
    ).replace('%B%', article.ShortB);
  });
  const res = { argument: arg, article, votes, priorities };
  return res;
}

export async function getNewArgument(url) {
  const article = await mongoAsync.dbCollections.articles.findOne({ Url: url });
  if (!article) {
    return { success: false, message: 'Article not found' };
  }
  const votes = mongoAsync.preloads.votes;
  const priorities = mongoAsync.preloads.priorities;
  votes.forEach(vote => {
    vote.ShortDescription = vote.ShortDescriptionTemplate.replace(
      '%A%',
      article.ShortA,
    ).replace('%B%', article.ShortB);
  });
  const res = { argument: { Article: article.ID }, article, votes, priorities };
  return res;
}
