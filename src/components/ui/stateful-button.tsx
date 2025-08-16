'use client'
import { cn } from '@/lib/utils'
import React from 'react'
import { motion, AnimatePresence, useAnimate } from 'motion/react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
  isLoading?: boolean
  showSuccess?: boolean
}

export const Button = ({
  className,
  children,
  isLoading,
  showSuccess,
  ...props
}: ButtonProps) => {
  const [scope, animate] = useAnimate()

  // Handle external loading state
  React.useEffect(() => {
    if (isLoading) {
      animate(
        '.loader',
        {
          width: '20px',
          scale: 1,
          display: 'block',
        },
        {
          duration: 0.2,
        }
      )
      animate(
        '.check',
        {
          width: '0px',
          scale: 0,
          display: 'none',
        },
        {
          duration: 0.2,
        }
      )
    } else {
      animate(
        '.loader',
        {
          width: '0px',
          scale: 0,
          display: 'none',
        },
        {
          duration: 0.2,
        }
      )
    }
  }, [isLoading, animate])

  // Handle external success state
  React.useEffect(() => {
    if (showSuccess) {
      animate(
        '.check',
        {
          width: '20px',
          scale: 1,
          display: 'block',
        },
        {
          duration: 0.2,
        }
      )

      // Auto hide success after 2 seconds
      const timer = setTimeout(() => {
        animate(
          '.check',
          {
            width: '0px',
            scale: 0,
            display: 'none',
          },
          {
            duration: 0.2,
          }
        )
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showSuccess, animate])

  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...buttonProps
  } = props

  return (
    <motion.button
      layout
      layoutId="button"
      ref={scope}
      className={cn(
        'flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-md bg-black px-4 py-2 font-medium text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-gray-600 dark:ring-offset-black disabled:opacity-50',
        className
      )}
      {...buttonProps}
      onClick={onClick}
      disabled={isLoading || buttonProps.disabled}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  )
}

const Loader = () => {
  return (
    <motion.svg
      animate={{
        rotate: [0, 360],
      }}
      initial={{
        scale: 0,
        width: 0,
        display: 'none',
      }}
      style={{
        scale: 0.5,
        display: 'none',
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        ease: 'linear',
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="loader text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  )
}

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: 'none',
      }}
      style={{
        scale: 0.5,
        display: 'none',
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  )
}
