import Game from "@/components/Game";
import Layout from "@/components/Layout";
import PokerButton from "@/components/PokerButton";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

const queryParamsValidator = z.object({
  username: z.string().min(1),
  roomId: z.string().min(1),
});

interface GameSetup {
  username: string | null;
  roomId: string | null;
  showGame: boolean;
}

export default function Home() {
  const [setup, setSetup] = useState<GameSetup>({
    username: null,
    roomId: null,
    showGame: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const parsed = queryParamsValidator.safeParse(router.query);
      if (parsed.success) {
        setSetup(() => ({
          username: parsed.data.username,
          roomId: parsed.data.roomId,
          showGame: true,
        }));
      }
    }
  }, [router, setSetup]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!setup || !(setup.username && setup.roomId)) {
      alert("Please provide a username and roomId!");
    } else {
      setSetup({ ...setup, showGame: true });
      router.push(
        {
          query: {
            username: setup.username,
            roomId: setup.roomId,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  // Show the game after the user has picked a room and a username
  if (setup !== null && setup.showGame && setup.roomId && setup.username) {
    return (
      <>
        <Layout>
          <div className="flex flex-col space-y-4">
          <Game roomId={setup.roomId} username={setup.username} />
          <div className="flex justify-center space-y-8">
            <button
              onClick={() => {
                router.push({
                  pathname: "/",
                  query: null,
                });
                setSetup({
                  username: null,
                  roomId: null,
                  showGame: false,
                });
              }}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-red-500 group-hover:from-purple-600 group-hover:to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Leave Room
              </span>
            </button>
          </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
<Layout>
  <div>
    <form className="flex-col gap-4" onSubmit={handleFormSubmit}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
      <div className="relative">
          <input type="text" value={setup.username || ""} id="username"
            name="username"
            onChange={(e) =>
              setSetup({ ...setup, username: e.currentTarget.value })
            }
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
          <label 
            htmlFor="username" 
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Username
          </label>
      </div>
      <div className="relative">
        <input
          type="text"
          value={setup.roomId || ""}
          onChange={(e) =>
            setSetup({ ...setup, roomId: e.currentTarget.value })
          }
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
          name="roomid"
          id="roomid"
        />
      <label 
        htmlFor="roomName" 
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          Room ID
      </label>
      </div>
      </div>
      <PokerButton buttonText="Join Room" color={"blue"} />
    </form>
  </div>
</Layout>

  );
}
