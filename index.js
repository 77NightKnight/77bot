const Discord = require('discord.js');
const Client = new Discord.Client();
Client.login(process.env.token)


const version = '1.0.5'
const prefix = '!';

Client.on('ready', () =>{
    console.log('77 Is Online');

})
Client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');
    if (!channel) return;
    channel.send('Welcome to 77, ' + member);
  });

Client.on ('message', msg=>{
    if (!msg.guild) return;
    
    const user = msg.mentions.users.first();

    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0]){
        case 'ping':
            msg.channel.sendMessage('pong!');
        break;
        case 'website':
            msg.channel.sendMessage('77 Doesn\t Have A Website!')
            break;
        case 'info':
            if(args[1] === 'version'){
                msg.channel.sendMessage(version);
            }else{
                msg.reply('What info are you refering to? Try !info version');
            break;
            }
        case 'clear':
            if(!args[1]) return msg.reply('Invalid! Please type the number of messages to clear!')
            msg.channel.bulkDelete(args[1]);
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
        case 'help':
            const embed = new Discord.RichEmbed()
            .setTitle('Moderator Plugin Commands')
            .addField('!ban [member] (optional reason)', 'Bans a member from the server')
            .addField('!clear (count)', 'Clears messages in a particular channel')
            .addField('!kick [member] (optional reason)', 'Kicks a member from the server')
            .setColor('0x30E5BB')
            .setThumbnail('https://i.imgur.com/JsgxK3Y.png')
            msg.channel.sendEmbed(embed);
        break;
        }
    });

