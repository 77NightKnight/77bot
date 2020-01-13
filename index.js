const {Client, RichEmbed} = require('discord.js');
const bot = new Client();
const token = process.env.token;
const version = '1.1.5'
const prefix = '!';
const ytdl = require("ytdl-core");
var servers = {};


bot.on('ready', () =>{
    console.log('77 Is Online');
    bot.user.setActivity('!help', { type: 'LISTENING'}).catch(console.error);
})
bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');
    if (!channel) return;
    channel.send('Welcome to 77, ' + member);
  });

bot.on ('message', msg=>{
    if (!msg.guild) return;
    
    const user = msg.mentions.users.first();
    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0]){
        case 'clear':
            if(!args[1]) return msg.reply('Invalid! Please type the number of messages to clear!')
            msg.channel.bulkDelete(args[1]).catch(console.error);
            break;
        case 'kick':
            if (user) {
                const member = msg.guild.member(user);
                
                if (member) {
                    member.kick('Optional reason that will display in the audit logs').then(() => {
                        msg.reply('Successfully kicked ' + member);
                    }).catch(err => {
                        msg.reply('I was unable to kick the member');
                        console.error(err);
                    });
                } else {
                    msg.reply('That user isn\'t in this guild!');
                }  
                
            } else {
                msg.reply('You didn\'t mention the user to kick!');
                    }
        break;
        case 'ban':
            const member = msg.guild.member(user);    
            if (member) {
                member.ban({
                    reason: 'They were bad'
                }).then(() => {
                    msg.reply('Successfully banned ' + member);
                }).catch(err => {
                    msg.reply('I was unable to ban the member');
                    console.error(err);
                });
            } else {
                msg.reply('You didn\'t mention the user to ban!')
                   }
        break;
            
        case 'help':
                let embed1 = new RichEmbed()
                .setTitle('Moderator Plugin Commands')
                .addField('!ban [member] (optional reason)', 'Bans a member from the server')
                .addField('!clear (count)', 'Clears messages in a particular channel')
                .addField('!kick [member] (optional reason)', 'Kicks a member from the server')
                .setColor('0x30E5BB')
                .setThumbnail('https://i.imgur.com/JsgxK3Y.png')
                msg.author.send(embed1).catch(console.error);
                
                let embed2 = new RichEmbed()
                .setTitle('Music Plugin Commands(Beta)')
                .addField('!play [link]', 'Adds the song to the queue and plays it if the queue is empty')
                .addField('!skip', 'Skip to the next song')
                .addField('!stop', 'Stops the current playing song and leaves the voice channel')
                .setColor('0x30E5BB')
                .setThumbnail('https://i.imgur.com/1J243X9.png')
                msg.author.send(embed2).catch(console.error);

            
            
        break;

        case 'play':
        function play(connection, msg){
                var server = servers[msg.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, msg);
                    
                    } else {
                        connection.disconnect()
                    }
                });


                return;
            }
            

            if(!args[1]){
                msg.channel.send('What would you like to play?(Provide a link!)');
                return;
            }

            if(!msg.member.voiceChannel){
                msg.channel.send('You must be in a channel to play music!');
                return;
            }
            if(!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }

            var server = servers[msg.guild.id];

            server.queue.push(args[1]);

            if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection){
                play(connection, msg)
            })



        break;
        
        case 'skip':
            var server = servers[msg.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            msg.channel.send('Skipping the song!').catch(console.error);
        
        break;
        
        case 'stop':
            var server = servers[msg.guild.id];
            if(msg.guild.voiceConnection){
                for(var i = server.queue.length -1; i >=0; i--){
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
                msg.channel.send("Ending the queue now!")
                console.log('stopped the queue')
            }

            if(msg.guild.connection) msg.guild.voiceConnection.disconnect().catch(console.error);
        
        break;
    }
    });

bot.login(token)