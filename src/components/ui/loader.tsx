import { useProgress } from "@react-three/drei";

export default function LoaderBar({ loadingText }: { loadingText: string }) {
  const { progress } = useProgress();
  if (progress >= 100) {
    return <></>;
  }
  return (
    <div className="absolute z-40 h-screen w-screen bg-slate-900 flex justify-center items-center flex-col">
      {loadingText} {progress}%
      <div className="bg-slate-900">
        <div
          className="bg-slate-300 "
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

LoaderBar.propTypes = {
  loadingText: String,
};
