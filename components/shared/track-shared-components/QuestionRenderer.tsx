import React from "react";


import BooleanQuestion from "./BooleanQuestion";
import MCQQuestion from "./MultipleChoice";
import MSQQuestion from "./MultipleSelect";
import NumericQuestion from "./NumericQuestion";
import DescriptiveQuestion from "./DescriptiveQuestion";
import { Question, Response } from "@/context/TrackContext";

export default function QuestionRenderer({
  question,
  responses,
  answer,
  setAnswer,
}: {
  question: Question;
  responses: Response[]; // Filtered responses for this question
  answer: any;
  setAnswer: (val: any) => void;
}) {
  switch (question.type) {
    case "single-choice":
      return (
        <MCQQuestion
          question={question}
          responses={responses}
          value={answer}
          onChange={setAnswer}
        />
      );
    case "multi-choice":
      return (
        <MSQQuestion
          question={question}
          responses={responses}
          value={answer}
          onChange={setAnswer}
        />
      );
    case "boolean":
      return (
        <BooleanQuestion
          question={question}
          responses={responses}
          value={answer}
          onChange={setAnswer}
        />
      );
    case "counter":
      return (
        <NumericQuestion
          question={question}
          responses={responses}
          value={answer}
          onChange={setAnswer}
        />
      );
    case "text":
      return (
        <DescriptiveQuestion
          question={question}
          responses={responses}
          value={answer}
          onChange={setAnswer}
        />
      );
    default:
      return null;
  }
}
