import { useState } from 'react'
import { Joystick } from 'react-joystick-component'
import { cn } from '@/lib/utils'
import { Transform } from '@/constants/transform'
import { Position } from '@/constants/constant'
import { TransformControlsProps } from '@/types/thumbnail'

const initialTransform = 'perspective(500px) rotateY(0deg) rotateX(0deg)'

export function TransformControls({
  imageTransform,
  setImageTransform,
  imagePosition,
  setImagePosition,
  paddingValue,
  setPaddingValue,
  imageScale,
  setImageScale,
  imageBorder,
  setImageBorder,
  imageShadow,
  setImageShadow,
}: TransformControlsProps) {
  const [, setJoystickActive] = useState(false)
  const [, setBaseTransform] = useState(initialTransform)
  const [, setEventCounter] = useState(0)

  const handleJoystickStart = () => {
    setJoystickActive(true)
    setBaseTransform(imageTransform)
    setEventCounter(0)
  }

  const handleJoystickMove = (event: {
    x: number | null
    y: number | null
  }) => {
    setEventCounter((prev) => prev + 1)

    const xVal = event?.x ?? 0
    const yVal = event?.y ?? 0

    const deadZone = Math.abs(xVal) > 50 || Math.abs(yVal) > 50 ? 5 : 0.05
    if (Math.abs(xVal) < deadZone && Math.abs(yVal) < deadZone) {
      return
    }

    let scaleFactorX = 0.3
    let scaleFactorY = 0.3

    if (Math.abs(xVal) <= 1 && Math.abs(yVal) <= 1) {
      scaleFactorX = 30
      scaleFactorY = 30
    } else if (Math.abs(xVal) <= 10 && Math.abs(yVal) <= 10) {
      scaleFactorX = 3
      scaleFactorY = 3
    }

    const rotateY = xVal * scaleFactorX
    const rotateX = -yVal * scaleFactorY

    const transform = `perspective(500px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
    setImageTransform(transform)
  }

  const handleJoystickStop = () => {
    setJoystickActive(false)
  }

  const handleTransform = (index: number) => {
    if (imageTransform === Transform[index]) {
      setImageTransform(initialTransform)
    } else {
      setImageTransform(Transform[index])
    }
  }

  const handlePosition = (index: number) => {
    if (imagePosition === Position[index]) {
      setImagePosition('1 1 1 1')
    } else {
      setImagePosition(Position[index])
    }
  }

  return (
    <div className="space-y-6">
      {/* Image Controls */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Image Controls
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
              Border Radius
            </label>
            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
              <input
                className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                type="range"
                min="0"
                max="60"
                step="1"
                value={imageBorder}
                onChange={(e) => setImageBorder(Number(e.target.value))}
              />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                {imageBorder}px
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
              Shadow
            </label>
            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
              <input
                className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                type="range"
                min="0"
                max="100"
                step="1"
                value={imageShadow}
                onChange={(e) => setImageShadow(Number(e.target.value))}
              />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                {imageShadow}px
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
              Padding
            </label>
            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
              <input
                className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                type="range"
                min="0"
                max="10"
                step="1"
                value={paddingValue}
                onChange={(e) => setPaddingValue(Number(e.target.value))}
              />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                {paddingValue}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
              Scale
            </label>
            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
              <input
                className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                type="range"
                min="0.15"
                max="2"
                step="0.1"
                value={imageScale}
                onChange={(e) => setImageScale(Number(e.target.value))}
              />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                {imageScale}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Transform */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          3D Transform
        </h4>
        <div className="flex justify-center">
          <div className="bg-slate-100/80 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 text-center">
              Tilt Control
            </div>
            <div className="flex flex-col items-center gap-2">
              <Joystick
                size={60}
                stickSize={25}
                baseColor="rgba(148, 163, 184, 0.3)"
                stickColor="rgba(71, 85, 105, 0.8)"
                start={handleJoystickStart}
                move={handleJoystickMove}
                stop={handleJoystickStop}
                throttle={50}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transform Presets */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Transform Presets
        </h4>
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
          {[...Array(11)].map((_, index) => (
            <button
              key={index}
              className={cn(
                'flex-shrink-0 w-20 h-20 rounded-2xl border-2 transition-all duration-200 overflow-hidden relative',
                imageTransform === Transform[index]
                  ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                  : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400 hover:scale-105'
              )}
              style={{
                background:
                  'linear-gradient(135deg, #FF002C, #FF0057, #FF0082,#FF00AD, #FF00D8, #C100FF, #8900FF, #5900FF, #2400FF)',
              }}
              onClick={() => handleTransform(index)}
            >
              <div
                className="w-12 h-12 bg-white/90 border border-slate-200 rounded-lg shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: Transform[index],
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Padding Position */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Padding Position
        </h4>
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
            {Position.map((position, index) => (
              <button
                key={position}
                className={cn(
                  'w-12 h-8 rounded-lg transition-all duration-200 border-2',
                  imagePosition === position
                    ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
                    : 'bg-slate-100 dark:bg-slate-600 border-slate-300/50 dark:border-slate-500/50 hover:bg-slate-200 dark:hover:bg-slate-500 hover:border-slate-400 dark:hover:border-slate-400'
                )}
                onClick={() => handlePosition(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
