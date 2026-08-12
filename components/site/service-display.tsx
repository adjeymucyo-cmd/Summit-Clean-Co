'use client'

import Link from 'next/link'
import { EditIcon, ArrowRight } from 'lucide-react'

interface ServiceDisplayProps {
  id: string
  name: string
  description?: string | null
  image_url?: string | null
  slug?: string
  isAdmin?: boolean
}

const cleaningServices = [
  {
    title: 'Residential Cleaning',
    description: 'Thorough, reliable cleaning for your home — from kitchens to bedrooms.',
  },
  {
    title: 'Commercial Cleaning',
    description:
      'Professional cleaning that keeps your workplace pristine and productive.',
  },
  {
    title: 'Deep Cleaning',
    description:
      'An intensive, top-to-bottom clean for spaces that need extra care.',
  },
  {
    title: 'Move In / Move Out',
    description:
      'Spotless transitions for tenants, buyers, and property managers.',
  },
  {
    title: 'Window Cleaning',
    description: 'Streak-free windows that let the light pour in.',
  },
  {
    title: 'Move-In Cleaning',
    description: 'A fresh, ready-to-enjoy start for your next home.',
  },
  {
    title: 'Interior Cleaning',
    description: 'Clean interiors that feel fresh, bright, and comfortable.',
  },
  {
    title: 'Custom Cleaning Services',
    description:
      'Flexible options for unique homes and business needs.',
  },
  {
    title: 'Office Cleaning',
    description:
      'A professional cleaning service that keeps workplaces clean, organized, fresh, and comfortable for employees and visitors.',
  },
]

export function ServiceDisplay() {
  return (
    <div className="space-y-6">
      {cleaningServices.map((service, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-[1.5rem] border border-[#DCE5E1] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-[0_18px_40px_rgba(15,91,79,0.12)]"
        >
          {/* Edit Button for Admin */}
          <div className="absolute right-4 top-4">
            <button
              className="rounded-full bg-white p-3 shadow-md transition-all duration-200 hover:bg-[#0F5B4F] hover:text-white"
              title="Edit service"
            >
              <EditIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3 pr-12">
            <h3 className="text-lg font-semibold tracking-tight text-[#14221F]">
              {service.title}
            </h3>
            <p className="text-base leading-6 text-[#60716D]">
              {service.description}
            </p>

            {/* Action Link */}
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 font-medium text-[#0F5B4F] transition-colors hover:text-[#093D35]"
            >
              Request this service
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
          </div>
        </div>
      ))}
    </div>
  )
}
