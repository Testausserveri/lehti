const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const dotenv = require('dotenv');
const { Client, Intents, MessageEmbed, MessageAttachment } = require('discord.js');

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const url = process.env.API_URL;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

client.once('ready', async () => {
	const response = await fetch(url, {method: 'GET'});
  const data = await response.json();
  const attachment = new MessageAttachment('./built.html', 'lehti.html');

  for (postbox of data.discord) {
    let user = await client.users.fetch(postbox.v);
    const embed = new MessageEmbed()
      .setColor('#ce1b18')
      .setTitle('Testaaja-lehti on saapunut postilaatikkoosi!')
      .setURL('https://lehti.testausserveri.fi/')
      .setDescription(`Lataa lehti.html koneellesi ja avaa se selaimella, niin pääset selaamaan lehteä.`)
      .addField('Etkö halua lehteä? :(',`[unsubaa](https://postman.haka.workers.dev/unsub/discord/${postbox.id})`)
      .setTimestamp()
      .setFooter('Postin tuo, postin tuo...');
    await user.send({embeds: [embed]});
    await user.send({files: [attachment]});
  }
  client.destroy();
});

client.login(token);
