"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  seed: string
  animated?: boolean
  className?: string
}

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(seed)}`
}

function randomSeed() {
  return Math.random().toString(36).slice(2)
}

export function ChatAvatar({ seed, animated = false, className }: ChatAvatarProps) {
  const [current, setCurrent] = useState(seed)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!animated) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => setCurrent(randomSeed()), 300)
    }, 2000)
    return () => clearInterval(id)
  }, [animated])

  return (
    <Image
      key={current}
      src={dicebearUrl(current)}
      alt=""
      width={32}
      height={32}
      unoptimized
      onLoad={() => setVisible(true)}
      className={cn(
        "rounded-full transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  )
}
