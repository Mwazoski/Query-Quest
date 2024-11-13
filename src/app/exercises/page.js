import Header from "@/components/ui/header";
import { ExerciseCard } from "@/components/ui/ExerciseCard";

export default function Exercises() {
  return (
    <>
      <Header></Header>
      <h1 className="text-5xl mt-20 font-bold text-center mb-10">Exercises</h1>
      <div className="cotainer-xl p-4">
        <ExerciseCard></ExerciseCard>
      </div>
    </>
  );
}
