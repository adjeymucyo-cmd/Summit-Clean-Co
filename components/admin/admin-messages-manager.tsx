'use client'

import { useState, useTransition } from 'react'
import { 
  updateContactMessageStatus,
  deleteContactMessage 
} from '@/lib/supabase/admin-actions'
import { replyToContactMessageWithDiagnostics } from '@/lib/supabase/contact-actions'
import type { ContactMessageRow } from '@/lib/types'
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  User, 
  Clock, 
  Reply, 
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type AdminMessagesManagerProps = {
  initialMessages: ContactMessageRow[]
}

export function AdminMessagesManager({ initialMessages }: AdminMessagesManagerProps) {
  const [messages, setMessages] = useState<ContactMessageRow[]>(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageRow | null>(
    initialMessages.length > 0 ? initialMessages[0] : null
  )
  const [filter, setFilter] = useState<'all' | 'new' | 'opened' | 'replied'>('all')
  const [replyText, setReplyText] = useState('')
  const [pending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => {
      setStatusMsg(null)
    }, 5000)
  }

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'new') return msg.status === 'new'
    if (filter === 'opened') return msg.status === 'opened'
    if (filter === 'replied') return msg.status === 'replied'
    return true
  })

  // Select message and mark as read/opened automatically
  const handleSelectMessage = (msg: ContactMessageRow) => {
    setSelectedMessage(msg)
    setReplyText('')

    // Automatically mark as opened if it's currently new/unread
    if (msg.status === 'new') {
      startTransition(async () => {
        const result = await updateContactMessageStatus(msg.id, 'opened')
        if (result.success) {
          const updated = messages.map(m => m.id === msg.id ? { ...m, status: 'opened' } : m)
          setMessages(updated)
          setSelectedMessage({ ...msg, status: 'opened' })
        }
      })
    }
  }

  // Toggle Read / Unread status manual override
  const handleToggleStatus = (msg: ContactMessageRow) => {
    const nextStatus = msg.status === 'new' ? 'opened' : 'new'
    startTransition(async () => {
      const result = await updateContactMessageStatus(msg.id, nextStatus)
      if (result.success) {
        const updated = messages.map(m => m.id === msg.id ? { ...m, status: nextStatus } : m)
        setMessages(updated)
        setSelectedMessage(prev => prev && prev.id === msg.id ? { ...prev, status: nextStatus } : prev)
        showStatus('success', `Message marked as ${nextStatus === 'new' ? 'unread' : 'read'}.`)
      } else {
        showStatus('error', result.error || 'Failed to update status.')
      }
    })
  }

  // Handle send reply
  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return

    startTransition(async () => {
      console.log('[ADMIN-MESSAGES] Sending reply:', {
        messageId: selectedMessage.id,
        customerEmail: selectedMessage.email,
        customerName: selectedMessage.name,
      })

      const result = await replyToContactMessageWithDiagnostics(
        selectedMessage.id, 
        replyText,
        selectedMessage.email,
        selectedMessage.name,
        selectedMessage.message
      )

      console.log('[ADMIN-MESSAGES] Reply result:', result)

      if (result.success) {
        const updated = messages.map(m => 
          m.id === selectedMessage.id 
            ? { ...m, reply_text: replyText, status: 'replied' } 
            : m
        )
        setMessages(updated)
        setSelectedMessage(prev => prev ? { ...prev, reply_text: replyText, status: 'replied' } : null)
        setReplyText('')

        if (result.emailStatus && String(result.emailStatus).toLowerCase().includes('failed')) {
          showStatus('error', `⚠️ Reply saved to database, but email delivery failed: ${result.emailStatus}`)
        } else if (result.emailStatus === 'sent') {
          showStatus('success', '✅ Reply saved and delivered to the customer successfully.')
        } else {
          showStatus('success', '✅ Reply saved to database.')
        }
      } else {
        showStatus('error', `Error at stage "${result.stage}": ${result.error}`)
      }
    })
  }

  // Handle delete message
  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this message? This action is permanent.')) {
      return
    }

    startTransition(async () => {
      const result = await deleteContactMessage(id)
      if (result.success) {
        const updated = messages.filter(m => m.id !== id)
        setMessages(updated)
        
        // Auto-select next available message or null
        if (selectedMessage?.id === id) {
          setSelectedMessage(updated.length > 0 ? updated[0] : null)
        }
        
        showStatus('success', 'Message deleted successfully.')
      } else {
        showStatus('error', result.error || 'Failed to delete message.')
      }
    })
  }

  // Helper mailto link generator
  const getMailtoLink = (msg: ContactMessageRow, reply: string) => {
    const subject = encodeURIComponent('Summit Clean Co. - Reply to your message')
    const body = encodeURIComponent(reply)
    return `mailto:${msg.email}?subject=${subject}&body=${body}`
  }

  // Formatter for timestamps
  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
          statusMsg.type === 'success' 
            ? 'bg-[#EAFDF8] border-[#A2EAD4] text-[#0F5B4F]' 
            : 'bg-[#FDF3F2] border-[#F8D2D0] text-[#B42318]'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#DCE5E1] pb-4">
        {(['all', 'new', 'opened', 'replied'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              filter === tab
                ? 'bg-[#0F5B4F] text-white'
                : 'bg-white text-[#60716D] border border-[#DCE5E1] hover:bg-[#F5F7F2] hover:text-[#0F5B4F]'
            }`}
          >
            {tab === 'new' ? 'Unread' : tab === 'opened' ? 'Read' : tab} ({
              tab === 'all' 
                ? messages.length 
                : messages.filter(m => {
                    if (tab === 'new') return m.status === 'new'
                    if (tab === 'opened') return m.status === 'opened'
                    if (tab === 'replied') return m.status === 'replied'
                    return true
                  }).length
            })
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        {/* Messages List Column */}
        <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm h-[calc(100vh-320px)] overflow-y-auto space-y-2">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full text-[#60716D]">
              <Mail className="h-10 w-10 opacity-30 mb-2" />
              <p className="font-semibold text-sm">No messages found</p>
              <p className="text-xs">Messages sent from the contact form show up here.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`w-full text-left p-4 rounded-2xl border transition duration-150 flex items-start justify-between group relative ${
                  selectedMessage?.id === msg.id
                    ? 'bg-[#DFEEE8] border-[#A2EAD4] text-[#0F5B4F]'
                    : 'bg-white border-[#DCE5E1] hover:bg-[#F5F7F2] text-[#14221F]'
                }`}
              >
                {msg.status === 'replied' && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500 shadow-md" title="Replied - Mark important" />
                )}
                <div className="space-y-1.5 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${msg.status === 'new' ? 'text-[#0F5B4F] font-bold' : ''}`}>
                      {msg.name}
                    </span>
                    {msg.status === 'new' && (
                      <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" title="Unread" />
                    )}
                    {msg.status === 'replied' && (
                      <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-md font-semibold">
                        Replied
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#60716D] truncate">{msg.email}</p>
                  <p className="text-xs text-[#60716D] line-clamp-1 italic">"{msg.message}"</p>
                  <p className="text-[10px] text-[#60716D] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(msg.created_at)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#60716D] opacity-40 group-hover:opacity-100 self-center transition-opacity" />
              </button>
            ))
          )}
        </div>

        {/* Message Details Pane */}
        <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-6 shadow-sm flex flex-col justify-between min-h-[calc(100vh-320px)]">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              {/* Message Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE5E1]/60 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#0F5B4F]" />
                      <h3 className="text-lg font-semibold text-[#14221F]">{selectedMessage.name}</h3>
                    </div>
                    <p className="text-sm text-[#60716D] flex items-center gap-1.5">
                      <span className="font-semibold text-xs uppercase tracking-wider">Email:</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-[#0F5B4F] hover:underline flex items-center gap-0.5">
                        {selectedMessage.email} <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </p>
                    {selectedMessage.phone && (
                      <p className="text-sm text-[#60716D] flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#0F5B4F]" />
                        <span className="font-semibold text-xs uppercase tracking-wider">Phone:</span>
                        <a href={`tel:${selectedMessage.phone}`} className="text-[#0F5B4F] hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(selectedMessage)}
                      disabled={pending}
                      className="rounded-full"
                    >
                      {selectedMessage.status === 'new' ? (
                        <>
                          <MailOpen className="h-4 w-4 mr-1.5" /> Mark read
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-1.5" /> Mark unread
                        </>
                      )}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={pending}
                      className="rounded-full"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#60716D]">Received</p>
                  <p className="text-xs text-[#14221F]">{formatTimestamp(selectedMessage.created_at)}</p>
                </div>

                {/* Message Body Content */}
                <div className="rounded-2xl bg-[#F5F7F2] border border-[#DCE5E1] p-5">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#0F5B4F] mb-2">Message</p>
                  <p className="text-sm leading-relaxed text-[#14221F] whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Reply History */}
                {selectedMessage.reply_text && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-widest text-red-600 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500" /> Admin Reply Sent
                      </p>
                      <a 
                        href={getMailtoLink(selectedMessage, selectedMessage.reply_text)}
                        className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                      >
                        Resend via Email <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-sm leading-relaxed text-red-700 whitespace-pre-wrap italic">
                      "{selectedMessage.reply_text}"
                    </p>
                  </div>
                )}
              </div>

              {/* Reply Box Section */}
              <div className="pt-6 border-t border-[#DCE5E1] space-y-4">
                <h4 className="text-sm font-semibold text-[#14221F] flex items-center gap-2">
                  <Reply className="h-4 w-4" /> Answer Message Directly
                </h4>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder={`Type your reply to ${selectedMessage.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    disabled={pending}
                    className="bg-white border-[#DCE5E1] rounded-xl focus-visible:ring-[#0F5B4F]/20"
                  />
                  
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <p className="text-xs text-[#60716D]">
                      ✉️ Reply will be saved & emailed directly to {selectedMessage.email}
                    </p>
                    <div className="flex gap-2">
                      {replyText.trim() && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-full shadow-sm text-xs bg-white hover:bg-slate-50 border-[#DCE5E1]"
                        >
                          <a href={getMailtoLink(selectedMessage, replyText)} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" /> Draft in Email Client
                          </a>
                        </Button>
                      )}
                      
                      <Button
                        onClick={handleSendReply}
                        disabled={pending || !replyText.trim()}
                        className="rounded-full px-5 h-9 text-xs bg-[#0F5B4F] hover:bg-[#093D35]"
                      >
                        {pending ? 'Sending...' : 'Send Reply'}
                        <Send className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#60716D]">
              <Mail className="h-12 w-12 opacity-25 mb-3" />
              <p className="font-semibold text-base">Select a Message</p>
              <p className="text-sm">Click on any message in the left sidebar to view its contents, change status, or reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
