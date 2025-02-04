const questionInputTag = document.getElementById("question");
const postButton = document.getElementById("postButton");
const langChoice = document.getElementById("langChoice");
const fetchFAQsButton = document.getElementById("fetchFAQsButton");
const faqsList = document.getElementById("faqsList");

const postFAQ = async (question, answer) => {
  await fetch("/api/faq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      answer,
    }),
  });
};

postButton.addEventListener("click", () => {
  const question = questionInputTag.value;
  const answer = tinymce.activeEditor.getContent();

  if (question === "" || answer === "") {
    alert("both question and answer feild is required.");
    return;
  }

  console.log(question);
  console.log(answer);

  postFAQ(question, answer);
});

const newFAQItem = (faq) => {
  // render faq.question in an h2 and faq.answer inside a div
  const faqItem = document.createElement("div");

  const questionElement = document.createElement("h2");
  questionElement.innerText = faq.question;
  const answerElement = document.createElement("div");
  answerElement.innerHTML = faq.answer;

  faqItem.appendChild(questionElement);
  faqItem.appendChild(answerElement);

  return faqItem;
};

const fetchFAQs = async () => {
  const response = await fetch(`/api/faq?lang=${langChoice.value}`);
  const data = (await response.json()).data;

  const nodes = data.map((faq) => newFAQItem(faq));
  faqsList.append(...nodes);
};

fetchFAQsButton.addEventListener("click", fetchFAQs);
