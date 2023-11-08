const users = ["Bwolf77", "Ooglert89", "DoubleliftsBro", "Gavatrav", "Kalladin", "Langosteen", "RolledAndSmoked", "Santa CIaus", "TheGoodFrey", "TRACKPAD NUNU"];

const riotHeaders = new Headers({
	"X-Riot-Token": process.env.riotToken
});

const dailyMessage = async (client)=> {
	const guild = client.guilds.cache.get(process.env.guildId);
	const channel = guild.channels.cache.get(process.env.channelId);
	const puuids = await Promise.all(users.map(async (user) => {
		puuid = await getPuuid(user);
		return puuid;
	  }));
	
}

async function getPuuid(summonerId){
	const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerId}/NA1`, {
		method: "GET",
		headers: riotHeaders
	})
	const Data = await response.json();
	puuid = Data.puuid;
	return puuid;
}

async function getTodaysMatchIds(puuid){
    const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${epocDate}&start=0&count=100`, {
	method: "GET",
	headers: riotHeaders
	})
	const Data = await response.json();
    return Data
}


module.exports = { dailyMessage }