import { mongoAsync } from './serverStartup';

export async function serverReady()
{
  if (mongoAsync.ready)
  {
    return;
  }
  await mongoAsync.serverReadyPromise;
}

function max(array)
{
	var len = array.length;
	if (!len || len < 1)
		return null;
	var current = array[0];
	var count = 1;
	var firstIndex = 0;
	var lastIndex = 0;
	for (let index = 1; index < len; index++)
	{
		var val = array[index];
		if (val > current)
		{
			current = val;
			count = 1;
			firstIndex = index;
			lastIndex = index;			
		}
		else if (val === current)
		{
			count++;
			lastIndex = index;
		}
	}
	var result = { "value" : current, "count" : count, "firstIndex" : firstIndex, "lastIndex" : lastIndex };
	return result;
}

function getMiddleGround(code1, code2)
{
	if (code1 === code2) // weird case, but who knows...
		return code1;
	if (code1 > code2) // alphabetical order
	{
		let swap = code1;
		code1 = code2;
		code2 = swap;
	}
	switch (code1 + '+' + code2)
	{
		// unique middle-ground codes
		case 'A+AB': return 'AAB';
		case 'AB+EQ': return 'ABE';
		case 'BA+EQ': return 'BAE';
		case 'B+BA': return 'BBA';
		case 'EQ+S': return 'EQS';

		// middle-ground codes that coincide with some 'pure' codes
		case 'AB+BA': return 'EQ';
		case 'A+EQ': return 'AB';
		case 'B+EQ': return 'BA';
	}
	return 'N'; // there is no middle ground
}

function shortLabel(str)
{	
	var maxlen = 10;
	if (str.length <= maxlen)
		return str;
	return str.substr(0, maxlen - 2) + '...';
}


export async function getArticles()
{
  return await mongoAsync.dbCollections.articles.find().toArray();
}

export async function getArticleInfo(url)
{
  var article = await mongoAsync.dbCollections.articles.findOne({ "Url" : url });
  var loadData = [];
  var voteResults = [];
	var votes = mongoAsync.preloads.votes;
	var priorities = mongoAsync.preloads.priorities;
  var argumentList;
  loadData.push(mongoAsync.dbCollections.arguments.find({ "Article" : article._id }).toArray().then(it => argumentList = it));
  votes.forEach(element => {
    var voteItem = { vote: element };
    voteResults.push(voteItem);
    loadData.push(mongoAsync.dbCollections.popularVote.count({ "Article" : article._id, "Vote" : element._id })
      .then(it => voteItem.popular = it));
  });
  return article;
}