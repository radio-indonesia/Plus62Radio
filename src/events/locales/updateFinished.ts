import type { Lrmn } from '../../core/Lrmn.js'

export const event = async (client: Lrmn<true>) => {
	const updateFinishedMessage = client.locales.default.get('LOCALES_UPDATE_FINISHED') ?? 'LOCALES_UPDATE_FINISHED'
	client.logger.info(updateFinishedMessage)
}
