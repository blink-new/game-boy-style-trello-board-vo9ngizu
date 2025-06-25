import { useState, useEffect, useCallback } from 'react'
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  useDraggable,
  useDroppable
} from '@dnd-kit/core'
import { Plus, X, Gamepad2, Zap, CheckCircle, Star, Timer, Flame } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { GameBoyControls } from './components/GameBoyControls'
import { GameBoyStats } from './components/GameBoyStats'
import { GameBoyBattery } from './components/GameBoyBattery'
import { GameBoyNotification } from './components/GameBoyNotification'
import { useGameBoySound } from './hooks/useGameBoySound'
import { useGameBoyKeyboard } from './hooks/useGameBoyKeyboard'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  completedAt?: Date
  timeSpent?: number
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'QUEUE',
    tasks: [
      { id: '1', title: 'DESIGN RETRO UI SYSTEM', priority: 'high', createdAt: new Date() },
      { id: '2', title: 'IMPLEMENT DRAG DROP', priority: 'medium', createdAt: new Date() },
      { id: '3', title: 'ADD PIXEL ANIMATIONS', priority: 'low', createdAt: new Date() }
    ]
  },
  {
    id: 'doing',
    title: 'ACTIVE',
    tasks: [
      { id: '4', title: 'BUILD GAME BOY BOARD', priority: 'high', createdAt: new Date() }
    ]
  },
  {
    id: 'done',
    title: 'COMPLETE',
    tasks: [
      { id: '5', title: 'SETUP PROJECT BASE', priority: 'medium', createdAt: new Date(), completedAt: new Date() }
    ]
  }
]

function DraggableTask({ 
  task, 
  onDelete, 
  isSelected, 
  onSelect 
}: { 
  task: Task
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return 'priority-low'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flame className="h-3 w-3" />
      case 'medium': return <Zap className="h-3 w-3" />
      case 'low': return <Timer className="h-3 w-3" />
      default: return null
    }
  }

  const getTimeSpent = () => {
    if (task.completedAt && task.createdAt) {
      const diff = task.completedAt.getTime() - task.createdAt.getTime()
      const minutes = Math.floor(diff / 60000)
      return minutes > 0 ? `${minutes}m` : '<1m'
    }
    return null
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`gb-card p-4 cursor-grab active:cursor-grabbing gb-slide-in ${
        isDragging ? 'opacity-50 gb-glow' : ''
      } ${isSelected ? 'gb-task-selected' : ''}`}
      onClick={() => onSelect(task.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-gameboy-light text-gb-darkest text-xs leading-relaxed flex-1 mr-2">
          {task.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:gb-dark rounded-sm transition-all duration-200 gb-button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
        >
          <X className="h-3 w-3 text-gb-darkest" />
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Badge className={`${getPriorityClass(task.priority)} text-xs font-gameboy px-2 py-1 rounded-sm flex items-center gap-1`}>
          {getPriorityIcon(task.priority)}
          {task.priority}
        </Badge>
        <div className="flex items-center gap-2">
          {getTimeSpent() && (
            <span className="text-xs font-gameboy-light text-gb-dark">
              {getTimeSpent()}
            </span>
          )}
          <div className="text-xs font-gameboy text-gb-dark">
            #{task.id.padStart(3, '0')}
          </div>
        </div>
      </div>
      
      {task.completedAt && (
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3 w-3 text-gb-dark" />
          <span className="text-xs font-gameboy-light text-gb-dark">
            COMPLETED
          </span>
        </div>
      )}
    </Card>
  )
}

function DroppableColumn({ 
  column, 
  children, 
  isSelected 
}: { 
  column: Column
  children: React.ReactNode
  isSelected: boolean
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  })

  const getColumnClass = () => {
    const baseClass = `column-${column.id}`
    let classes = isOver ? `${baseClass} gb-glow` : baseClass
    if (isSelected) classes += ' gb-column-selected'
    return classes
  }

  const getColumnIcon = () => {
    switch (column.id) {
      case 'todo': return <Gamepad2 className="h-5 w-5" />
      case 'doing': return <Zap className="h-5 w-5" />
      case 'done': return <CheckCircle className="h-5 w-5" />
      default: return null
    }
  }

  const getColumnTextColor = () => {
    return column.id === 'done' ? 'text-gb-lightest' : 'text-gb-darkest'
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 rounded-lg transition-all duration-300 ${getColumnClass()}`}
    >
      {/* Column Header */}
      <div className="p-6 border-b-2 border-gb-darkest">
        <div className="flex items-center gap-3 mb-2">
          <div className={`${getColumnTextColor()}`}>
            {getColumnIcon()}
          </div>
          <h2 className={`font-gameboy ${getColumnTextColor()} text-lg tracking-wider`}>
            {column.title}
          </h2>
        </div>
        <div className={`text-xs font-gameboy-light ${column.id === 'done' ? 'text-gb-light' : 'text-gb-dark'}`}>
          {column.tasks.length} {column.tasks.length === 1 ? 'TASK' : 'TASKS'}
        </div>
      </div>

      {/* Tasks Container */}
      <div className="p-6 space-y-4 min-h-[300px] gb-dot-matrix">
        {children}
      </div>
    </div>
  )
}

function App() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string>('todo')
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    visible: boolean
  }>({ message: '', type: 'info', visible: false })
  const [gameStarted, setGameStarted] = useState(false)

  const { playSound } = useGameBoySound()

  // Game startup sound
  useEffect(() => {
    if (!gameStarted) {
      playSound('startup')
      setGameStarted(true)
      showNotification('GAME BOY TASK BOARD READY!', 'success')
    }
  }, [gameStarted, playSound])

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type, visible: true })
    playSound(type === 'success' ? 'complete' : type === 'error' ? 'error' : 'beep')
  }, [playSound])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }))
  }, [])

  // Keyboard navigation
  const navigateUp = useCallback(() => {
    playSound('move')
    const currentColumn = columns.find(col => col.id === selectedColumnId)
    if (!currentColumn || currentColumn.tasks.length === 0) return

    if (!selectedTaskId) {
      setSelectedTaskId(currentColumn.tasks[currentColumn.tasks.length - 1].id)
    } else {
      const currentIndex = currentColumn.tasks.findIndex(task => task.id === selectedTaskId)
      if (currentIndex > 0) {
        setSelectedTaskId(currentColumn.tasks[currentIndex - 1].id)
      }
    }
  }, [columns, selectedColumnId, selectedTaskId, playSound])

  const navigateDown = useCallback(() => {
    playSound('move')
    const currentColumn = columns.find(col => col.id === selectedColumnId)
    if (!currentColumn || currentColumn.tasks.length === 0) return

    if (!selectedTaskId) {
      setSelectedTaskId(currentColumn.tasks[0].id)
    } else {
      const currentIndex = currentColumn.tasks.findIndex(task => task.id === selectedTaskId)
      if (currentIndex < currentColumn.tasks.length - 1) {
        setSelectedTaskId(currentColumn.tasks[currentIndex + 1].id)
      }
    }
  }, [columns, selectedColumnId, selectedTaskId, playSound])

  const navigateLeft = useCallback(() => {
    playSound('move')
    const columnIds = ['todo', 'doing', 'done']
    const currentIndex = columnIds.indexOf(selectedColumnId)
    if (currentIndex > 0) {
      const newColumnId = columnIds[currentIndex - 1]
      setSelectedColumnId(newColumnId)
      setSelectedTaskId(null)
    }
  }, [selectedColumnId, playSound])

  const navigateRight = useCallback(() => {
    playSound('move')
    const columnIds = ['todo', 'doing', 'done']
    const currentIndex = columnIds.indexOf(selectedColumnId)
    if (currentIndex < columnIds.length - 1) {
      const newColumnId = columnIds[currentIndex + 1]
      setSelectedColumnId(newColumnId)
      setSelectedTaskId(null)
    }
  }, [selectedColumnId, playSound])

  const confirmAction = useCallback(() => {
    playSound('confirm')
    if (selectedTaskId) {
      // Move task to next column
      const columnIds = ['todo', 'doing', 'done']
      const currentIndex = columnIds.indexOf(selectedColumnId)
      if (currentIndex < columnIds.length - 1) {
        const nextColumnId = columnIds[currentIndex + 1]
        moveTask(selectedTaskId, nextColumnId)
        showNotification('TASK MOVED!', 'success')
      } else {
        showNotification('TASK ALREADY COMPLETE!', 'info')
      }
    }
  }, [selectedTaskId, selectedColumnId, playSound])

  const cancelAction = useCallback(() => {
    playSound('cancel')
    if (addingToColumn) {
      setAddingToColumn(null)
      setNewTaskTitle('')
    } else if (selectedTaskId) {
      deleteTask(selectedTaskId)
      showNotification('TASK DELETED!', 'error')
    }
  }, [addingToColumn, selectedTaskId, playSound])

  const startAction = useCallback(() => {
    playSound('select')
    setAddingToColumn(selectedColumnId)
    showNotification('ADD NEW TASK', 'info')
  }, [selectedColumnId, playSound])

  const selectAction = useCallback(() => {
    playSound('select')
    showNotification('MENU OPENED', 'info')
  }, [playSound])

  useGameBoyKeyboard({
    onUp: navigateUp,
    onDown: navigateDown,
    onLeft: navigateLeft,
    onRight: navigateRight,
    onA: confirmAction,
    onB: cancelAction,
    onStart: startAction,
    onSelect: selectAction
  })

  const moveTask = (taskId: string, targetColumnId: string) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns]
      
      // Find source column and task
      let sourceColumn: Column | undefined
      let taskIndex = -1
      let task: Task | undefined

      for (const column of newColumns) {
        taskIndex = column.tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
          sourceColumn = column
          task = column.tasks[taskIndex]
          break
        }
      }

      if (!sourceColumn || !task) return prevColumns

      // Remove task from source column
      sourceColumn.tasks.splice(taskIndex, 1)

      // Add completion time if moving to done
      if (targetColumnId === 'done' && !task.completedAt) {
        task.completedAt = new Date()
      }

      // Add task to target column
      const targetColumn = newColumns.find(col => col.id === targetColumnId)
      if (targetColumn) {
        targetColumn.tasks.push(task)
      }

      return newColumns
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = columns
      .flatMap(col => col.tasks)
      .find(task => task.id === active.id)
    setActiveTask(task || null)
    playSound('select')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) {
      playSound('cancel')
      return
    }

    const activeTaskId = active.id as string
    const overColumnId = over.id as string

    moveTask(activeTaskId, overColumnId)
    playSound('confirm')
    showNotification('TASK MOVED!', 'success')
  }

  const addTask = (columnId: string) => {
    if (!newTaskTitle.trim()) {
      playSound('error')
      showNotification('ENTER TASK TITLE!', 'error')
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.toUpperCase(),
      priority: 'medium',
      createdAt: new Date()
    }

    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    )

    setNewTaskTitle('')
    setAddingToColumn(null)
    playSound('complete')
    showNotification('TASK ADDED!', 'success')
  }

  const deleteTask = (taskId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskId)
      }))
    )
    setSelectedTaskId(null)
    playSound('error')
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return 'priority-low'
    }
  }

  // Calculate stats
  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0)
  const completedTasks = columns.find(col => col.id === 'done')?.tasks.length || 0
  const activeTasks = columns.find(col => col.id === 'doing')?.tasks.length || 0
  const queuedTasks = columns.find(col => col.id === 'todo')?.tasks.length || 0

  return (
    <div className="min-h-screen gb-bg gb-crt gb-scanlines">
      {/* Game Boy Battery */}
      <GameBoyBattery />

      {/* Game Boy Stats */}
      <GameBoyStats 
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        activeTasks={activeTasks}
        queuedTasks={queuedTasks}
      />

      {/* Game Boy Header */}
      <div className="gb-screen border-b-4 border-gb-darkest gb-flicker">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="gb-glow">
                <Gamepad2 className="h-10 w-10 text-gb-darkest" />
              </div>
              <h1 className="text-5xl font-gameboy text-gb-darkest tracking-wider">
                GAME BOY
              </h1>
              <div className="gb-glow">
                <div className="w-4 h-4 rounded-full gb-dark animate-pulse"></div>
              </div>
            </div>
            <div className="text-2xl font-gameboy text-gb-darkest mb-2 tracking-widest">
              TASK BOARD
            </div>
            <p className="text-gb-dark font-gameboy-light text-sm tracking-wide">
              CLASSIC RETRO TASK MANAGEMENT • USE ARROW KEYS OR CONTROLS
            </p>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto p-6">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map(column => (
              <DroppableColumn 
                key={column.id} 
                column={column}
                isSelected={selectedColumnId === column.id}
              >
                {column.tasks.map(task => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    isSelected={selectedTaskId === task.id}
                    onSelect={setSelectedTaskId}
                  />
                ))}

                {/* Add Task */}
                {addingToColumn === column.id ? (
                  <div className="space-y-3 gb-slide-in">
                    <Input
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value.toUpperCase())}
                      placeholder="ENTER TASK TITLE..."
                      className="gb-input font-gameboy-light text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && addTask(column.id)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => addTask(column.id)}
                        className="gb-button flex-1 font-gameboy text-xs"
                      >
                        ADD
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAddingToColumn(null)
                          setNewTaskTitle('')
                          playSound('cancel')
                        }}
                        className="gb-button font-gameboy text-xs"
                      >
                        CANCEL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-2 border-dashed border-gb-dark text-gb-dark hover:gb-light hover:text-gb-darkest hover:border-gb-darkest transition-all duration-200 font-gameboy text-xs gb-button"
                    onClick={() => {
                      setAddingToColumn(column.id)
                      playSound('select')
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    ADD TASK
                  </Button>
                )}
              </DroppableColumn>
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <Card className="gb-card p-4 rotate-2 gb-glow">
                <h3 className="font-gameboy-light text-gb-darkest text-xs mb-3">
                  {activeTask.title}
                </h3>
                <Badge className={`${getPriorityClass(activeTask.priority)} text-xs font-gameboy px-2 py-1 rounded-sm`}>
                  {activeTask.priority}
                </Badge>
              </Card>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Game Boy Controls */}
      <GameBoyControls
        onUp={navigateUp}
        onDown={navigateDown}
        onLeft={navigateLeft}
        onRight={navigateRight}
        onA={confirmAction}
        onB={cancelAction}
        onStart={startAction}
        onSelect={selectAction}
      />

      {/* Notification System */}
      <GameBoyNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={hideNotification}
      />

      {/* Game Boy Footer */}
      <div className="mt-12 border-t-4 border-gb-darkest gb-dark">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-3 h-3 rounded-full gb-lightest animate-pulse"></div>
              <p className="text-gb-lightest font-gameboy text-sm tracking-widest">
                NINTENDO 1989 • ENHANCED EDITION
              </p>
              <div className="w-3 h-3 rounded-full gb-lightest animate-pulse"></div>
            </div>
            <p className="text-gb-light font-gameboy-light text-xs tracking-wide">
              AUTHENTIC RETRO EXPERIENCE • PIXEL PERFECT • SOUND ENABLED
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App