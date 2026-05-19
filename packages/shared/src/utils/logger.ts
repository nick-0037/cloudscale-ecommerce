import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

const transport = pino.transport({
	targets: [
		...(isDevelopment
			? [
					{
						target: "pino-pretty",
						options: {
							colorize: true,
							levelFirst: true,
							translateTime: "SYS:standard",
						},
					},
				]
			: []),
		{
			target: "pino-socket",
			options: {
				address: process.env.LOGSTASH_HOST || "logstash",
				port: Number(process.env.LOGSTASH_PORT) || 5000,
				mode: "tcp",
			},
		},
	],
});

export const logger = pino(transport);
