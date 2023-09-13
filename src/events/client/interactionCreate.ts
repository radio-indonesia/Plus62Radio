import type { Interaction } from 'discord.js'
import type { Lrmn } from '../../core/Lrmn.js'

export const event = async (client: Lrmn, interaction: Interaction) => {
	if (interaction.isChatInputCommand() && interaction.guild) {
		const settings = client.database.get(interaction.guild.id)
		const translate = (translatable: string, replaceable: Record<string, string> = {}) =>
			client.locales.translate(settings.locale, translatable, replaceable)

		const command = client.commands.get(interaction.commandName, settings.locale)

		// Tambahkan penanganan jika perintah tidak ditemukan
		if (command) {
			// Jalankan perintah jika ditemukan
			command.run({ client, interaction, translate, settings })
		} else {
			await interaction.reply({
				content: translate('COMMAND_NOT_FOUND'), // Ganti dengan pesan yang sesuai
				ephemeral: true // Ini akan membuat pesan hanya terlihat oleh pengguna yang mengirimkan perintah
			})
		}
	}
}
