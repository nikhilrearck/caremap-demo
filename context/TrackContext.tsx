import React, { createContext, useContext, useState } from "react";

export interface TrackCategory {
  id: number;
  name: string;
  created_date?: string;
  updated_date?: string;
}

export interface TrackItem {
  id: number;
  category_id: number;
  name: string;
  created_date?: string;
  updated_date?: string;
}

export interface TrackItemSelectable {
  item: TrackItem;
  selected: boolean;
}

export interface TrackCategoryWithSelectableItems {
  category: TrackCategory;
  items: TrackItemSelectable[];
}

// For storing progress tracking data
export interface TrackItemWithProgress {
  item: TrackItem;
  completed: number;
  total: number;
  started: boolean;
}

export interface TrackCategoryWithItems {
  category: TrackCategory;
  items: TrackItemWithProgress[];
}

export interface Question {
  id: number;
  items_id: number;
  type: "multi-choice" | "single-choice" | "counter" | "text" | "boolean";
  text: string;
  instructions: string;
  required: boolean;
  created_Date: Date;
  updated_Date: Date;
}
export interface Response {
  id: number;
  question_id: number;
  text: string | number | boolean;
  created_Date: Date;
  updated_Date: Date;
}
type SelectedItemsContextType = {
  selected: TrackCategoryWithSelectableItems[];
  setSelected: React.Dispatch<
    React.SetStateAction<TrackCategoryWithSelectableItems[]>
  >;
  selectedByDate: Record<string, TrackCategoryWithItems[]>;
  setSelectedByDate: React.Dispatch<
    React.SetStateAction<Record<string, TrackCategoryWithItems[]>>
  >;
  addItemForDate: (
    date: string,
    category: TrackCategory,
    item: TrackItem
  ) => void;
  updateItemProgress: (
    date: string,
    itemId: number,
    completed: number,
    total: number
  ) => void;
};

const SelectedItemsContext = createContext<
  SelectedItemsContextType | undefined
>(undefined);

export const TrackContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selected, setSelected] = useState<TrackCategoryWithSelectableItems[]>(
    []
  );

  // date -> categories -> items with progress
  const [selectedByDate, setSelectedByDate] = useState<
    Record<string, TrackCategoryWithItems[]>
  >({});

  /**
   * Adds a new item for a specific date into selectedByDate
   * (keeps duplicates out)
   */
  const addItemForDate = (
    date: string,
    category: TrackCategory,
    item: TrackItem
  ) => {
    setSelectedByDate((prev) => {
      const existingCategories = prev[date] || [];

      // Check if category exists
      const categoryIndex = existingCategories.findIndex(
        (cat) => cat.category.id === category.id
      );

      let updatedCategories;
      if (categoryIndex === -1) {
        // Create new category with first item; default completed:0, total:0 (total will be set when question flow starts)
        updatedCategories = [
          ...existingCategories,
          {
            category,
            items: [{ item, completed: 0, total: 0, started: false }],
          },
        ];
      } else {
        // Add item to existing category if it doesn't exist
        const copy = existingCategories.map((c) => ({
          ...c,
          items: [...c.items],
        }));
        const categoryObj = copy[categoryIndex];
        if (!categoryObj.items.some((i) => i.item.id === item.id)) {
          categoryObj.items.push({
            item,
            completed: 0,
            total: 0,
            started: false,
          });
        }
        updatedCategories = copy;
      }

      return { ...prev, [date]: updatedCategories };
    });
  };

  /**
   * Update progress for an item on a specific date.
   * If the item exists under that date -> update completed/total.
   * If it doesn't exist but we have that item in `selected` (global selection),
   * try to find its category and add it so progress appears.
   */
  const updateItemProgress = (
    date: string,
    itemId: number,
    completed: number,
    total: number
  ) => {
    setSelectedByDate((prev) => {
      const existingCategories = prev[date] || [];

      let found = false;
      const updatedCategories = existingCategories.map((cat) => {
        const items = cat.items.map((itm) => {
          if (itm.item.id === itemId) {
            found = true;
            return { ...itm, completed, total, started: true };
          }
          return itm;
        });
        return { ...cat, items };
      });

      if (found) {
        return { ...prev, [date]: updatedCategories };
      }

      // Fallback: item not present in selectedByDate for that date.
      // Try to find category from the global `selected` list (if user previously selected it).
      const categoryFromSelected = selected.find((cat) =>
        cat.items.some((it) => it.item.id === itemId)
      )?.category;

      if (categoryFromSelected) {
        // get the item object from `selected`
        const foundItem = selected
          .flatMap((c) => c.items)
          .find((it) => it.item.id === itemId)?.item;

        const newCatEntry: TrackCategoryWithItems = {
          category: categoryFromSelected,
          items: [
            { item: foundItem as TrackItem, completed, total, started: true },
          ],
        };

        return { ...prev, [date]: [...existingCategories, newCatEntry] };
      }

      // If we can't find the category, do nothing (or you could add a generic placeholder).
      return prev;
    });
  };

  return (
    <SelectedItemsContext.Provider
      value={{
        selected,
        setSelected,
        selectedByDate,
        setSelectedByDate,
        addItemForDate,
        updateItemProgress,
      }}
    >
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error(
      "useSelectedItems must be used within TrackContextProvider"
    );
  }
  return context;
};
