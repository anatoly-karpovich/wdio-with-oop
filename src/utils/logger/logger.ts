import * as loggers from "./loggers/index.js";

const loggerServices = {
  winston: loggers.WinstonLogger
}

export default loggerServices[process.env.LOGGER || 'winston']
