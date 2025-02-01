import { model, Schema, Types } from "mongoose";

const Translation = model(
  "Translation",
  new Schema(
    {
      original: {
        type: Types.ObjectId,
        ref: "faq",
      },
      lang: {
        type: String,
        index: true,
      },
      question: String,
      answer: String,
    },
    {
      timestamps: true,
    },
  ),
);

export default Translation;
