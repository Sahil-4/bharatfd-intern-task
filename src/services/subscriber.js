import Redis from "ioredis";
import FAQ from "../models/faq.js";
import Translation from "../models/translation.js";
import { translate } from "../lib/utils.js";

// redis instances for subscriber
const redisSubscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// redis instances for worker
const redisWorker = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisSubscriber.subscribe("new_faq_added");

redisSubscriber.on("message", async (channel, message) => {
  if (channel === "new_faq_added") {
    processFAQ(message);
  }
});

const processFAQ = async (faqId) => {
  try {
    // FAQ from redis queue
    const id = await redisWorker.lpop("faq_queue");
    if (!id) return;

    // fetch FAQ from db
    const faq = await FAQ.findById(id);
    if (!faq) return;

    // most requested languages
    const topLangs = JSON.parse(await redisWorker.get("top_5_languages")) || [
      "en",
      "fr",
      "hi",
      "bn",
      "ar",
    ];

    for (const lang of topLangs) {
      // if translation already exists
      const existingTranslation = await Translation.findOne({
        originalId: faq._id,
        lang,
      });
      if (existingTranslation) continue;

      // translate
      const translatedQuestion = await translate(faq.question, lang, "text");
      const translatedAnswer = await translate(faq.answer, lang, "html");

      // save Translation
      await Translation.create({
        originalId: faq._id,
        lang,
        question: translatedQuestion,
        answer: translatedAnswer,
      });
    }
  } catch (error) {
    console.error("error processing FAQ:", error);
  }
};

export default redisSubscriber;
