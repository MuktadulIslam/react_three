import Room3DCanvas from "@/components/canvas/Room3DCanvas";
import FullscreenWrapper from "./FullscreenWrapper";

export default function Main() {
  return (
    <div className="max-w-[2500px] mx-auto h-full">
      <FullscreenWrapper fullScreenByKey={true} iconPosition="bottom-right">
        <Room3DCanvas />
      </FullscreenWrapper>
    </div>
  )
}