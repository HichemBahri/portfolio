import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import type { MessageResp, MessageRespError } from "../models/MessageResp";
import { projects } from "~/_data/projects-data";
import { mainContent as aboutContent } from "~/_data/about-data";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateSystemPrompt = () => {
  let context = "**Context about Mohamed Hichem Bahri:**\n\n";

  // --- About Me Section ---
  context += "--- ABOUT ME ---\\n";
  for (const [key, value] of Object.entries(aboutContent)) {
    // Exclude placeholder content that is not useful for the assistant
    if (!value.content.includes("Select a sub-category")) {
      context += `\n**Section: ${key}**\n`;
      context += `${value.content}\n`;
    }
  }

  // --- Projects Section ---
  context += "\n--- PROJECTS ---\\n";
  projects.forEach((project) => {
    context += `\n**Project: ${project.title}**\n`;
    context += `- Description: ${project.longDescription}\n`;
    context += `- Technologies: ${project.technologies
      .map((t) => t.name)
      .join(", ")}\n`;

    try {
      const markdownPath = path.join(
        process.cwd(),
        "app",
        "_data",
        "content",
        project.markdownFilename,
      );
      const markdownContent = fs.readFileSync(markdownPath, "utf-8");
      context += `\n**Project Details (from Markdown):**\n${markdownContent}\n`;
    } catch (error) {
      console.warn(
        `Warning: Could not read markdown file for project "${project.title}": ${project.markdownFilename}`,
      );
      // If markdown is missing, we just skip it.
    }
    context += "\n---\\n";
  });

  const systemPrompt = `
You are a helpful and friendly AI assistant embedded in the personal portfolio of Mohamed Hichem Bahri, a data engineer.
Your name is "Portfolio Assistant".

You must answer questions based *only* on the following context about Hichem. Do not use any external knowledge.
If a question is outside of this context, you must politely decline and say "I can only answer questions about Hichem's experience, skills, and projects."

${context}

When answering, be conversational and refer to Hichem in the third person (e.g., "Hichem's experience includes...").
If someone asks about availability, mention that he is looking for a six-month master's thesis internship starting February 2027, in Italy or France.
`;

  return systemPrompt;
};

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message: string };

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const systemPrompt = generateSystemPrompt();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply } satisfies MessageResp, { status: 200 });
  } catch (error) {
    console.error("Error in Groq API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" } satisfies MessageRespError,
      { status: 500 },
    );
  }
}