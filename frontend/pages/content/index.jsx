import Head from "next/head";
import BlueBtn from "../../components/button/blue";
import LargeBtn from "../../components/button/large";
import NormalBtn from "../../components/button/normal";
import Layout from "../../components/layout";

export default function ContentManager() {
  return (
    <Layout>
      <Head>
        <title>Content Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col w-full flex-1 px-5">
        <div className="header">
          <h1 className="text-3xl font-bold leading-loose">Content Manager</h1>
        </div>
        <div className="main flex flex-col w-full p-5 border-y-2 border-gray-700 h-full flex-1">
          <div className="content-view flex flex-row w-full mb-10">
            <div className="content-detail w-3/4 flex flex-col justify-between pr-5">
              <div className="content-header flex flex-col w-full">
                <div className="content-name w-full text-xl">
                  Rick and Morty - Season 1
                </div>
                <div className="content-id w-full text-base">
                  Content Id: 0x235fb4940A682Fe66dE42fcBbc95d2e2de42587B
                </div>
              </div>
              <div className="content-edit flex flex-row justify-between font-semibold">
                <div className="content-ct flex flex-row justify-start">
                  <NormalBtn>Contents</NormalBtn>
                  <NormalBtn>Transfer</NormalBtn>
                </div>
                <div className="content-ct flex flex-row justify-end">
                  <BlueBtn>Mint</BlueBtn>
                </div>
              </div>
            </div>
            <div className="content-preview w-1/4">
              <div className="w-full h-40 bg-gray-500"></div>
            </div>
          </div>
          <div className="content-view flex flex-row w-full mb-10">
            <div className="content-detail w-3/4 flex flex-col justify-between pr-5">
              <div className="content-header flex flex-col w-full">
                <div className="content-name w-full text-xl">
                  Rick and Morty - Season 1
                </div>
                <div className="content-id w-full text-base">
                  Content Id: 0x235fb4940A682Fe66dE42fcBbc95d2e2de42587B
                </div>
              </div>
              <div className="content-edit flex flex-row justify-between font-semibold">
                <div className="content-ct flex flex-row justify-start">
                  <NormalBtn>Contents</NormalBtn>
                  <NormalBtn>Transfer</NormalBtn>
                </div>
                <div className="content-ct flex flex-row justify-end">
                  <BlueBtn>Mint</BlueBtn>
                </div>
              </div>
            </div>
            <div className="content-preview w-1/4">
              <div className="w-full h-40 bg-gray-500"></div>
            </div>
          </div>
          <div className="content-view flex flex-row w-full mb-10">
            <div className="content-detail w-3/4 flex flex-col justify-between pr-5">
              <div className="content-header flex flex-col w-full">
                <div className="content-name w-full text-xl">
                  Rick and Morty - Season 1
                </div>
                <div className="content-id w-full text-base">
                  Content Id: 0x235fb4940A682Fe66dE42fcBbc95d2e2de42587B
                </div>
              </div>
              <div className="content-edit flex flex-row justify-between font-semibold">
                <div className="content-ct flex flex-row justify-start">
                  <NormalBtn>Contents</NormalBtn>
                  <NormalBtn>Transfer</NormalBtn>
                </div>
                <div className="content-ct flex flex-row justify-end">
                  <BlueBtn>Mint</BlueBtn>
                </div>
              </div>
            </div>
            <div className="content-preview w-1/4">
              <div className="w-full h-40 bg-gray-500"></div>
            </div>
          </div>
          <div className="content-view flex flex-row w-full">
            <div className="content-detail w-3/4 flex flex-col justify-between pr-5">
              <div className="content-header flex flex-col w-full">
                <div className="content-name w-full text-xl">
                  Rick and Morty - Season 1
                </div>
                <div className="content-id w-full text-base">
                  Content Id: 0x235fb4940A682Fe66dE42fcBbc95d2e2de42587B
                </div>
              </div>
              <div className="content-edit flex flex-row justify-between font-semibold">
                <div className="content-ct flex flex-row justify-start">
                  <NormalBtn>Contents</NormalBtn>
                  <NormalBtn>Transfer</NormalBtn>
                </div>
                <div className="content-ct flex flex-row justify-end">
                  <BlueBtn>Mint</BlueBtn>
                </div>
              </div>
            </div>
            <div className="content-preview w-1/4">
              <div className="w-full h-40 bg-gray-500"></div>
            </div>
          </div>
        </div>
        <div className="footer p-5 w-full">
          <div className="float-left">
            <LargeBtn>Add Content</LargeBtn>
          </div>
        </div>
      </main>
    </Layout>
  );
}
