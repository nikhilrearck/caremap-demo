import {
  QuestionWithOptions,
  TrackCategoryWithItems,
  TrackCategoryWithSelectableItems,
} from "@/services/common/types";
import { createContext, PropsWithChildren, useCallback, useState } from "react";

interface TrackContextType {
  categories: TrackCategoryWithItems[];
  setCategories: (categories: TrackCategoryWithItems[]) => void;

  questions: QuestionWithOptions[];
  setQuestions: (questions: QuestionWithOptions[]) => void;

  selectableItems: TrackCategoryWithSelectableItems[];
  setSelectableItems: (
    selectableItems: TrackCategoryWithSelectableItems[]
  ) => void;

  selectedDate: string;
  setSelectedDate: (date: string) => void;

  refreshData: boolean;
  setRefreshData: (refresh: boolean) => void;
}

export const TrackContext = createContext<TrackContextType>({
  categories: [],
  setCategories: () => {},

  questions: [],
  setQuestions: () => {},

  selectableItems: [],
  setSelectableItems: () => {},

  selectedDate: new Date().toISOString().split("T")[0],
  setSelectedDate: () => {},

  refreshData: false,
  setRefreshData: () => {},
});

export function TrackProvider({ children }: PropsWithChildren) {
  const [categories, setCategoriesState] = useState<TrackCategoryWithItems[]>(
    []
  );

  const [questions, setQuestionsState] = useState<QuestionWithOptions[]>([]);

  const [selectableItems, setSelectableItemsState] = useState<
    TrackCategoryWithSelectableItems[]
  >([]);

  const [selectedDate, setSelectedDateState] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [refreshData, setRefreshData] = useState<boolean>(false);

  //-----------------------------------------------------------------------------------

  const setCategories = useCallback((data: TrackCategoryWithItems[]) => {
    setCategoriesState(data);
  }, []);

  const setQuestions = useCallback((data: QuestionWithOptions[]) => {
    setQuestionsState(data);
  }, []);

  const setSelectableItems = useCallback(
    (data: TrackCategoryWithSelectableItems[]) => {
      setSelectableItemsState(data);
    },
    []
  );

  const setSelectedDate = useCallback((date: string) => {
    setSelectedDateState(date);
  }, []);

  return (
    <TrackContext.Provider
      value={{
        categories,
        setCategories,
        questions,
        setQuestions,
        selectableItems,
        setSelectableItems,
        selectedDate,
        setSelectedDate,
        refreshData,
        setRefreshData,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
}
