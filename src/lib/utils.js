import { translate as ttranslate } from "@vitalets/google-translate-api";

/**
 * translate input content to target language
 * @param {*} content text/html to be translated
 * @param {*} targetLang target lang in which content is to be translated
 * @returns translatedText:string
 */
const translate = async (content, targetLang) => {
  const data = await ttranslate(content, { to: targetLang });
  return data.text;
};

export { translate };
