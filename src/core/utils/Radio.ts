import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { PlayerNodeInitializerOptions, TrackLike } from 'discord-player'
import { Player } from 'discord-player'
import type { VoiceChannel } from 'discord.js'
import { Collection } from 'discord.js'
import { Parser } from 'icecast-parser'
import type {
	IStationData,
	TChoiceStation,
	TGuildIdResolvable,
	TLocaleCode,
	TStationCollection,
	TStationResolvable,
	TStationSettings
} from '../../types/default.js'
import { isStationData, isURL } from '../../types/guards.js'
import type { Lrmn } from '../Lrmn.js'
import { importJSON, isFolderValid, isValidJSON, resolveGuildId, resolveURL } from './Utils.js'

export class Radio extends Player {
	private readonly _stations: Collection<string, IStationData>

	private readonly _localized: Collection<TLocaleCode, TStationCollection>

	private readonly _options: PlayerNodeInitializerOptions<unknown>

	public constructor(
		public override client: Lrmn,
		public stationFolderPath: string
	) {
		super(client)
		this._options = {
			nodeOptions: {
				disableHistory: true,
				leaveOnEnd: false,
				leaveOnStop: false,
				leaveOnEmpty: false,
				selfDeaf: true
			}
		}

		this._stations = new Collection<string, IStationData>()
		this._localized = new Collection<TLocaleCode, TStationCollection>()

		this._fetch()
		this.client.locales.once('fetchFinished', () => this._translateStations())
		this.client.database.once('updateFinished', async () => this._launch())
	}

	public get stations() {
		return [...this._stations.values()]
	}

	public async set(guildIdResolvable: TGuildIdResolvable, settings: TStationSettings) {
		const guildId = resolveGuildId(guildIdResolvable)
		const guild = this.client.guilds.cache.get(guildId)
		if (!guild) throw new Error('Invalid guild')

		const guildSettings = this.client.database.get(guild.id)
		const voiceChannel = guild.channels.cache.find((c): c is VoiceChannel => c.id === settings.voiceChannelId)
		if (!voiceChannel) throw new Error('Invalid voice channel data')

		const station = this.resolveStation(settings.stationURL)
		if (!station) throw new Error('Invalid station data')

		await this.client.database.set(guild.id, { ...guildSettings, ...settings })

		const resolvedURL = await resolveURL(settings.stationURL)
		if (!resolvedURL) throw new Error('Unable to resolve station URL')

		await this.play(voiceChannel, resolvedURL, this._options)
	}

	public async reset(guildIdResolvable: TGuildIdResolvable) {
		const guildId = resolveGuildId(guildIdResolvable)
		const guild = this.client.guilds.cache.get(guildId)
		if (!guild) throw new Error('Invalid guild data')

		const queue = this.queues.get(guild)
		if (queue?.currentTrack) queue.delete()

		await this.client.database.setDefaults(guild.id)
	}

	public async change(guildIdResolvable: TGuildIdResolvable, stationResolvable: TStationResolvable) {
		const guildId = resolveGuildId(guildIdResolvable)
		const guild = this.client.guilds.cache.get(guildId)
		if (!guild) return

		const guildSettings = this.client.database.get(guild.id)
		const station = this.resolveStation(stationResolvable)
		if (!station) throw new Error('Invalid station data')

		const voiceChannel = guild.channels.cache.find((c): c is VoiceChannel => c.id === guildSettings?.voiceChannelId)
		if (!voiceChannel) throw new Error('Invalid voice channel data')

		const resolvedURL = await resolveURL(station.url)
		if (!resolvedURL) throw new Error('Unable to resolve station URL')

		try {
			const queue = this.queues.get(guild)
			const currentTrack = queue?.currentTrack

			await this.play(voiceChannel, resolvedURL, this._options)
			await this.client.database.set(guild.id, { ...guildSettings, stationURL: station.url })

			if (currentTrack) queue.node.skip()
		} catch {
			throw new Error('Unable to change station')
		}
	}

	public async getCurrentTrackTitle(guildIdResolvable: TGuildIdResolvable) {
		const guildId = resolveGuildId(guildIdResolvable)
		const guild = this.client.guilds.cache.get(guildId)
		if (!guild) return

		const guildSettings = this.client.database.get(guild.id)
		if (!guildSettings?.stationURL) return

		const resolvedURL = await resolveURL(guildSettings.stationURL)
		if (!resolvedURL) return null

		const parser = new Parser({
			autoUpdate: true,
			keepListen: false,
			url: resolvedURL
		})

		return new Promise<string | null>(resolve => {
			parser.once('metadata', m => resolve(m.get('StreamTitle') ?? null))
			parser.once('error', () => resolve(null))
			parser.once('empty', () => resolve(null))
		})
	}

	public resolveStation(resolvable: TStationResolvable) {
		if (isStationData(resolvable)) return resolvable
		if (isURL(resolvable)) return this._stations.find(s => s.url === resolvable)
		return this._stations.find(s => s.name === resolvable) ?? this._stations.get(resolvable)
	}

	private async _launch() {
		await this.extractors.loadDefault()

		const allGuildSettings = this.client.database.getAll()
		if (!allGuildSettings.size) return

		for (const guild of this.client.guilds.cache.values()) {
			const guildSettings = allGuildSettings.get(guild.id)!
			const { stationURL, voiceChannelId } = guildSettings
			if (!stationURL || !voiceChannelId) continue

			const voiceChannel = guild.channels.cache.find((c): c is VoiceChannel => c.id === voiceChannelId)
			if (!voiceChannel) continue

			const resolvedURL = await resolveURL(stationURL)
			if (!resolvedURL) return

			try {
				void this.play(voiceChannel, resolvedURL, this._options)
			} catch (error) {
				this.client.logger.error(error)
			}
		}
	}

	private _fetch() {
		if (!isFolderValid(this.stationFolderPath)) return

		for (const stationFile of readdirSync(this.stationFolderPath)) {
			const stationFilePath = join(this.stationFolderPath, stationFile)
			if (!isValidJSON(stationFilePath)) continue

			const station = importJSON<IStationData>(stationFilePath)
			this._stations.set(stationFile.split('.')[0], station)
		}
	}

	private _translateStations() {
		for (const localeCode of this.client.locales.allowed) {
			const locale = this.client.locales.resolve(localeCode)
			const localizedStationCollection = new Collection<string, IStationData>()
			for (const [stationName, station] of this._stations.entries()) {
				const translatedDescription = locale.get(station.description) ?? station.description
				const localizedStation = { ...station, description: translatedDescription }
				localizedStationCollection.set(stationName, localizedStation)
			}

			this._localized.set(localeCode, localizedStationCollection)
		}
	}
}
