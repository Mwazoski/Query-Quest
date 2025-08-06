export default function LevelBadge({ level }) {
  const colors = {
    1: "bg-green-100 text-green-800",
    2: "bg-yellow-100 text-yellow-800",
    3: "bg-orange-100 text-orange-800",
    4: "bg-red-100 text-red-800",
    5: "bg-purple-100 text-purple-800"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level] || colors[1]}`}>
      Level {level}
    </span>
  );
} 