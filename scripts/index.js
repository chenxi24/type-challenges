import prompts from "prompts";
import axios from "axios";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const questions = [
    {
      type: "text",
      name: "template",
      message: `Please enter the name or number of the template you want`,
    },
  ];

  const { template } = await prompts(questions);

  let reg = /\d/.test(template)
    ? new RegExp(`${template}-`)
    : new RegExp(`${template}`);

  const { data } = await axios
    .get(
      "https://api.github.com/repos/type-challenges/type-challenges/contents/questions"
    )
    .catch((err) => console.log(err));

  const matchArr = data.map((m) => m.name).filter((m) => reg.test(m));

  const dirname = matchArr[matchArr.length - 1];

  const files = ["template.ts", "test-cases.ts", "README.zh-CN.md"];

  const request = [];

  for (const filename of files) {
    request.push(
      axios.get(
        `https://api.github.com/repos/type-challenges/type-challenges/contents/questions/${dirname}/${filename}`
      )
    );
  }

  Promise.allSettled(request)
    .then((results) => {
      const questionsDir = path.resolve(__dirname, "../questions");
      const templateDir = path.resolve(questionsDir, dirname);

      if (!fs.existsSync(questionsDir)) {
        fs.mkdirSync(questionsDir);
      }

      if (!fs.existsSync(templateDir)) {
        fs.mkdirSync(templateDir);
      }

      for (const result of results) {
        const filename = path.resolve(templateDir, result.value.data.name);

        if (result.value.data.content) {
          fs.writeFileSync(
            filename,
            new Buffer.from(result.value.data.content, "base64").toString()
          );
        }
      }
    })
    .catch((err) => console.log(err));
})();
