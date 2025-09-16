import {
  Question,
  ResponseOption as _ResponseOption,
} from "@/services/database/migrations/v1/schema_v1";
import React from "react";
import BooleanQuestion from "./BooleanQuestion";
import DescriptiveQuestion from "./DescriptiveQuestion";
import MCQQuestion from "./MultipleChoice";
import MSQQuestion from "./MultipleSelect";
import NumericQuestion from "./NumericQuestion";

export default function QuestionRenderer({
  question,
  responses,
  answer,
  setAnswer,
  setCustomOption,
}: {
  question: Question;
  responses: _ResponseOption[]; // Filtered responses for this question
  answer: any;
  setAnswer: (val: any) => void;
  setCustomOption: (ques_id: number, val: string) => void;
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
          handleAddOption={setCustomOption}
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
      // Provide a default instructions JSON when missing so the UI works out of the box
      // You can remove or change this once backend provides real instructions
      const numericQuestion =
        question.instructions && question.instructions.trim().length > 0
          ? question
          : ({
              ...question,
              instructions: JSON.stringify({
                subtype: "decimal",
                units: "kg",
                // min: 0,
                max: 200,
                precision: 2,
              }),
            } as Question);
      return (
        <NumericQuestion
          question={numericQuestion}
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
