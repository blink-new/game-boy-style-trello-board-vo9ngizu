import { Clock, Zap, Trophy, Target } from 'lucide-react'

interface GameBoyStatsProps {
  totalTasks: number
  completedTasks: number
  activeTasks: number
  queuedTasks: number
}

export const GameBoyStats = ({ totalTasks, completedTasks, activeTasks, queuedTasks }: GameBoyStatsProps) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const productivity = activeTasks + completedTasks
  
  return (
    <div className="gb-stats-panel">
      <div className="text-center mb-4">
        <div className="font-gameboy text-gb-darkest text-sm mb-2">GAME STATS</div>
        <div className="gb-level-display">
          <span className="font-gameboy text-lg text-gb-darkest">LV.{Math.floor(completedTasks / 5) + 1}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="gb-stat-item">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-gb-darkest" />
            <span className="font-gameboy text-xs text-gb-darkest">TOTAL</span>
          </div>
          <div className="font-gameboy text-lg text-gb-dark">{totalTasks.toString().padStart(3, '0')}</div>
        </div>
        
        <div className="gb-stat-item">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-gb-darkest" />
            <span className="font-gameboy text-xs text-gb-darkest">DONE</span>
          </div>
          <div className="font-gameboy text-lg text-gb-dark">{completedTasks.toString().padStart(3, '0')}</div>
        </div>
        
        <div className="gb-stat-item">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-gb-darkest" />
            <span className="font-gameboy text-xs text-gb-darkest">ACTIVE</span>
          </div>
          <div className="font-gameboy text-lg text-gb-dark">{activeTasks.toString().padStart(3, '0')}</div>
        </div>
        
        <div className="gb-stat-item">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-gb-darkest" />
            <span className="font-gameboy text-xs text-gb-darkest">QUEUE</span>
          </div>
          <div className="font-gameboy text-lg text-gb-dark">{queuedTasks.toString().padStart(3, '0')}</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-gameboy text-xs text-gb-darkest">PROGRESS</span>
          <span className="font-gameboy text-xs text-gb-dark">{completionRate}%</span>
        </div>
        <div className="gb-progress-bar">
          <div 
            className="gb-progress-fill" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
      
      {/* Productivity Score */}
      <div className="mt-4 text-center">
        <div className="font-gameboy text-xs text-gb-darkest mb-1">PRODUCTIVITY</div>
        <div className="gb-score-display">
          <span className="font-gameboy text-xl text-gb-darkest">{productivity.toString().padStart(4, '0')}</span>
        </div>
      </div>
    </div>
  )
}