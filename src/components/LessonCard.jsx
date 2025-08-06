"use client";

import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

export function LessonCard() {
  return (
    (<BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={"md:col-span-3"}/>
      ))}
    </BentoGrid>)
  );
}
const Skeleton = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "Introduction to SQL",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Advanced SQL Queries",
    description: "Dive deep into complex queries and learn to manipulate data like a pro.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "SQL for Data Analysis",
    description: "Master SQL techniques used in data analysis to extract insights from large datasets.",
    header: <Skeleton />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "SQL Performance Tuning",
    description: "Optimize your SQL queries for better performance and efficiency.",
    header: <Skeleton />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];
