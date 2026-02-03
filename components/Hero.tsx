'use client'

import Image from 'next/image'

interface HeroProps {
  title?: string
  subtitle?: string
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <div className="relative w-full bg-purple-900">
      {/* Hero Banner Image - maintains aspect ratio */}
      <div className="relative w-full">
        <Image
          src="/Transform2026FeaturedImage.png"
          alt="Transform 2026"
          width={1200}
          height={368}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Optional title overlay */}
      {(title || subtitle) && (
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent">
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

