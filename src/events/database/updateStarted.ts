import type { Lrmn } from '../../core/Lrmn.js'

export const event = async (client: Lrmn<true>) => {
	const updateStartedMessage = client.locales.default.get('DATABASE_UPDATE_STARTED') ?? 'DATABASE_UPDATE_STARTED'
	client.logger.info(updateStartedMessage)
}
