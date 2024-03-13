import { useEffect, useState } from "react";

export interface AudioToggleButtonProps {
  src: string;
}

function AudioToggleButton(props: AudioToggleButtonProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(props.src);
    // Check if theres user interaction
    if (isAudioPlaying) {
      //Make a new audio object with the imported audio file
      //Try to play the audio file, have to use void to indicate were not going to promise to handle the returned type
      void audio.play().catch((e) => {
        //Debug for errors
        console.error("Error playing audio:", e);
      });
    }
    //Cleanup function to pause audio when the component unmounts
    return () => {
      if (isAudioPlaying) {
        audio.pause();
      }
    };
    //Depends on the isUserInteracted state, reruns if it changes
  }, [isAudioPlaying, props.src]);

  //toggles state of audio upon button press
  function toggleAudio() {
    setIsAudioPlaying((prevIsAudioPlaying) => !prevIsAudioPlaying);
  }

  return (
    <button
      onClick={toggleAudio}
      style={{
        position: "absolute",
        zIndex: 1000,
        top: "18px", // Adjust this value to change the vertical position
        left: "1325px", // Adjust this value to change the horizontal position
      }}
    >
      {isAudioPlaying ? "Pause Audio" : "Play Audio"}
    </button>
  );
}

export default AudioToggleButton;
