import Header from "@/components/ui/header";
import { LessonCard } from "@/components/ui/LessonCard";

export default function Lessons() {
  return (
    <>
      <Header></Header>
      <h1 className="text-5xl mt-20 font-bold text-center mb-10">Lessons</h1>
      <div className="cotainer-xl p-4">
      <LessonCard />
      </div>
    </>
  );
}
