"use client";
import { HabitDataTable } from "@/components/habit/habit-data-table";
import ButtonMonth from "@/components/habit/button-month";
import { Habit, Event } from "@/types";
import React, { useEffect, useState } from "react";

function HabitView({
  initialData,
  getEvents,
  getHabits,
  updateLog,
  createHabit,
  deleteHabit,
  createEvent,
}: {
  initialData: { habits: Habit[]; events: Event[] };
  getHabits: (param: string) => Promise<{ data: Habit[] }>;
  getEvents: (
    param: string
  ) => Promise<{ data: Event[]; logs: Record<string, Event> }>;
  updateLog: (payload: string) => void;
  createHabit: (payload: string) => void;
  createEvent: (payload: string) => void;
  deleteHabit: (id: string) => void;
}) {
  const [habits, setHabits] = useState<Habit[]>(initialData.habits);
  const [events, setEvents] = useState<Event[]>(initialData.events);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    console.log(32);
    const initData = async () => {
      const [habitRes, eventRes] = await Promise.all([
        getHabits(date.toISOString()),
        getEvents(date.toISOString()),
      ]);

      setHabits(habitRes.data);
      setEvents(eventRes.data);
    };
    if (date !== new Date()) initData();
  }, [date]);

  useEffect(() => {
    console.log("initial data berubah", initialData);
    setHabits(initialData.habits);
    setEvents(initialData.events);
  }, [initialData]);

  return (
    <>
      <ButtonMonth date={date} setDate={setDate} />
      <HabitDataTable
        selectedDate={date}
        data={habits}
        events={events}
        createEvent={createEvent}
        updateLog={updateLog}
        createHabit={createHabit}
        deleteHabit={deleteHabit}
      />
    </>
  );
}

export default HabitView;
