import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on http://localhost:3000");
});

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatCompletion = await openAIClient.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "You are inside my API in js! It worked!!!!!!",
    },
  ],
});

app.get("/", (req, res) => {
  res.send(chatCompletion.choices[0].message.content);
});

console.log(chatCompletion.choices[0].message.content);
