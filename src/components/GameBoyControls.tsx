import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

interface GameBoyControlsProps {
  onUp: () => void
  onDown: () => void
  onLeft: () => void
  onRight: () => void
  onA: () => void
  onB: () => void
  onStart: () => void
  onSelect: () => void
}

export const GameBoyControls = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  onA,
  onB,
  onStart,
  onSelect
}: GameBoyControlsProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 gb-controls-container">
      {/* D-Pad */}
      <div className="relative mb-4">
        <div className="gb-dpad">
          <button
            className="gb-dpad-button gb-dpad-up"
            onMouseDown={onUp}
            aria-label="Up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            className="gb-dpad-button gb-dpad-down"
            onMouseDown={onDown}
            aria-label="Down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            className="gb-dpad-button gb-dpad-left"
            onMouseDown={onLeft}
            aria-label="Left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            className="gb-dpad-button gb-dpad-right"
            onMouseDown={onRight}
            aria-label="Right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="gb-dpad-center"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          className="gb-action-button gb-button-b"
          onMouseDown={onB}
          aria-label="B Button - Cancel"
        >
          <span className="font-gameboy text-xs">B</span>
        </button>
        <button
          className="gb-action-button gb-button-a"
          onMouseDown={onA}
          aria-label="A Button - Confirm"
        >
          <span className="font-gameboy text-xs">A</span>
        </button>
      </div>

      {/* Start/Select Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          className="gb-small-button"
          onMouseDown={onSelect}
          aria-label="Select Button"
        >
          <span className="font-gameboy text-xs">SELECT</span>
        </button>
        <button
          className="gb-small-button"
          onMouseDown={onStart}
          aria-label="Start Button"
        >
          <span className="font-gameboy text-xs">START</span>
        </button>
      </div>

      {/* Control Instructions */}
      <div className="mt-4 text-center">
        <div className="gb-instruction-panel">
          <div className="text-xs font-gameboy-light text-gb-darkest mb-1">CONTROLS</div>
          <div className="text-xs font-gameboy-light text-gb-dark space-y-1">
            <div>↑↓←→ NAVIGATE</div>
            <div>A SELECT • B CANCEL</div>
            <div>START ADD TASK</div>
          </div>
        </div>
      </div>
    </div>
  )
}