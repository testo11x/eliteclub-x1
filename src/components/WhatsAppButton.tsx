'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Expand every 10 seconds
    const interval = setInterval(() => {
      setIsExpanded(true)
      // Collapse after 3 seconds
      setTimeout(() => {
        setIsExpanded(false)
      }, 3000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const whatsappNumber = "9182850554"
  const message = encodeURIComponent("Hello, I'm reaching out from GermanGearsIndia website! I'd like to know more.")
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-green-500/50 transition-all duration-500 ease-in-out cursor-pointer overflow-hidden rounded-full h-14"
      style={{
        width: isExpanded ? '160px' : '56px', // 56px = 14 * 4 for h-14
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <MessageCircle className="w-7 h-7" />
      </div>
      <span
        className={`font-bold whitespace-nowrap overflow-hidden transition-all duration-500 ${
          isExpanded ? 'opacity-100 max-w-[100px] mr-4' : 'opacity-0 max-w-0 mr-0'
        }`}
      >
        Chat Now
      </span>
    </a>
  )
}
