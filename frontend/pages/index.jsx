import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointRight } from "@fortawesome/free-solid-svg-icons";

import Button from "../components/button/Button";

export default function Home() {
  return (
    <main className="flex flex-col w-full flex-1 px-5">
      <div className="header">
        <h1 className="text-3xl font-bold leading-loose border-b-2 border-gray-700">
          Welcome!
        </h1>
      </div>
      <div className="main flex flex-col w-full p-5 border-y-2 border-[#e6e6e6] h-full flex-1"></div>
      <div className="footer p-5 w-full">
        <div className="float-left">
          <Link href="/content/">
            <Button
              size="base"
              icon={<FontAwesomeIcon icon={faHandPointRight} />}
              text="Dashbord"
              className="border-0 bg-[#3E5E93] text-white py-1 w-52"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
