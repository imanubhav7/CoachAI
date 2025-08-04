"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      industry: true,
    },
  });

  if (!user) throw new Error("User Not Found");

  try {
    const prompt = `
         Generate 10 technical interview questions for a ${user.industry}
         professional${
           user.skills?.length
             ? `with expertise in ${user.skills.join(", ")}`
             : ""
         }.

         Each question should be multiple choice with 4 options.

         Return the responnse in this JSON format only, no additional text: 
         {
            "question" : [
            {
                "question" : "string",
                "option" : ["string", "string", "string", "string"],
                "correctAnswer" : "string",
                "explanation" : "string"
            }
            ]
         }
         `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    const cleanedText = text
      .replace(/```json\n?/g, "") // remove ```json
      .replace(/```/g, "") // remove closing ```
      .trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.question;
  } catch (error) {
    console.error("Error generating quiz", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(question, answer, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      industry: true,
    },
  });

  if (!user) throw new Error("User Not Found");

  const questionResults = question.map((q, idx) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: q.answer[idx],
    isCorrect: q.correctAnswer === answer[idx],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  let improvementTip = nulll;
  if (wrongAnswers.length > 0) {
    const wrongQuestionText = wrongAnswers
      .map(
        (q) =>
          `Question: ${question} "\nCorrect Answer : ${q.answer} "\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
            The user got the following ${user.industry} technical interview questions wrong : 
            ${wrongQuestionText} 

            Based on these mistakes, provide a concise, specific improvent tip.
            Focus on the knowledge gaps revealed by these wrong answers.
            Keep the response under 2 sentences and make it encouraging.
            Don't explicitly mention the mistakes, intead focus on what to learn/practice
            `;

    try {
      const result = await model.generateContent(improvementPrompt);
      const response = result.response;
      improvementTip = await response.text().trim;
    } catch (error) {
      console.error("Error generating improvement tip :", error);
    }

    try {
        const assesment = await db.assessment.create({
            data:{
                userId: user.id,
                quizScore: score,
                questions: questionResults,
                category: "Technical",
                improvementTip
            }
        })
        return assesment
    } catch (error) {
            console.error("Error having quiz result:", error);
            throw new Error ("Failed to save quiz result")
    }


  }
}
