import React from "react";


import BooleanQuestion from "./BooleanQuestion";
import MCQQuestion from "./MultipleChoice";
import MSQQuestion from "./MultipleSelect";
import NumericQuestion from "./NumericQuestion";
import DescriptiveQuestion from "./DescriptiveQuestion";
import { Question, ResponseOption as _ResponseOption } from "@/services/database/migrations/v1/schema_v1";

export default function QuestionRenderer({
  question,
  responses,
  answer,
  setAnswer,
}: {
  question: Question;
  responses: _ResponseOption[]; // Filtered responses for this question
  answer: any;
  setAnswer: (val: any) => void;
}) {
  switch (question.type) {
    case "mcq":
      return (
        <MCQQuestion
          question={question}
          responses={responses}
          value={answer}
          onChange={setAnswer}
        />
      );
    case "msq":
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
    case "numeric":
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
