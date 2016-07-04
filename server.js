const restify = require('restify');
const builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'ILSI', appSecret: '6bc9fdec647a44fe8847447e78096758' });
bot.add('/', function (session) {
   session.send('Hello World'); 
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 8085, function () {
    console.log('%s listening to %s', server.name, server.url); 
});