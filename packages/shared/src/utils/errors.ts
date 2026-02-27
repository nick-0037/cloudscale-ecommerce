export class AppError extends Error {
	public readonly status: number;
	public readonly details?: any;
	public readonly isOperational: boolean;

	constructor(status: number, message: string, details?: any) {
		super(message);

		this.name = this.constructor.name;
		this.status = status;
		this.details = details;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
