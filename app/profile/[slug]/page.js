import Link from "next/link";

export default function Page({ params }) {
  const { slug } = params;

  return (
    <div>
      <Link href="/">Dashboard</Link>
      <h1>{slug}</h1>
    </div>
  );
}