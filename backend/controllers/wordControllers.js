import { generate } from "random-words";
export function paragraph_Generator(req, res) {
  const randomWords = generate({ min: 50, max: 100 });
  console.log(randomWords);
  const paragraph = randomWords.join(" ");
  console.log(paragraph);
  res.send(paragraph);
}
