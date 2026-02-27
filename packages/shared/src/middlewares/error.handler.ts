import { ErrorRequestHandler } from "express";

export const globalErrorHandler: ErrorRequestHandler = (
	err,
	req,
	res,
	next,
) => {
	const status = err.status || 500;
	const isProduction = process.env.NODE_ENV === "production";

	console.error(
		`[${new Date().toISOString()}] ${req.method} ${req.url} - Error:`,
		err.message,
	);
	if (status === 500) {
		console.error(err);
	}

	res.status(status).json({
		status: "error",
		message:
			status === 500 && isProduction
				? "Internal Server Error"
				: err.message || "Internal Server Error",
		details: err.details || null,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
