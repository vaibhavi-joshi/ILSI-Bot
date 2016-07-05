var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'ILSIBOT', appSecret: 'bdb784cb093a461a858b2db0f6ba62b5' });
bot.add('/', function (session) {
   session.send('Hello World'); 
});

// Setup Restify Server

var server = restify.createServer();
server.post('/v1/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
