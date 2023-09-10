import type { Lrmn } from '../../core/Lrmn.js'

export const event = async (client: Lrmn<true>) => {
	const loggedInMessage = client.locales.default.get('LOGGED_IN') ?? 'LOGGED_IN'
	client.logger.info(loggedInMessage.replace('{CLIENT_USER}', client.user.tag))
}
