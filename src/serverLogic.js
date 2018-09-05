import { mongoAsync } from './serverStartup';

export async function serverReady() {
  if (mongoAsync.ready) { return; }
  await mongoAsync.serverReadyPromise;
}

// local utilities

function max(array) {
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

function getMiddleGround(code1, code2) {
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

function shortLabel(str) {
  const maxlen = 10;
  if (str.length <= maxlen) return str;
  return `${str.substr(0, maxlen - 2)}...`;
}

// Authentication

export async function findOrCreateUser(token, type, profile)
{
  var user = await mongoAsync.dbCollections.users.findOne({ "googleId" : token });
  if (user) { return user; }
  user = await mongoAsync.dbCollections.users.insert({ "googleId" : token, "profile" : profile });
  return user;
}

// API

export async function getArticles(user) {
  return await mongoAsync.dbCollections.articles.find().toArray();
}

export async function getArticleInfo(url, user) {
  const article = await mongoAsync.dbCollections.articles.findOne({ Url: url });
  const loadData = [];
  const voteResults = [];
  const votes = mongoAsync.preloads.votes;
	const priorities = mongoAsync.preloads.priorities;
	
  let argumentList;
  let ownVote = 'N';
  let ownVoteInstance;
	let isLoggedIn = user !== null;
	
  loadData.push(
    mongoAsync.dbCollections.arguments
      .find({ Article: article.ID })
      .toArray()
      .then(it => (argumentList = it)),
  );
  votes.forEach(element => {
    const voteItem = { vote: element, popular: 0 };
    voteResults.push(voteItem);
    loadData.push(
      mongoAsync.dbCollections.popularVote
        .countDocuments({ Article: article.ID, Vote: element.ID })
        .then(it => voteItem.popular = it),
    );
	});
	
  if (isLoggedIn)
  {
    loadData.push(
      mongoAsync.dbCollections.popularVote
        .findOne({ Article: article.ID, User: user._id })
        .then(it => (ownVoteInstance = it)),
    )
  }
  await Promise.all(loadData);

	if (ownVoteInstance)
  {
    votes.forEach(element => 
    {
      if (element.ID === ownVoteInstance.Vote)
      {
        ownVote = element.Code;
      }
    })
  }

  var totalPopular = 0; // total number of popular votes on this article
	var popularCounter = []; // array to count popular votes

	// for each vote option...
	for (let voteIndex = 0; voteIndex < voteResults.length; voteIndex++)
	{
		let vote = voteResults[voteIndex].vote;
		vote.index = voteIndex; // temporarily store index in vote option to navigate arrays easier within this method
		vote.priorityCount = 0; // how many priorities (categories of arguments) speak in favor of this option
		vote.ShortDescription = vote.ShortDescription.replace('%A%', article.ShortA).replace('%B%', article.ShortB);
		vote.ShortestDescription = vote.ShortDescription.replace('%A%', shortLabel(article.ShortA)).replace('%B%', shortLabel(article.ShortB));
		let popularVote = voteResults[voteIndex].popular;
		totalPopular += popularVote; // add up to total number of popular votes
		popularCounter.push(popularVote); // push the number into the array
	}

	var factor = 100.0 / totalPopular; // we will multiply by this to get percentage values of popular vote on each option
	var popularVoteResult = null; // first we assume that popular vote did not reach its quota (absolute majority)

	var globalVoteCounter = []; // one more number array - now for argumented voting
	
	// for each vote option...
	for (let voteIndex = 0; voteIndex < voteResults.length; voteIndex++)
	{
		globalVoteCounter.push(0); // initialize global counter;
		let popularVote = voteResults[voteIndex].popular;
		voteResults[voteIndex].popular = (popularVote * factor).toFixed(2); // we convert asolute vote numbers to percentages
		if (2 * popularVote > totalPopular) // if this option scored more than half of total votes, then popular vote met its quota and...
			popularVoteResult = voteResults[voteIndex].vote; // ...we store this option as the result of popular vote
	}

	var priorityList = []; // will contain groups of arguments

	// for each argument category...
	for (let priorIndex = 0; priorIndex < priorities.length; priorIndex++)
	{
		var priority = priorities[priorIndex];
		var entry = { priority : priority, arguments : [] };
		var voteCounter = []; // argument counter
		for (let voteIndex = 0; voteIndex < voteResults.length; voteIndex++)
		{
			voteCounter.push(0); // initialize the counter with zero for each vote option
    }
    
		// for each argument...
		for (let argumentIndex = 0; argumentIndex < argumentList.length; argumentIndex++)
		{
			let argument = argumentList[argumentIndex];
			
			// ...that falls in the current category...
			if (argument.Priority === priority.ID)
			{
				entry.arguments.push(argument); // store it in the client results
				for (let voteIndex = 0; voteIndex < voteResults.length; voteIndex++)
				{
					let vote = voteResults[voteIndex].vote;
					if (vote.ID === argument.Vote) // find the vote option it favors
					{
						argument.voteFor = vote.ShortDescription; // store short description here for client's convenience (redundant but handy data)
						voteCounter[voteIndex]++; // update the counter
					}
				}
			}
		}

		var maxVotes = max(voteCounter); // get vote results
		var priorityVote = null; // first we assume this category failed to elect an option
		if (maxVotes.count === 1) // if we have exactly one top-vote option...
		{
			priorityVote = voteResults[maxVotes.firstIndex].vote; // ...then it is our champion, unless...
		}

		var popularOverride = priority.IsPopular && popularVoteResult !== null;
		priority.popularOverride = popularOverride;
		if (popularOverride) // ...we're speaking of the 'Popularity' priority...
		{
			priorityVote = popularVoteResult; // ...and it gets overridden with successful popular vote (more than 50% on one and the same option)
		}

		entry.voteFor = '-';
		if (priorityVote !== null)
		{
			entry.voteFor = priorityVote.ShortDescription; // another convenient redundancy
			priorityVote.priorityCount++; // probably also redundant
			globalVoteCounter[priorityVote.index]++; // update the counter on the vote option
		}

		priorityList.push(entry);
  }
  
	var colorCode = 'N'; // as usual, first we assume color code 'N', which means we have no answer to the question in the article
	var globalResults = max(globalVoteCounter); // count the global vote results
	if (globalResults.count === 1 && globalResults.value > 1) // if we have exactly one top-vote option with at least two priorities supporting it...
	{
		colorCode = voteResults[globalResults.firstIndex].vote.Code; // then it is a clear winner		
	}
	else if (globalResults.count === 2) // otherwise, if we have exactly two top-votes...
	{
		var option1 = voteResults[globalResults.firstIndex].vote.Code;
		var option2 = voteResults[globalResults.lastIndex].vote.Code;
		colorCode = getMiddleGround(option1, option2); // we take the middle-ground option between them
	}

	var color = null;
	
	// A 'color' is a general conclusion on the question posed in the article: whether we take one side, another, middle-ground or other possible option
	mongoAsync.preloads.colors.forEach(element => 
	{
		if (element.Code === colorCode)
			color = element;
	});

	if (color.Swap) // this means we must swap options A and B so that wrong one is always displayed on the left
	{
		var swap = article.TokenA;
		article.TokenA = article.TokenB;
		article.TokenB = swap;

		// order of voteResults helps client display vote results on the chart correctly,
		// so we also swap A with B and AB with BA
		var voteA;
		var voteB;
		var voteBA;
		var voteAB;
		for (let voteIndex = 0; voteIndex < voteResults.length; voteIndex++)
		{
			let res = voteResults[voteIndex];
			let vote = res.vote;
			let code = vote.Code;
			switch (code)
			{
				case 'A': voteA = voteIndex; vote.Code = 'B'; break;
				case 'AB': voteAB = voteIndex; vote.Code = 'BA'; break;
				case 'BA': voteBA = voteIndex; vote.Code = 'AB'; break;
				case 'B': voteB = voteIndex; vote.Code = 'A'; break;
			}
		}

		swap = voteResults[voteA];
		voteResults[voteA] = voteResults[voteB];
		voteResults[voteB] = swap;

		swap = voteResults[voteAB];
		voteResults[voteAB] = voteResults[voteBA];
		voteResults[voteBA] = swap;

		// also swap user's own vote
		switch (ownVote)
		{
			case 'A': ownVote = 'B'; break;
			case 'B': ownVote = 'A'; break;
			case 'AB': ownVote = 'BA'; break;
			case 'BA': ownVote = 'AB'; break;
		}
	}

	// finally, we form the client results into a single object
	var articleData = 
	{
		article : article,
		totalPopular : totalPopular,
		priorityList : priorityList,
		voteResults : voteResults,
		result : color,
		ownVote : ownVote,
	};
	return articleData;
}

async function deleteAllVotes(userId, articleId)
{
	await mongoAsync.dbCollections.popularVote.deleteMany({ User: userId, Article: articleId });
}

export async function sendPopularVote(user, articleId, voteId)
{
	if (!user)
		return { success: false, message: 'Error: not logged in' };

	var res = await mongoAsync.dbCollections.popularVote.find({ Article: articleId, User: user._id }).toArray();

	if (!voteId || voteId === 'null')
	{
		await deleteAllVotes(user._id, articleId);
		return { success: true, message: 'Success (vote undone)' };
	}

	var additionalMessage = 'vote added';
	var totalCount = res.length;	
	if (totalCount > 1) // unexpected situation: more than single vote from current user on this article!
	{
		additionalMessage = 'suspicious: multiple votes detected and removed';
		await deleteAllVotes(user._id, articleId); // purge all its votes before proceeding
		totalCount = 0;
	}
	if (totalCount === 1) // there is exactly one vote: just update it
	{
		additionalMessage = 'vote updated';
		var vote = res[0];
		vote.Vote = voteId;
		await mongoAsync.dbCollections.popularVote.update({ _id: vote._id }, vote);
	}
	else // there are no votes: create a new one
	{
		var newVote = { User: user._id, Vote: voteId, Article: articleId };
		await mongoAsync.dbCollections.popularVote.insert(newVote);
	}
	return { success: true, message: 'Success (' + additionalMessage + ')' };
}