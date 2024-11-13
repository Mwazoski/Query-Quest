"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const user_scores = [
  {
    rank: "1",
    username: "srbleu",
    score: "2500",
  },
  {
    rank: "2",
    username: "astroJack",
    score: "2400",
  },
  {
    rank: "3",
    username: "techyAmy",
    score: "2300",
  },
  {
    rank: "4",
    username: "lionHeart",
    score: "2200",
  },
  {
    rank: "5",
    username: "skyWalker",
    score: "2100",
  },
  {
    rank: "6",
    username: "pixelGuru",
    score: "2000",
  },
  {
    rank: "7",
    username: "nightOwl",
    score: "1900",
  },
  {
    rank: "8",
    username: "zenMaster",
    score: "1800",
  },
  {
    rank: "9",
    username: "windRider",
    score: "1700",
  },
  {
    rank: "10",
    username: "moonChaser",
    score: "1600",
  },
];

export function LeaderboardTable() {
  return (
    <div className="container w-4/5 mx-auto mt-10 mb-10 px-4 sm:px-6 lg:px-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Scores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user_scores.map((user_score) => (
            <TableRow key={user_score.rank}>
              <TableCell className="font-medium">{user_score.rank}</TableCell>
              <TableCell>{user_score.username}</TableCell>
              <TableCell>{user_score.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
