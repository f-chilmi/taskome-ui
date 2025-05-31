"use client";
import { HabitDataTable } from "@/components/habit/habit-data-table";
import ButtonMonth from "@/components/habit/button-month";
import { Habit } from "@/types";
import React, { useEffect, useState } from "react";

function HabitView({
  getHabits,
  updateLog,
  createHabit,
  deleteHabit,
}: {
  getHabits: (param: string) => Promise<{ data: Habit[] }>;
  updateLog: (payload: string) => void;
  createHabit: (payload: string) => void;
  deleteHabit: (id: string) => void;
}) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const initData = async () => {
      const res = await getHabits(date.toISOString());
      setHabits(res.data);
    };
    initData();
  }, [date]);

  return (
    <>
      <ButtonMonth date={date} setDate={setDate} />
      <HabitDataTable
        selectedDate={date}
        data={habits}
        updateLog={updateLog}
        createHabit={createHabit}
        deleteHabit={deleteHabit}
      />
    </>
  );
}

export default HabitView;
