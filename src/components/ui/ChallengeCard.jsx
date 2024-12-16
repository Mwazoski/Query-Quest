"use client";

import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import ImageExercise from "@/components/ui/ImageExercise";
import {
  IconClipboardCopy,
  IconFileBroken,
} from "@tabler/icons-react";


export function ChallengeCard() {
  return (
    (<BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={<ImageExercise title={item.title} />}
          icon={item.icon}
          className={""} />
      ))}
    </BentoGrid>)
  );
}

const items = [
  {
    title: "Introduction to SQL",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <ImageExercise title="Introduction to SQL" />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Advanced SQL Queries",
    description: "Dive deep into complex queries and learn to manipulate data like a pro.",
    header: <ImageExercise title="Advanced SQL Queries" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Advanced SQL Queries",
    description: "Dive deep into complex queries and learn to manipulate data like a pro.",
    header: <ImageExercise title="Advanced SQL Queries" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Advanced SQL Queries",
    description: "Dive deep into complex queries and learn to manipulate data like a pro.",
    header: <ImageExercise title="Advanced SQL Queries" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Advanced SQL Queries",
    description: "Dive deep into complex queries and learn to manipulate data like a pro.",
    header: <ImageExercise title="Advanced SQL Queries" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Advanced SQL Queries",
    description: "Dive deep into complex queries and learn to manipulate data like a pro.",
    header: <ImageExercise title="Advanced SQL Queries" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Advanced SQL Queries",
    description: "Dive deep into complex queries and learn to manipulate data like a pro.",
    header: <ImageExercise title="Advanced SQL Queries" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
];

