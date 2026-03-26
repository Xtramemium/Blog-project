export async function request(url, method = 'GET', data) {
	try {
		const response = await fetch(url, {
			headers: {
				'content-type': 'application/json',
			},
			credentials: 'same-origin',
			method,
			body: data ? JSON.stringify(data) : undefined,
		});

		const isJsonResponse = response.headers.get('content-type')?.includes('application/json');
		const payload = isJsonResponse ? await response.json() : {};

		if (!response.ok) {
			return {
				error: payload.error || `Request failed with status ${response.status}`,
				data: payload.data || null,
				status: response.status,
			};
		}

		return {
			error: null,
			status: response.status,
			...payload,
		};
	} catch (error) {
		return {
			error: 'Не удалось выполнить запрос. Попробуйте еще раз.',
			data: null,
			status: 0,
		};
	}
}
