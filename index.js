const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.token;


const version = '1.1.1'
const prefix = '!';

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
            if(!MessageChannel.member.roles.find(r => r.name === "💼 | Executive Team") || !MessageChannel.member.roles.find(r => r.name === '📂 | Administration Team')) return msg.channel.send('YOU DO NOT HAVE PERMISSIONS')
            if(!args[1]) return msg.reply('Invalid! Please type the number of messages to clear!')
            msg.channel.bulkDelete(args[1]).catch(console.error);
            break;
        case 'kick':
            if(!MessageChannel.member.roles.find(r => r.name === "💼 | Executive Team") || !MessageChannel.member.roles.find(r => r.name === '📂 | Administration Team')) return msg.channel.send('YOU DO NOT HAVE PERMISSIONS')
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
            if(!MessageChannel.member.roles.find(r => r.name === "💼 | Executive Team") || !MessageChannel.member.roles.find(r => r.name === '📂 | Administration Team')) return msg.channel.send('YOU DO NOT HAVE PERMISSIONS')
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

bot.login(token)