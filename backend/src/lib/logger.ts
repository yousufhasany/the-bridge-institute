import { env, isTest } from '../config/env.js';

type LogFields = Record<string, unknown>;
type LogFn = (first: unknown, second?: string) => void;

export type AppLogger = {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: LogFn;
  debug: LogFn;
  trace: LogFn;
  child: () => AppLogger;
};

const SECRET_KEY = /password|token|authorization|cookie|secret/i;
const LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 4 || value == null) return value;
  if (value instanceof Error) return { name: value.name, message: value.message };
  if (typeof value !== 'object') return value;
  const out: LogFields = {};
  for (const [key, item] of Object.entries(value as LogFields)) {
    out[key] = SECRET_KEY.test(key) ? '[redacted]' : sanitize(item, depth + 1);
  }
  return out;
}

function enabled(level: (typeof LEVELS)[number]) {
  if (isTest || env.LOG_LEVEL === 'silent') return false;
  return LEVELS.indexOf(level) <= LEVELS.indexOf(env.LOG_LEVEL);
}

function write(level: (typeof LEVELS)[number], first: unknown, second?: string) {
  if (!enabled(level)) return;
  const fields: LogFields =
    typeof first === 'string' ? { msg: first } : { ...(sanitize(first) as LogFields), msg: second };
  const line = JSON.stringify({ level, ...fields });
  if (level === 'error' || level === 'fatal') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

function createLogger(): AppLogger {
  return {
    fatal: (first, second) => write('fatal', first, second),
    error: (first, second) => write('error', first, second),
    warn: (first, second) => write('warn', first, second),
    info: (first, second) => write('info', first, second),
    debug: (first, second) => write('debug', first, second),
    trace: (first, second) => write('trace', first, second),
    child: () => createLogger(),
  };
}

export const logger = createLogger();
