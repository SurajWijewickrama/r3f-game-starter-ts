import { useProgress } from "@react-three/drei";

export default function LoaderBar({ loadingText }: { loadingText: string }) {
  const { progress } = useProgress();
  if (progress >= 100) {
    return <></>;
  }
  return (
    <div className="absolute z-40 h-full w-full text-white  flex justify-center items-center flex-col p-4 bg-black">
      <h1>{loadingText}</h1>
      <h1>{Math.round(progress)}%</h1>
      <div className="bg-slate-900 w-1/2">
        <div
          className="bg-slate-300 h-1"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
