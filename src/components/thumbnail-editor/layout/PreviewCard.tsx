import { Card, CardContent } from '@/components/ui/card'
import { PreviewProps } from '@/types/thumbnail'
import { ThumbnailPreview } from '../preview/ThumbnailPreview'

export function PreviewCard(props: PreviewProps) {
  return (
    <div className="flex-1 xl:w-[70%] order-2 xl:order-1 h-full">
      <Card className="h-full backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
        <CardContent className="p-0 h-full">
          <ThumbnailPreview {...props} />
        </CardContent>
      </Card>
    </div>
  )
}
