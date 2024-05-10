type LogFn = (...values: unknown[]) => void;

export interface ILogger {
	(...values: unknown[]): void;
	info: LogFn;
	warn: LogFn;
	error: LogFn;
}

export class LoggerBuilder {
	public static build(key: string) {
		const prefix = `{${key}}`;
		const result = this.buildAction(prefix, 'log') as ILogger;
		result.info = this.buildAction(prefix, 'info');
		result.warn = this.buildAction(prefix, 'warn');
		result.error = this.buildAction(prefix, 'error');
		return result;
	}

	private static buildAction(prefix: string, name: 'log' | 'info' | 'warn' | 'error') {
		return (...values: unknown[]) => console[name](prefix, ...values);
	}
}
