const restify = require('restify');
const skype = require('skype-sdk');
const builder = require('botbuilder');

APP_ID = "63f831ed-4469-4453-8330-d92d9929449d"
APP_SECRET = "YszUtpojbuhVThz5hxGNzAx"

// Initialize the BotService
const botService = new skype.BotService({
    messaging: {
        botId: "63f831ed-4469-4453-8330-d92d9929449d",
        serverUrl : "",
        requestTimeout : 15000,
        appId: "63f831ed-4469-4453-8330-d92d9929449d",
        appSecret: "YszUtpojbuhVThz5hxGNzAx"
    }
});

// Create bot and add dialogs
var bot = new builder.SkypeBot(botService);
bot.add('/', function (session) {
   session.send('Hello World'); 
});

// Setup Restify Server
const server = restify.createServer();
server.post('/v1/chat', skype.messagingHandler(botService));
server.listen(process.env.PORT || 8081, function () {
   console.log('%s listening to %s', server.name, server.url); 
});