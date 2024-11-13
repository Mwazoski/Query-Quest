import Header from "@/components/ui/header";
import { LeaderBoard } from "@/components/ui/leaderboard";
import { LeaderboardTable } from "@/components/ui/leaderboardTable";

export default function Home() {
  return (
    <>
      <Header></Header>
      <LeaderBoard></LeaderBoard>
      <LeaderboardTable></LeaderboardTable>
    </>
  );
}
