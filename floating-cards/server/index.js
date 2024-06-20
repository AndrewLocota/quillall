import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// Use CORS middleware to allow requests from different origins
app.use(cors());
app.use(bodyParser.json());

app.post("/api/update_content", async (req, res) => {
  try {
    const { content } = req.body;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an inquisitive and novel expert business consultant. You will, in 50 words, explain the business idea as given by the user to prepare it for further model analysis.",
        },
        {
          role: "user",
          content: content,
        },
      ],
    });

    const responseMessage = chatCompletion.choices[0].message.content;
    res.status(200).send({ answer: responseMessage });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).send({ error: "Failed to update content" });
  }
});

// New API endpoint for node click
app.post("/api/node_click", async (req, res) => {
  try {
    const { content } = req.body;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an inquisitive and novel expert business consultant. Provide two options as a response in 20 words, taking the immediate clear and valuable next step for the idea. Preface one with 'Option 1:' and the other with 'Option 2:'.",
        },
        {
          role: "user",
          content: content,
        },
      ],
    });

    const responseMessage = chatCompletion.choices[0].message.content;
    res.status(200).send({ answer: responseMessage });
  } catch (error) {
    console.error("Error processing node click:", error);
    res.status(500).send({ error: "Failed to process node click" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
