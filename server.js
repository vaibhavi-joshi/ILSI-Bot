 var restify = require('restify');
 var builder = require('botbuilder');
 

 var bot = new builder.BotConnectorBot();
 
 
 //https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=0d6df140e73b4f07a204058a0769d60e&q=When%20is%20next%20holiday
 var model = 'https://api.projectoxford.ai/luis/v1/application?id=814f9a05-0e84-41f4-aec9-f205211b3a46&subscription-key=0d6df140e73b4f07a204058a0769d60e&q=';
 var dialog = new builder.LuisDialog(model);
 
 bot.add('/', dialog);
 
 dialog.on('CheckHoliday',function (session, args) {

    session.send("Next Holiday is 'Independece Day' on Monday July 04 2016");
});
 dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));
 

 
 var server = restify.createServer();

server.post('/v1/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 8080, function () {
     console.log('%s listening to %s', server.name, server.url); 
 });
 
 

 //bot.listenStdin()

