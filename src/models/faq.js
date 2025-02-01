import { model, Schema } from "mongoose";

const FAQ = model(
  "FAQ",
  new Schema(
    {
      question: String,
      answer: String,
    },
    {
      timestamps: true,
    },
  ),
);

export default FAQ;
