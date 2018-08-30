import { mongoAsync } from './serverStartup';

export function MyFunc() {}

export async function getArticles() {
  return await mongoAsync.dbCollections.articles.find().toArray();
}
