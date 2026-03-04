interface ServiceEntry {
	address: string;
	port: number;
}

export class ConsulClient {
	private baseUrl: string;

	constructor(host?: string, port?: string) {
		const h = host || process.env.CONSUL_HOST || "localhost";
		const p = port || process.env.CONSUL_PORT || "8500";
		this.baseUrl = `http://${h}:${p}/v1`;
	}

	async register(
		name: string,
		port: number,
		serviceId?: string,
	): Promise<void> {
		const id = serviceId || `${name}-${port}`;
		const url = `${this.baseUrl}/agent/service/register`;

		const payload = {
			ID: id,
			Name: name,
			Address: name,
			Port: port,
			Check: {
				HTTP: `http://${name}:${port}/health`,
				Interval: "10s",
				DeregisterCriticalServiceAfter: "1m",
			},
		};

		try {
			const res = await fetch(url, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				throw new Error(`Consul responded with ${res.status}`);
			}

			console.log(`🚀 Registered ${name} (${id}) in Consul`);
		} catch (err) {
			console.error(`❌ Consul registration failed for ${name}:`, err);
		}
	}

	async deregister(serviceId: string): Promise<void> {
		const url = `${this.baseUrl}/agent/service/deregister/${serviceId}`;

		try {
			const res = await fetch(url, { method: "PUT" });

			if (!res.ok) {
				throw new Error(`Consul responded with ${res.status}`);
			}

			console.log(`🛑 Deregistered ${serviceId} from Consul`);
		} catch (err) {
			console.error(`❌ Consul deregistration failed for ${serviceId}:`, err);
		}
	}

	async discover(serviceName: string): Promise<ServiceEntry[]> {
		const url = `${this.baseUrl}/health/service/${serviceName}?passing`;

		try {
			const res = await fetch(url);

			if (!res.ok) {
				throw new Error(`Consul responded with ${res.status}`);
			}

			const data = (await res.json()) as Array<{
				Service: { Address: string; Port: number };
			}>;

			return data.map((entry) => ({
				address: entry.Service.Address,
				port: entry.Service.Port,
			}));
		} catch (err) {
			console.error(`❌ Consul discovery failed for ${serviceName}:`, err);
			return [];
		}
	}
}
