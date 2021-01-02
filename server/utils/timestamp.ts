export const getTimestamp = (): string => '[UTC] ' + new Date().toLocaleString('en-US', { timeZone: 'UTC' })
