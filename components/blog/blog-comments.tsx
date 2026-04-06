'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ApiClientError } from '@/lib/client/api-error'
import { createBlogCommentRequest, deleteBlogCommentRequest } from '@/lib/client/blog-client'
import type { BlogCommentRecord } from '@/lib/server/blog/types'

const DEFAULT_COMMENT_IMAGE = '/brand/favicon-black.png'

export function BlogComments({
  slug,
  initialComments,
  initialCommentsCount,
}: {
  slug: string
  initialComments: BlogCommentRecord[]
  initialCommentsCount: number
}) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState(initialComments)
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error('You need to log in to comment.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await createBlogCommentRequest(slug, { content: comment })
      setComments((current) => [response.comment, ...current])
      setCommentsCount((current) => current + 1)
      setComment('')
      toast.success('Comment added.')
    } catch (submitError) {
      const message = submitError instanceof ApiClientError ? submitError.message : 'Unable to add comment.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteBlogCommentRequest(commentId)
      setComments((current) => current.filter((item) => item.id !== commentId))
      setCommentsCount((current) => Math.max(0, current - 1))
      toast.success('Comment deleted.')
    } catch (deleteError) {
      const message = deleteError instanceof ApiClientError ? deleteError.message : 'Unable to delete comment.'
      toast.error(message)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Comments</h2>
          <p className="mt-1 text-sm text-foreground/60">
            {isAuthenticated ? 'Share your thoughts on this post.' : 'Log in to leave a comment.'}
          </p>
        </div>
        <p className="text-sm text-foreground/50">{commentsCount} total</p>
      </div>

      <div className="mt-6 space-y-3">
        <Textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={isAuthenticated ? 'Write your comment...' : 'Log in to comment'}
          rows={4}
          disabled={!isAuthenticated || isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            className="bg-secondary text-white hover:bg-secondary/90"
            onClick={handleSubmitComment}
            disabled={!isAuthenticated || isSubmitting || comment.trim().length < 2}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-foreground/60">No comments yet.</p>
        ) : (
          comments.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary/10">
                    <Image
                      src={item.userProfileImageUrl || DEFAULT_COMMENT_IMAGE}
                      alt={item.userName}
                      fill
                      className={item.userProfileImageUrl ? 'object-cover' : 'object-contain p-2'}
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.userName}</p>
                    <p className="text-xs text-foreground/50">{new Date(item.createdAt).toLocaleString()}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/75">{item.content}</p>
                  </div>
                </div>
                {user?.id === item.userId ? (
                  <Button variant="ghost" size="sm" onClick={() => void handleDeleteComment(item.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
