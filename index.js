var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var exphbs  = require('express-handlebars');

// Connection URL
var url = 'mongodb://localhost:27017/admin';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) { 

    console.log("Connected result", err);

    var gameResults = db.collection("gameresults");
    

    var app = express();

    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    app.use(express.static('client'));

    app.get('/', function (req, res) {
    res.send('Hello, are you ready to play ?')
    });

    var listChoices = ["rock","paper","scissors"];
    function randomPick(){
        return listChoices[parseInt(Math.random()*3)];
    }

    function confrontation(server, player){
        if(server==="rock"){
            if(player === "rock"){
                return "It's a draw, we both picker rock.";
            }else if(player === "paper"){
                return "You win, I picked rock.";
            }else if(player==="scissors"){
                return "You are a big looser, I picked rock.";
            } else {
                return "You are a cheater, " + player + " is not allowed.";
            }
        }else if(server==="paper"){
            if(player === "rock"){
                return "You are a big looser, I picked paper.";
            }else if(player === "paper"){
                return "It's a draw, we both picker paper.";
            }else if(player==="scissors"){
                return "You win, I picked paper.";
            } else {
                return "You are a cheater, " + player + " is not allowed.";
            }
        }else {
            if(player === "rock"){
                return "You win, I picked scissors.";           
            }else if(player === "paper"){
                return "You are a big looser, I picked scissors.";
            }else if(player==="scissors"){
                return "It's a draw, we both picker scissors.";
            } else {
                return "You are a cheater, " + player + " is not allowed.";
            }
        }
    }

    app.get('/game/:playerChoice/', function (req, res) {
        var serverPick = randomPick(),
            playerPick = req.params.playerChoice;
        // res.send(confrontation(serverPick,playerPick));
        gameResults.insert({
            player:playerPick,
            computer:serverPick,
            playerName:"Christophe"
        }, function(){
            res.render('game',{gameResult:confrontation(serverPick,playerPick)});
        });
    });

    app.get("/stat/", function(req,res){
        gameResults.find({}).toArray(function(err, games) {
            res.render("stat",{nbGames:games.length, lastGames:games.slice(-20)});
        });
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!')
    });
  
});

