import { useEffect, useCallback } from 'react'

interface GameBoyKeyboardProps {
  onUp: () => void
  onDown: () => void
  onLeft: () => void
  onRight: () => void
  onA: () => void // Confirm/Select
  onB: () => void // Cancel/Back
  onStart: () => void // Add task
  onSelect: () => void // Menu
}

export const useGameBoyKeyboard = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  onA,
  onB,
  onStart,
  onSelect
}: GameBoyKeyboardProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Prevent default behavior for game controls
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Space', 'Tab']
    if (gameKeys.includes(event.code)) {
      event.preventDefault()
    }

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        onUp()
        break
      case 'ArrowDown':
      case 'KeyS':
        onDown()
        break
      case 'ArrowLeft':
      case 'KeyA':
        onLeft()
        break
      case 'ArrowRight':
      case 'KeyD':
        onRight()
        break
      case 'Enter':
      case 'Space':
        onA() // A button - confirm/select
        break
      case 'Escape':
      case 'Backspace':
        onB() // B button - cancel/back
        break
      case 'KeyN':
      case 'Insert':
        onStart() // Start button - add new task
        break
      case 'Tab':
      case 'KeyM':
        onSelect() // Select button - menu/options
        break
    }
  }, [onUp, onDown, onLeft, onRight, onA, onB, onStart, onSelect])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return null
}