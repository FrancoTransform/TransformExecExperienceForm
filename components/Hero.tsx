'use client'

import Image from 'next/image'

interface HeroProps {
  title?: string
  subtitle?: string
  showFullBanner?: boolean
}

export default function Hero({ title, subtitle, showFullBanner = true }: HeroProps) {
  return (
    <div className="relative w-full">
      {/* Hero Banner Image */}
      <div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden">
        <Image
          src="/Transform2026FeaturedImage.png"
          alt="Transform 2026"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>
      
      {/* Optional title overlay */}
      {(title || subtitle) && (
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-4xl mx-auto text-center">
            {title && (
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm md:text-base text-white/90 drop-shadow-md">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

