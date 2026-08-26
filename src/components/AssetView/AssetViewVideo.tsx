import { getAssetUrl } from "@/contract/media/media";
import { getViewportSize, type AssetViewProps } from "./AssetView";
import './AssetView.css';
import React, { useEffect, useRef, useState } from "react";
import { INPUTS } from "@/Constants";

export function AssetViewVideo({ identifier }: AssetViewProps) {
  const getFitSize = (video: HTMLVideoElement) => {
    const viewport = getViewportSize();

    const scale = Math.min(
      viewport.width / video.videoWidth,
      viewport.height / video.videoHeight,
      1,
    );

    return {
      width: Math.round(video.videoWidth * scale),
      height: Math.round(video.videoHeight * scale),
    };
  };

  const handleLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    setSize(getFitSize(e.currentTarget));
  };

  
  const handleKeyDown = (event: KeyboardEvent) => {

    const jumpValue = event.repeat ? 0.5 : 5.0;
    switch (event.code) {

      case INPUTS.PREV_PAGE_WASD:
      case INPUTS.PREV_PAGE_ARROWS:
        event.preventDefault();
        if (!videoElement.current) {
          return;
        }
        
        videoElement.current.currentTime = videoElement.current.currentTime - jumpValue;   
        break;

      case INPUTS.NEXT_PAGE_WASD:
      case INPUTS.NEXT_PAGE_ARROWS:
        event.preventDefault();
        if (!videoElement.current) {
          return;
        }

        videoElement.current.currentTime = videoElement.current.currentTime + jumpValue;   
        break;

      case INPUTS.FULLSCREEN_MODE:
        event.preventDefault();

        if (!document.fullscreenElement) {
          videoElement.current?.requestFullscreen({ navigationUI: "hide"});
        }
        else {
          document.exitFullscreen();
        }
        
        break;
    }
  };

  const handleFullscreenChange = () => {
    console.log(document.fullscreenElement === videoElement.current);
    videoElement.current?.classList.toggle(
      "controlls-disabled",
      document.fullscreenElement === videoElement.current,
    );
  };
    

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const videoElement = useRef<HTMLVideoElement>(null);
  useEffect(() => {

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    videoElement.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
       document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [videoElement]);
  
  return (
    <div className="asset-view">
      <video
        ref={videoElement}
        src={getAssetUrl(identifier)}
        controls={true}
        autoPlay
        loop
        onLoadedMetadata={handleLoadedMetadata}
        width={size.width || undefined}
        height={size.height || undefined}
        style={{
          display: "block",
          margin: "auto",
          backgroundColor: "hsl(0, 0%, 0%)",
        }}
      />
    </div>
  );
}