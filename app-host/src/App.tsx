import React, { Suspense } from "react";

// import type { lodash, formatName } from "appA/utils";
const RemoteAreaChart = React.lazy(
  () => import("app-remote/components/AreaChart")
);
const LineChart = React.lazy(() => import("app-remote/components/LineChart"));
// const { formatName, lodash } = await import("app-remote/utils").then(
//   (utils) => utils.default
// );

export default function App() {
  // useEffect(() => {
  //   console.log(formatName("foo", "bar"));
  //   console.log(lodash.camelCase("text to transform into camel case"));
  // }, []);

  return (
    <div className="min-h-screen w-full relative text-white">
      <div
        className="absolute inset-0 z-0 "
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      <div className="fixed flex gap-x-3 items-end inset-x-0 top-0 z-10 border-b border-white/10 py-6 px-12">
        <img src="vite.svg" alt="vite logo" />
        <h1 className="text-2xl font-bold tracking-widest">host application</h1>
      </div>
      <div className="absolute pt-20.5 flex w-full h-full">
        <nav className="sm:w-1/3 min-w-80 max-w-80 flex flex-col justify-start border-r border-white/10 h-full p-6">
          <ul className="flex flex-col">
            <li
              className={`p-6 text-xs uppercase font-semibold tracking-widest cursor-pointer bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6`}
            >
              {"Admin charts (remote)"}
            </li>
          </ul>
        </nav>
        <div className={`flex w-full p-6`}>
          <div
            className={
              "w-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6"
            }
          >
            <Suspense fallback={<p>Loading remote...</p>}>
              <div className="flex flex-row gap-6">
                <RemoteAreaChart />
                <LineChart />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
