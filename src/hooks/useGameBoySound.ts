import { useCallback } from 'react'

// Game Boy sound frequencies and patterns
const GAME_BOY_SOUNDS = {
  beep: { frequency: 1000, duration: 100 },
  select: { frequency: 800, duration: 80 },
  confirm: { frequency: 1200, duration: 120 },
  cancel: { frequency: 600, duration: 150 },
  move: { frequency: 400, duration: 60 },
  complete: { frequency: 1500, duration: 200 },
  error: { frequency: 300, duration: 300 },
  startup: { frequency: 2000, duration: 500 }
}

export const useGameBoySound = () => {
  const playSound = useCallback((soundType: keyof typeof GAME_BOY_SOUNDS) => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as typeof AudioContext).webkitAudioContext)()
      const { frequency, duration } = GAME_BOY_SOUNDS[soundType]
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'square' // Classic Game Boy square wave
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)
    } catch {
      // Fallback for browsers that don't support Web Audio API
      console.log(`Game Boy sound: ${soundType}`)
    }
  }, [])

  return { playSound }
}