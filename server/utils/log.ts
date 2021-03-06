import chalk from 'chalk'

const tag = (text: string) => chalk.whiteBright(text)

export const wsLogTag = tag(chalk.bgGreen(` WebSockets `))
export const httpLogTag = tag(chalk.bgMagenta(` HTTP `))
