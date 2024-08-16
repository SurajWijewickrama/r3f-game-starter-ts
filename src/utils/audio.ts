export const playAudio = (file:string, volume = 0.01, loop = false, play = false) => {
  const audio = new Audio(`${file}`);
  audio.loop = loop;
  audio.volume = volume;
  if (play) audio.play();
  return audio;
};
