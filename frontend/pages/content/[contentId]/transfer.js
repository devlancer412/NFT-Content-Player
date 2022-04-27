import Link from "next/link";

const TranferPage = () => {
  return (
    <main className="flex flex-col w-full flex-1 px-5">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose border-b-2 border-gray-700">
          This is TranferPage
        </h1>
      </div>
      <Link href="/content">Go back</Link>
    </main>
  );
};

export default TranferPage;
