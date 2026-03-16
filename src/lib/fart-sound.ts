/**
 * Fart sound player
 * Uses audio file from public/fart.mp3
 */

let audio: HTMLAudioElement | null = null;

export function playFartSound() {
  if (!audio) {
    audio = new Audio('/fart.mp3');
  }
  
  // Reset to beginning in case already played
  audio.currentTime = 0;
  
  // Resume context if needed and play
  audio.play().catch(err => {
    console.error('Failed to play fart:', err);
  });
}