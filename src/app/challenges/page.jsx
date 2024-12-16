import Header from "@/components/ui/header";
import { ChallengeCard } from "@/components/ui/ChallengeCard";

export default function Challenges() {
  return (
    <>
      <Header></Header>
      <h1 className="text-5xl mt-20 font-bold text-center mb-10">Challenges</h1>
      <div className="cotainer-xl p-4">
        <ChallengeCard></ChallengeCard>
      </div>
    </>
  );
}
