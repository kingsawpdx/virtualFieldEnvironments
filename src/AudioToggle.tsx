import { useEffect, useState } from "react";
import { PhotosphereSelectorProps } from "./PhotosphereSelector";


function AudioToggle(isUserInteracted, audioFile, isPlaying) {
     isPlaying = useState(false)
     setIsPlaying = useState(false);
  
    useEffect(() => {
      const audio = new Audio(audioFile);
      if (isUserInteracted && isPlaying) {
        void audio.play().catch((e) => {
          console.error("Error playing audio:", e);
        });
      } else {
        audio.pause();
      }
  
      return () => {
        audio.pause();
      };
    }, [isUserInteracted, isPlaying]);
  
    function toggleAudio() {
      setIsPlaying(!isPlaying);
    }
  
    return (
      <button
        onClick={toggleAudio}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isPlaying ? "red" : "green",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {isPlaying ? 'Pause Audio' : 'Play Audio'}
      </button>
    );
  }, [isUserInteracted, isPlaying, audioFile]);
  
  export default AudioToggle;