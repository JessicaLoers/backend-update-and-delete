import useSWR from "swr";
import Link from "next/link";

export default function JokeList() {
  const { data: jokes, isLoading } = useSWR("/api/jokes");

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!jokes) {
    return;
  }

  return (
    <ul>
      {jokes.map(({ _id, joke }) => (
        <li key={_id}>
          <Link href={`/${_id}`}>{joke}</Link>
        </li>
      ))}
    </ul>
  );
}
