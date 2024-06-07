const handleB23WTF = async (url: string) => {
	const req = fetch(url);
	const resp = await fetch(url, { redirect: 'manual' });
	const result = (await resp.text()).split('\r\n')[0];
	return result;
};

export {handleB23WTF}