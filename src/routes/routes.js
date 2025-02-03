import { Router } from "express";
import FAQ from "../models/faq.js";
import Translation from "../models/translation.js";
import redis from "../lib/redis.js";

const router = Router();

router.get("/faq", async (req, res) => {
  try {
    const { lang = "en" } = req.query;

    // fetch lang FAQs from db
    const faqs = await Translation.find({ lang });

    // increment the count for this language in redis
    await redis.zincrby("faq_lang_count", 1, lang);

    // top 5 most requested languages
    const topLangs = await redis.zrevrange("faq_lang_count", 0, 4);

    // update the top 5 languages in redis
    await redis.set("top_5_langs", JSON.stringify(topLangs));

    // return response
    res
      .status(200)
      .send({ success: true, message: "fetched faqs", data: faqs });
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .send({ success: false, message: error.message, data: null });
  }
});

router.post("/faq", async (req, res) => {
  try {
    const { question, answer } = req.body;

    // save into db
    const faq = await FAQ.create({
      question,
      answer,
    });

    // push FAQ id to redis queue
    await redis.rpush("faq_queue", faq._id.toString());

    // publish "new_faq_added" event
    await redis.publish("new_faq_added", faq._id.toString());

    // send success response to client
    res.status(200).send({ success: true, message: "added faq", data: [faq] });
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .send({ success: false, message: error.message, data: null });
  }
});

export default router;
