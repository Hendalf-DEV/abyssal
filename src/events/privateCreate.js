const { Events, PermissionsBitField } = require('discord.js');

const listenChannelID = "1099147344143978516";

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        //console.log("VoiceStateUpdate event triggered"); // Debug log

        if (newState.channel && newState.channel.id === listenChannelID) {
            //console.log("User joined the listenChannel"); // Debug log
            const guild = newState.guild;
            const user = newState.member;

            const newChannel = await guild.channels.create({ 
                name: user.user.username, 
                type: 2, 
                userLimit: 0,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                    },
                    {
                        id: user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.Connect,
                            PermissionsBitField.Flags.Speak,
                            PermissionsBitField.Flags.Stream,
                            PermissionsBitField.Flags.UseVAD,
                            PermissionsBitField.Flags.ManageChannels,
                        ],
                    },
                ],
            });
            //console.log(`New channel created: ${newChannel.name}`); // Debug log

            // Move the user to the new voice channel
            await user.voice.setChannel(newChannel);
            //console.log(`User moved to the new channel: ${newChannel.name}`); // Debug log

            } else if (oldState.channel && oldState.channel.members.size === 0 && oldState.channel.name === oldState.member.user.username) {
                await oldState.channel.delete();
                //console.log(`Private channel deleted: ${oldState.channel.name}`); // Debug log
            }
    },
};
