const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const RULES_CONFIRMATION_CHANNEL_ID = '1349806382722842769'; // Replace with the channel ID
const DARWIN_AWARD_ROLE_ID = '1349806982722359450'; // Replace with the Darwin Award role ID
const MEMBERS_ROLE_ID = '1342614756053483551'; // Replace with the Members role ID
const GUILD_ID = '1342612145443176561'; // Replace with your server ID

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(interaction.user.id);
    
    if (interaction.customId === 'yes_read_rules') {
        try {
            await member.roles.add(MEMBERS_ROLE_ID);
            await interaction.reply({ content: 'Welcome to the server! You now have the Members role.', ephemeral: true });
        } catch (error) {
            console.error('Error assigning Members role:', error);
        }
    } else {
        try {
            await member.roles.add(DARWIN_AWARD_ROLE_ID);
            await interaction.reply({ content: 'You have been awarded the **Darwin Award**. Goodbye!', ephemeral: true });
            await member.kick('Did not confirm reading the rules.');
        } catch (error) {
            console.error('Error assigning role or kicking member:', error);
        }
    }
});

client.on('guildMemberAdd', async member => {
    if (member.user.bot) return;
    
    const channel = await client.channels.fetch(RULES_CONFIRMATION_CHANNEL_ID);
    if (!channel) return;
    
    const embed = new EmbedBuilder()
        .setTitle('Server Rules Confirmation')
        .setDescription('Please confirm that you have read the rules by selecting an option below.')
        .setColor(0x00ff00);
    
    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('yes_read_rules')
            .setLabel('Yes, I have read the rules')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('no_rules_1')
            .setLabel(`I'm sorry, what are rules?`)
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('no_rules_2')
            .setLabel(`I'm too cool to follow the rules`)
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('no_rules_3')
            .setLabel(`I don't have time to read the rules`)
            .setStyle(ButtonStyle.Danger)
    );
    
    await channel.send({ embeds: [embed], components: [buttons] });
});

client.login(process.env.TOKEN);
