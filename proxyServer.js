var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express(); 

app.use(cors());

const API_KEY = "X";

function getPlayerPUUID(gameName, tagLine) {
    // Set up API call
    var APICallString = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"+gameName+"/"+tagLine + "?api_key=" + API_KEY;
    return axios.get(APICallString)
        .then (response => {
            console.log(response.data);
            return response.data.puuid;
        }).catch(err => err); 
}

app.get('/accountdetails', async (req, res) => {
    console.log("GET /accountdetails");
    const gameName = req.query.gamename; 
    const tagLine = req.query.tagline;
    // PUUID 
    const PUUID = await getPlayerPUUID(gameName, tagLine);
    var APICallString = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + PUUID + "?api_key=" + API_KEY;
    const accdata = await axios.get(APICallString)
    .then (response => response.data).catch(err => err);
    res.json(accdata);
})


// GET past5games

app.get('/past5games', async (req, res) => {
    console.log("GET /past5games");
    const gameName = req.query.gamename; 
    const tagLine = req.query.tagline;
    // PUUID 
    const PUUID = await getPlayerPUUID(gameName, tagLine);
    console.log(PUUID);
    const API_CALL = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/"+PUUID+"/ids"+"?api_key=" + API_KEY;

    const gameIDs = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)
    console.log(gameIDs);

    var matchDataArray = [];

    for(var i = 0; i < gameIDs.length - 15; i++){
        const matchID = gameIDs[i];
        const matchData = await axios.get("https://europe.api.riotgames.com/lol/match/v5/matches/"+matchID+"?api_key=" + API_KEY)
        .then(response => response.data)
        .catch(err => err)
        matchDataArray.push(matchData);
    }
    res.json(matchDataArray);
})
app.listen(4000, function () {
    console.log("Server started on port 4000");
}) //localhost:4000
