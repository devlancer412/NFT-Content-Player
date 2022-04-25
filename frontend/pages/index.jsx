import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col w-full flex-1 px-5">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose border-b-2 border-gray-700">
          This is Dashboard
        </h1>
      </div>
      <Link href="/content">Content Manage</Link>
    </main>
  );
}
