const handleB23WTF = async (url: string) => {
	const resp = await fetch(`https://b23.wtf/api?full=${encodeURI(url)}&status=200`);
	const result = (await resp.text()).split('\r\n')[0];
	return result;
};

export {handleB23WTF}