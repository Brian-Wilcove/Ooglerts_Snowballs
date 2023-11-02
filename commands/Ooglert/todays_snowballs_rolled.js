const { SlashCommandBuilder } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

const riotHeaders = new Headers({
	"X-Riot-Token": process.env.riotToken
});

const summonerId = "TRACKPAD NUNU";

let puuid;

let todayDate = Date();
todayDate = todayDate.substring(0, 16) + "00:00:00" + todayDate.substring(23);
const epocDate = (Date.parse(todayDate)) / 1000;

async function getPuuid(){
	const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerId}/NA1`, {
		method: "GET",
		headers: riotHeaders
	})
	const Data = await response.json();
	puuid = Data.puuid;
	return puuid;
}

async function getTodaysMatchIds(){
	const puuid2 = await getPuuid();
	//const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid2}/ids?StartTime${epocDate}&start=0&count=100`, {
        const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid2}/ids?startTime=${epocDate}&start=0&count=100`, {
		method: "GET",
		headers: riotHeaders
	})
	const Data = await response.json();
    return Data
}

async function getTodaysMatchInfo(){
	const matchIds = await getTodaysMatchIds();
    let DataArray = [];
    let playerOnlyArray = [];
    for(let i = 0; i < matchIds.length; i++){
        const response = await fetch("https://americas.api.riotgames.com/lol/match/v5/matches/" + matchIds[i], {
            method: "GET",
            headers: riotHeaders
        })
        const Data = await response.json();
        DataArray[i] = Data;
    }
    
    for (let x = 0; x < DataArray.length; x++) {
	    for (let i = 0; i < DataArray[x].info.participants.length; i++) {
		if(DataArray[x].info.participants[i].puuid == puuid ){
			playerOnlyArray.push(DataArray[x].info.participants[i]);
		}
	  }
    }
    return playerOnlyArray;
}

async function createOnlyNunuArray(){
	const todaysGameInfo = await getTodaysMatchInfo();
    const onlyNunuGames = []
    for(let i = 0; i < todaysGameInfo.length; i ++){
        if(todaysGameInfo[i].championName == "Nunu"){
            onlyNunuGames.push(todaysGameInfo[i]);
        } 
    }
    return onlyNunuGames;
}

async function finalRoll(){
	const nunuArray = await createOnlyNunuArray();
    let numberOfWs = 0;
    for(let i = 0; i < nunuArray.length; i ++){
        numberOfWs = nunuArray[i].spell2Casts + numberOfWs
    } 
    return numberOfWs;
}
	

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('snowballs_today')
		.setDescription('Replies with the number of snowballs Ooglert has rolled today'),
	async execute(interaction) {
		await interaction.deferReply();
		const snow = await finalRoll();
		if(snow == "0"){
			await interaction.editReply("Everything would be better with a friend :(");
		} else{
			await interaction.editReply(snow.toString());
		}
	},
};