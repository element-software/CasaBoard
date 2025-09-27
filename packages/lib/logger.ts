import pino from 'pino';

const BLUE = '\u001b[34m';
const ORANGE = '\u001b[38;5;208m';
const RESET = '\u001b[0m';

const isBrowser = typeof window !== 'undefined';
const isProd = process.env.NODE_ENV === 'production';

// Pretty printing for development; JSON in production
const transport = !isProd
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: true,
      },
    }
  : undefined;

const baseLogger = pino({ level: 'info' }, transport as any);

function prefix(scope: 'SERVER' | 'CLIENT') {
  const color = scope === 'SERVER' ? BLUE : ORANGE;
  return `${color}${scope}${RESET}`;
}

function format(scope: 'SERVER' | 'CLIENT', fn: string, msg: any, args: any[]) {
  const head = `${prefix(scope)} ${fn}:`;
  if (args && args.length) return [head, msg, ...args];
  return [`${head} ${msg}`];
}

export function createLogger(scope: 'SERVER' | 'CLIENT') {
  return {
    info(fn: string, msg: any, ...args: any[]) {
      baseLogger.info(...(format(scope, fn, msg, args) as [any]));
    },
    warn(fn: string, msg: any, ...args: any[]) {
      baseLogger.warn(...(format(scope, fn, msg, args) as [any]));
    },
    error(fn: string, msg: any, ...args: any[]) {
      baseLogger.error(...(format(scope, fn, msg, args) as [any]));
    },
    debug(fn: string, msg: any, ...args: any[]) {
      baseLogger.debug(...(format(scope, fn, msg, args) as [any]));
    },
  };
}

export const serverLogger = createLogger('SERVER');
export const clientLogger = createLogger('CLIENT');


