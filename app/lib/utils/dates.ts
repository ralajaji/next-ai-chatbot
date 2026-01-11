interface DateGroupable {
  updated_at: string;
}

interface GroupedItems<T> {
  today: T[];
  previous7Days: T[];
  previous30Days: T[];
  older: T[];
}

export function groupByDate<T extends DateGroupable>(items: T[]): GroupedItems<T> {
  const now = new Date();
  const today: T[] = [];
  const previous7Days: T[] = [];
  const previous30Days: T[] = [];
  const older: T[] = [];

  items.forEach((item) => {
    const itemDate = new Date(item.updated_at);
    const diffTime = now.getTime() - itemDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      today.push(item);
    } else if (diffDays < 7) {
      previous7Days.push(item);
    } else if (diffDays < 30) {
      previous30Days.push(item);
    } else {
      older.push(item);
    }
  });

  return { today, previous7Days, previous30Days, older };
}
