export const mongoClient = require('mongodb').MongoClient;

export var mongoAsyncInternal = {};

export const mongoAsync = {
  ready: false,
  serverReadyPromise: new Promise((resolve, reject) => {
    mongoAsyncInternal.serverReadyTrigger = resolve;
    if (mongoAsync && mongoAsync.ready) {
      resolve();
    }
  }),
};

const defaultCollections = [
  'articles',
  'arguments',
  'colors',
  'priorities',
  'votes',
  'blog'
];

async function getCollection(db, name) {
  const r = db.collection(name);
  const nameLower = name.toLowerCase();
  if (defaultCollections.includes(nameLower)) {
    var rCount = await r.count();
    if (rCount === 0)
    {
      const jsonInitialDataFile = require(`./initialData/${nameLower}.json`);
      //await r.drop();
      r.insertMany(jsonInitialDataFile);
    }
  }
  if (name === 'Sessions')
  {
    await r.drop();
  }
  return r;
}

async function getDbCollections() {
  const test = require('assert');
  // Connection url
  const url = 'mongodb://localhost:27017';
  // Database Name
  const dbName = 'DumGrammarSite';

  mongoAsync.client = mongoClient;

  // Connect using MongoClient
  mongoClient.connect(
    url,
    async (err, client) => {
      const db = client.db(dbName);
      const dbServerConfig = await getCollection(db, 'ServerConfig');

      var serverConfig = await dbServerConfig.findOne();
      if (!serverConfig || !serverConfig.isOperational)
      {
        await db.dropDatabase();
        await dbServerConfig.insertOne({ isOperational: true });
        serverConfig = await dbServerConfig.findOne();
      }

      const dbArticles = await getCollection(db, 'Articles');
      const dbVotes = await getCollection(db, 'Votes');
      const dbPriorities = await getCollection(db, 'Priorities');
      const dbArguments = await getCollection(db, 'Arguments');
      const dbProposedArguments = await getCollection(db, 'ProposedArguments');
      const dbColors = await getCollection(db, 'Colors');
      const dbPopularVote = await getCollection(db, 'PopularVote');
      const dbUsers = await getCollection(db, 'Users');
      const dbBlog = await getCollection(db, 'Blog');

      mongoAsync.dbCollections = {
        serverConfig: dbServerConfig,
        articles: dbArticles,
        votes: dbVotes,
        priorities: dbPriorities,
        arguments: dbArguments,
        proposedArguments: dbProposedArguments,
        colors: dbColors,
        popularVote: dbPopularVote,
        users: dbUsers,
        blog: dbBlog
      };

      const votesPreload = await dbVotes.find().toArray();
      const prioritiesPreload = await dbPriorities.find().toArray();
      const colorsPreload = await dbColors.find().toArray();

      mongoAsync.preloads = {
        votes: votesPreload,
        priorities: prioritiesPreload,
        colors: colorsPreload,
      };

      mongoAsync.serverConfig = serverConfig;

      mongoAsync.ready = true;
      mongoAsyncInternal.serverReadyTrigger();
    },
  );
}

getDbCollections();
