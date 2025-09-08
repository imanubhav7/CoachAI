"use client";

import { generateQuiz, saveQuizResult } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFetch } from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import QuizResult from "./quiz-result";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplaination, setShowExplaination] = useState(false);

  // Generete Quiz Data 
  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  //  Save Quiz data 
  const {
    loading : savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult)

  console.log(resultData)
  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  // Handle answer Fn
  const handleAnswer = (answer) => {
      const newAnswer = [...answers]
      newAnswer[currentQuestion] = answer
      setAnswers(newAnswer)
  }

  // Handle NExt Fn .

  const handleNext = ()=> {
    if(currentQuestion < quizData.length-1){
      setCurrentQuestion(currentQuestion+1)
    setShowExplaination(false)
    }
    else{
      finishQuiz();
    }
  }

// Calculation Fn 
  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, idx) => {
      if(answer === quizData[idx].correctAnswer)
        correct++;

    })
    return (correct/quizData.length) *100;
  }

  // Finish Quiz Fn 
  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData , answers , score)
      toast.success("Quiz Completed")
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results")
    }
  }

  // Start new Quiz 

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([])
    setShowExplaination(false)
    generateQuizFn()
    setResultData(null)
  }


  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

   if (savingResult) {
    return <Loader2 className="mt-4" width={"100%"} color="gray" />;
  }


  // Show Result after complete

  if(resultData){
    return (
      <div>
        <QuizResult result ={resultData} onStartNew = {startNewQuiz}/>
      </div>
    )
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizFn}>
            {" "}
            Start Quiz{" "}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  // console.log(question)
  // console.log("Options:", question?.option);


  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>


        <RadioGroup 
        className="space-y-2"
        onValueChange = {handleAnswer}
        value = {answers[currentQuestion]}
        >

          {question.option.map((option, index) => {
            return (
              <div className="flex items-center space-x-2 " key={index}>
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${option}`}>{option}</Label>
              </div>
            );
          })}
        </RadioGroup>

          {showExplaination && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">Explaination: </p>
              <p className="text-muted-foreground">{question.explaination}</p>
            </div>
          )}

      </CardContent>

      {/* Explaination  */}

      <CardFooter >
        {!showExplaination && (
          <Button 
          onClick={() => setShowExplaination(true)}
          variant="outline"
          disabled = {!answers[currentQuestion]}
          >
            Show Explaination
          </Button>
        )}

        {/* //Next Question Button */}

        <Button 
          onClick={handleNext}
          className="ml-auto"
          disabled = {!answers[currentQuestion] || savingResult}
          >
            
            {currentQuestion < quizData.length-1 ? "Next Question" : "Finish Quiz"}
          </Button>

      </CardFooter>
    </Card>
  );
};
export default Quiz;
