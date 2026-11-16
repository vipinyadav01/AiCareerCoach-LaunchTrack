"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/app/screen";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return (
      <div className="space-y-4" role="status" aria-live="polite">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Writing ten questions for your profile
        </p>
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (resultData) {
    return <QuizResult result={resultData} onStartNew={startNewQuiz} />;
  }

  if (!quizData) {
    return (
      <div className="space-y-6">
        <ul className="space-y-2 text-[15px] leading-relaxed">
          <li>Ten multiple-choice questions on your industry and skills.</li>
          <li>Check the explanation after each answer, or keep going.</li>
          <li>Your score is saved when you finish.</li>
        </ul>
        <Button onClick={generateQuizFn} size="lg">
          Start quiz
        </Button>
      </div>
    );
  }

  const question = quizData[currentQuestion];
  const isLast = currentQuestion === quizData.length - 1;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="tabular text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quizData.length}
        </p>
        <Progress
          value={((currentQuestion + 1) / quizData.length) * 100}
          className="h-1 bg-muted"
          aria-label="Quiz progress"
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="text-xl font-medium leading-snug tracking-[-0.01em]">{question.question}</legend>
        <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestion]} className="gap-2">
          {question.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-3 text-[15px] font-normal leading-snug transition-colors hover:bg-muted/60 active:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <span>{option}</span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      {showExplanation && (
        <div className="rounded-lg bg-muted px-4 py-3" role="status">
          <p className="text-sm font-medium">Why</p>
          <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t pt-5">
        {!showExplanation ? (
          <Button onClick={() => setShowExplanation(true)} variant="ghost" disabled={!answers[currentQuestion]}>
            Show explanation
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={handleNext} disabled={!answers[currentQuestion] || savingResult}>
          {savingResult && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {isLast ? (savingResult ? "Saving" : "Finish quiz") : "Next question"}
        </Button>
      </div>
    </div>
  );
}
