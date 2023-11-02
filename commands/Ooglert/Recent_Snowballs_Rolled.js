const { SlashCommandBuilder } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

const riotHeaders = new Headers({
	"X-Riot-Token": process.env.riotToken
});

const summonerId = "TRACKPAD NUNU"

let puuid;

async function getPuuid(){
	const response = await fetch("https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"+ summonerId + "/NA1", {
		method: "GET",
		headers: riotHeaders
	})
	const Data = await response.json();
	puuid = Data.puuid;
	return puuid;
}

async function getRecentMatchId(){
	const puuid2 = await getPuuid();
	const response = await fetch("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" +puuid2 + "/ids?start=0&count=1", {
		method: "GET",
		headers: riotHeaders
	})
	const Data = await response.json();
	return Data[0];
}

async function getRecentMatchInfo(){
	const matchId = await getRecentMatchId();
	const response = await fetch("https://americas.api.riotgames.com/lol/match/v5/matches/" + matchId, {
		method: "GET",
		headers: riotHeaders
	})
	const Data = await response.json();

	for (let i = 0; i < Data.info.participants.length; i++) {
		if(Data.info.participants[i].puuid == puuid ){
			return Data.info.participants[i];
		}
	  }
}

async function finalCheck(){
	const gameInfo = await getRecentMatchInfo();
	if(gameInfo.championName != "Nunu"){
		return "No Nunu"
	} 
	return gameInfo.spell2Casts;
}

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('snowballs')
		.setDescription('Replies with the number of snowballs Ooglert has rolled in his most recent match'),
	async execute(interaction) {
		await interaction.deferReply();
		const snow = await finalCheck();
		if(snow == "No Nunu"){
			await interaction.editReply("He really didn't play Nunu??? WTF");
		} else{
			await interaction.editReply(snow.toString());
		}
	},
};