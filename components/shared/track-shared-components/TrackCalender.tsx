import React, { useEffect } from "react";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import palette from "@/utils/theme/color";

interface CalendarProps {
  selectedDate: moment.Moment;
  onDateSelected: (date: moment.Moment) => void;
}

const TrackCalendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelected,
}) => {

  return (
    <CalendarStrip
      scrollable
      style={{ height: 100, paddingTop: 10, paddingBottom: 10 }}
      calendarColor={palette.primary}
      startingDate={moment().subtract(3, "days")}
      calendarHeaderStyle={{ color: "white", fontSize: 16 }}
      dateNumberStyle={{ color: "white", fontSize: 16 }}
      dateNameStyle={{ color: "white", fontSize: 12 }}
      highlightDateContainerStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 999,
        padding: 5,
      }}
      highlightDateNumberStyle={{
        color: "white",
        fontWeight: "bold",
      }}
      highlightDateNameStyle={{ color: "white", fontSize: 12 }}
      selectedDate={selectedDate}
      onDateSelected={onDateSelected}
    />
  );
};

export default TrackCalendar;
