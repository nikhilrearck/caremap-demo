import React from "react";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import palette from "@/utils/theme/color";

interface CalendarProps {
  selectedDate: moment.Moment;
  onDateSelected: (date: moment.Moment) => void;
}

const TrackCalendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelected }) => {
  return (
    <CalendarStrip
      scrollable
      style={{ height: 100, paddingTop: 10, paddingBottom: 10 }}
      calendarColor={palette.primary}
      startingDate={moment().subtract(3, "days")}
      calendarHeaderStyle={{ color: "white" }}
      dateNumberStyle={{ color: "white" }}
      dateNameStyle={{ color: "white" }}
      highlightDateContainerStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 999,
        padding: 5,
      }}
      highlightDateNumberStyle={{
        color: "white",
        fontWeight: "bold",
      }}
      highlightDateNameStyle={{ color: "white" }}
      selectedDate={selectedDate}
      onDateSelected={onDateSelected}
    />
  );
};

export default TrackCalendar;
