import { useEffect, useState } from "react";

import { Button, Stack, Typography } from "@mui/material";

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
    <Stack sx={{ justifyContent: "space-around", padding: "0 5px" }}>
      <Button
        onClick={toggleAudio}
        variant="outlined"
        sx={{
          height: "35px",
        }}
      >
        <Typography sx={{ fontSize: "14px" }}>
          {isAudioPlaying ? "Pause Audio" : "Play Audio"}
        </Typography>
      </Button>
    </Stack>
  );
}

export default AudioToggleButton;
