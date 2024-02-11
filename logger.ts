import winston from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'

const loggerOpts =  winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport({ 
      transformer: ({ message, timestamp, level, meta }) => ({
        "@timestamp": timestamp,
        message,
        level,
        meta
      }),
      level: 'info',
      index: 'todo-api',
      clientOpts: {
        node: '',
        auth: {
          apiKey: '',
        }
      }
    })
  ]
})

export const log = (message: string, operation?: string, data?: Record<string, any>,): void => {
  loggerOpts.info({ message, data, operation })
}

export const error = (error: Error, operation?: string): void => {
  loggerOpts.error({ message: error?.message, operation})
}