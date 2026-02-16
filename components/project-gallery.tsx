"use client"

import BounceCards from "@/components/bounce-cards"

interface ProjectGalleryProps {
  images: string[]
  mainImage?: string
}

export function ProjectGallery({ images, mainImage }: ProjectGalleryProps) {
  const allImages = mainImage
    ? [mainImage, ...images.filter(img => img !== mainImage)].slice(0, 5)
    : images.slice(0, 5)

  if (allImages.length === 0) return null

  const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)",
  ]

  return (
    <div className="flex justify-center py-12">
      <BounceCards
        className="custom-bounceCards"
        images={allImages}
        containerWidth={600}
        containerHeight={300}
        animationDelay={0.5}
        animationStagger={0.08}
        easeType="elastic.out(1, 0.5)"
        transformStyles={transformStyles.slice(0, allImages.length)}
        enableHover
      />
    </div>
  )
}
