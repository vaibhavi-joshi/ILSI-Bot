var restify = require('restify');
var builder = require('botbuilder');


// Create bot and add dialogs

//var bot = new builder.TextBot();
var bot = new builder.BotConnectorBot();
var model = 'https://api.projectoxford.ai/luis/v1/application?id=814f9a05-0e84-41f4-aec9-f205211b3a46&subscription-key=0d6df140e73b4f07a204058a0769d60e';
var dialog = new builder.LuisDialog(model);


bot.add('/', dialog);

dialog.on('CheckHoliday', function (session, args) {

    session.send("Next Holiday is 'Independece Day' on Monday July 04 2016");
});
dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));



// Setup Restify Server

var server = restify.createServer();

server.use(bot.verifyBotFramework({appId:'ILSIBOT', appSecret:'bdb784cb093a461a858b2db0f6ba62b5' }));
server.post('/v1/messages', bot.listen());

var listener = server.listen(8080, function () {
	console.log('server started on port %s', listener.address().port);
});

//bot.listenStdin()

