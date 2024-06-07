import { Bot, Context, webhookCallback } from "grammy"
import { dealWithID, dealWithURL } from "./lib/dealWithID";
import { handleB23WTF } from "./lib/handleB23WTF";

export interface Env {
  BOT_INFO: string;
  BOT_TOKEN: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

    bot.command("start", async (ctx: Context) => {
      await ctx.reply("Hello, world!");
    });

	bot.on("inline_query", async (ctx)=>{
		const query = ctx.inlineQuery.query
		if (!query) {
			return
		}

		const regexAVID = /([Aa][Vv]\d+)/g
		const regexBVID = /([Bb][Vv]1[0-9A-Za-z]{8})/g
		const regexB23TV = /(?:https?:\/\/)?(?:www\.)?b23\.tv\/(BV1[0-9A-Za-z]{8}|[Aa][Vv]\d+|[0-9A-Za-z]+)\/?/
		const regexB23WTF = /(?:https?:\/\/)?(?:www\.)?b23\.w?tf\/(BV1[0-9A-Za-z]{8}|[Aa][Vv]\d+|[0-9A-Za-z]+)\/?/
		const regexBilibiliCom = /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV1[0-9A-Za-z]{8}|[Aa][Vv]\d+)\/?/

		// Proceed
		let match: RegExpMatchArray | null
		if (match = query.match(regexBilibiliCom)) {
			const id = query[1]
			await ctx.answerInlineQuery(
				[dealWithID(id)],
				{cache_time: 30 * 24 * 3600}
			)
			return
		}
		// if (match = query.match(regexB23WTF)) {
		// 	const url = match[0]
		// 	const redirectURL = await handleB23WTF(url)
		// 	await ctx.answerInlineQuery(
		// 		[dealWithURL(redirectURL)]
		// 	)
		// 	return
		// }
		if (match = query.match(regexB23TV)) {
			const pattern = match[1]
			switch(pattern.toLowerCase().slice(0,2)) {
				case 'av':
				// fall through
				case 'bv':
					await ctx.answerInlineQuery(
						[dealWithID(pattern)]
					)
					break
				default:
					await ctx.answerInlineQuery(
						[dealWithURL(`https://b23.tf/${pattern}`)]
					)
			}
			return
		}
		if (match = query.match(regexAVID)) {
			const avid = match[0]
			await ctx.answerInlineQuery(
				[dealWithID(avid)]
			)
			return
		}
		if (match = query.match(regexBVID)) {
			const bvid = match[0]
			await ctx.answerInlineQuery(
				[dealWithID(bvid)]
			)
		}
	})

    return webhookCallback(bot, "cloudflare-mod")(request);
  },
};