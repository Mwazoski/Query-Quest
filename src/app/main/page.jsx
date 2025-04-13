import Header from "@/components/ui/header";
import { LeaderBoard } from "@/components/ui/leaderboard";
import { LeaderboardTable } from "@/components/ui/leaderboardTable";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: "no-store", // or 'force-cache', etc., depending on your needs
  });
  const users = await res.json();

  return (
    <>
      <Header></Header>
      <h1>Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
      <LeaderBoard></LeaderBoard>
      <LeaderboardTable></LeaderboardTable>
    </>
  );
}
