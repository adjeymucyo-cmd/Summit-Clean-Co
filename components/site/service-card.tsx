'use client'

import { EditIcon } from 'lucide-react'
import Link from 'next/link'

interface ServiceCardProps {
  id: string
  name: string
  description?: string | null
  short_description?: string | null
  image_url?: string | null
  slug?: string
  isAdmin?: boolean
  fallbackImage?: string
}

export function ServiceCard({
  id,
  name,
  description,
  short_description,
  image_url,
  slug,
  isAdmin = false,
  fallbackImage = 'https://images.pexels.com/photos/4095884/pexels-photo-4095884.jpeg?auto=compress&cs=tinysrgb&w=1200',
}: ServiceCardProps) {
  const displayDescription = description || short_description || ''
  const imageToUse = image_url?.trim() ? image_url : fallbackImage

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#DCE5E1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,91,79,0.12)]">
      {/* Service Image */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={imageToUse}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Edit Button for Admin */}
        {isAdmin && (
          <Link
            href={`/admin/services#edit-${id}`}
            className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-md transition-all duration-200 hover:bg-[#0F5B4F] hover:text-white"
            title="Edit service"
          >
            <EditIcon className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-6">
        <h3 className="text-xl font-semibold tracking-tight text-[#14221F]">
          {name}
        </h3>
        <p className="line-clamp-3 text-base leading-6 text-[#60716D]">
          {displayDescription}
        </p>
        
        {slug && (
          <Link
            href={`/services/${slug}`}
            className="inline-flex items-center gap-2 font-medium text-[#0F5B4F] transition-colors hover:text-[#093D35]"
          >
            Learn more
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </article>
  )
}
