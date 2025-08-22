import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: number
}

export const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size={48} className="text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">{message}</p>
    </div>
  );
}

export function CenteredLoader({ message }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size={32} className="text-primary" />
            {message && <p className="mt-3 text-base text-muted-foreground">{message}</p>}
        </div>
    );
}
