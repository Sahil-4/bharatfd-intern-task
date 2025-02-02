import { Router } from "express";
import FAQ from "../models/faq.js";
import Translation from "../models/translation.js";

const router = Router();

router.get("/faq", async (req, res) => {
  try {
    const { lang = "en" } = req.query;

    // fetch lang FAQs from db
    const faqs = await Translation.find({ lang });

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

    // send success response to client
    res.status(200).send({ success: true, message: "added faq", data: [faq] });

    // run cron jobs to translate and store faq
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .send({ success: false, message: error.message, data: null });
  }
});

export default router;
