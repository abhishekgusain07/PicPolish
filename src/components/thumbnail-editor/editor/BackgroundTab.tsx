import { BackgroundSelector } from '../controls/BackgroundSelector'
import { BackgroundState } from '@/types/thumbnail'

interface BackgroundTabProps {
  backgroundState: BackgroundState
  updateBackgroundState: (updates: Partial<BackgroundState>) => void
}

export function BackgroundTab({
  backgroundState,
  updateBackgroundState,
}: BackgroundTabProps) {
  return (
    <div className="p-4">
      <BackgroundSelector
        backgroundState={backgroundState}
        updateBackgroundState={updateBackgroundState}
      />
    </div>
  )
}
