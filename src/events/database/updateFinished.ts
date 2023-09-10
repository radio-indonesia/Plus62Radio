import type { Lrmn } from '../../core/Lrmn.js'

export const event = async (client: Lrmn<true>) => {
	const updateFinishedMessage = client.locales.default.get('DATABASE_UPDATE_FINISHED') ?? 'DATABASE_UPDATE_FINISHED'
	client.logger.info(updateFinishedMessage)
}
