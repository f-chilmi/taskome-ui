import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({
  data,
}: {
  data: {
    countTotal: number;
    countCompleted: number;
    countDueToday: number;
    countOverdue: number;
  };
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.countTotal}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completed tasks</CardDescription>
          <CardTitle className="text-green-600 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.countCompleted}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tasks due today</CardDescription>
          <CardTitle className="text-yellow-600 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.countDueToday}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overdue tasks</CardDescription>
          <CardTitle className="text-red-600 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.countOverdue}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
