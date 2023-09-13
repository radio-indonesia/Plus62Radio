import process from 'node:process'
import { GatewayIntentBits, Partials } from 'discord.js'
import { Lrmn } from './core/Lrmn.js'
import { env } from './env.js'

const bot = new Lrmn({
	timeZone: env.TIMEZONE,
	mongoConnectionURL: env.MONGO_CONNECTION_URL,
	defaultLocale: env.DEFAULT_LOCALE,
	intents: Object.values(GatewayIntentBits).filter((i): i is GatewayIntentBits => typeof i === 'number'),
	partials: [Partials.Message, Partials.Channel]
})

// Tambahkan variabel untuk melacak status online/offline bot
let botIsOnline = false

const initBot = async () => {
	try {
		await bot.init(env.DISCORD_TOKEN)
		botIsOnline = true

		// Reload perintah slash saat bot pertama kali online
		await reloadSlashCommands()
	} catch (error) {
		bot.logger.error(`Bot failed to initialize: ${error}`)
		process.exit(1)
	}
}

const repair = async (error: unknown) => {
	bot.logger.error(error)

	// Destroy bot
	await bot.destroy()

	// Inisialisasi ulang bot jika bot online sebelumnya
	if (botIsOnline) {
		await initBot()
	}
}

// Inisialisasi bot saat aplikasi dimulai
void initBot()

process.on('uncaughtException', async error => repair(error))
process.on('unhandledRejection', async error => repair(error))

// Tambahkan fungsi untuk reload perintah slash
async function reloadSlashCommands() {
	try {
		// Di sini Anda dapat menambahkan logika khusus Anda untuk mendaftarkan ulang perintah slash
		// Pastikan Anda telah mengimplementasi metode reloadSlashCommands pada Lrmn
		await reloadSlashCommands() // This line will cause a recursive call, potentially leading to a stack overflow.
		console.log('Reloaded Slash Commands successfully.')
	} catch (error) {
		console.error('Failed to reload Slash Commands:', error)
	}
}
