import type { Lrmn } from '../../core/Lrmn.js'

export const event = async (client: Lrmn<true>) => {
	const updateStartedMessage = client.locales.default.get('LOCALES_UPDATE_STARTED') ?? 'LOCALES_UPDATE_STARTED'
	client.logger.info(updateStartedMessage)
}
