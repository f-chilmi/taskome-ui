import React from "react";
import { addMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function ButtonMonth({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const onChangeMonth = (type: "next" | "prev") => {
    switch (type) {
      case "prev":
        setDate(addMonths(date, -1));
        break;

      default:
        setDate(addMonths(date, 1));
        break;
    }
  };

  return (
    <div className="w-full flex items-center justify-center gap-6">
      <ChevronLeft
        size={32}
        className="cursor-pointer"
        onClick={() => onChangeMonth("prev")}
      />

      <AnimatePresence mode="wait">
        <motion.h1
          key={format(date, "yyyy-MM")}
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          exit={{ x: -20 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold w-sm text-center"
        >
          {format(date, "MMMM yyyy")}
        </motion.h1>
      </AnimatePresence>

      <ChevronRight
        size={32}
        className="cursor-pointer"
        onClick={() => onChangeMonth("next")}
      />
    </div>
  );
}

export default ButtonMonth;
