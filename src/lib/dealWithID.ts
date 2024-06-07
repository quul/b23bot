import { InlineQueryResultBuilder } from 'grammy';
import { bv2av } from './avbvcovert';

type AID = `av${number}`;
type BID = `BV1${string}`;
const baseDomain = 'https://b23.tv';

const urlGenerator = (id: AID | BID) => {
	if (id.toLowerCase().startsWith('bv')) {
		return `${baseDomain}/av${bv2av(id.trim() as BID)}`;
	}
	return `${baseDomain}/${id}`;
};
const dealWithID = (id: string) => {
	const result = InlineQueryResultBuilder.article('id-0', 'b23.tv').text(urlGenerator(id as AID | BID));
	return result;
};

const dealWithURL = (url: string) => {
	const result = InlineQueryResultBuilder.article('id-0', 'b23.tv').text(url);
	return result;
};

export { dealWithID, dealWithURL };
