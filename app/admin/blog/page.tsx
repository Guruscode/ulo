'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Edit, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import AdminLayout from '@/components/admin/admin-layout'
import { FileUpload } from '@/components/ui/file-upload'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ApiClientError } from '@/lib/client/api-error'
import {
  createAdminBlogRequest,
  deleteAdminBlogRequest,
  listAdminBlogsRequest,
  updateAdminBlogRequest,
} from '@/lib/client/admin-blog-client'
import type { BlogRecord } from '@/lib/server/blog/types'

const categoryOptions = ['Market Trends', 'Investment', 'Guides', 'Neighborhoods', 'Tips', 'News']

type BlogFormState = {
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}

const EMPTY_FORM: BlogFormState = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  category: 'Market Trends',
  status: 'draft',
  featured: false,
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingBlog, setEditingBlog] = useState<BlogRecord | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState<BlogFormState>(EMPTY_FORM)

  const loadBlogs = async () => {
    setIsLoading(true)
    try {
      const response = await listAdminBlogsRequest({
        status: filterStatus,
        category: filterCategory,
        search: searchTerm || undefined,
      })
      setBlogs(response.blogs)
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to load blog posts.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadBlogs()
  }, [filterCategory, filterStatus])

  const filteredBlogs = useMemo(() => {
    if (!searchTerm.trim()) {
      return blogs
    }
    const value = searchTerm.toLowerCase()
    return blogs.filter((blog) =>
      `${blog.title} ${blog.authorName} ${blog.category}`.toLowerCase().includes(value)
    )
  }, [blogs, searchTerm])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingBlog(null)
    setIsCreateOpen(true)
  }

  const openEdit = (blog: BlogRecord) => {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      status: blog.status,
      featured: blog.featured,
    })
    setIsCreateOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (editingBlog) {
        const response = await updateAdminBlogRequest(editingBlog.id, form)
        setBlogs((current) => current.map((item) => (item.id === editingBlog.id ? response.blog : item)))
        toast.success('Blog updated.')
      } else {
        const response = await createAdminBlogRequest(form)
        setBlogs((current) => [response.blog, ...current])
        toast.success('Blog created.')
      }
      setIsCreateOpen(false)
      setEditingBlog(null)
      setForm(EMPTY_FORM)
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to save blog post.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) {
      return
    }
    try {
      await deleteAdminBlogRequest(deleteId)
      setBlogs((current) => current.filter((item) => item.id !== deleteId))
      toast.success('Blog deleted.')
      setDeleteId(null)
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to delete blog post.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
            <p className="mt-1 text-sm text-slate-600">Only admin-managed posts appear on the public blog.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Blog Post
          </Button>
        </div>

        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, author, or category..."
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => void loadBlogs()}>Refresh</Button>
          </div>
        </Card>

        {isLoading ? <Card className="p-10 text-center">Loading blog posts...</Card> : null}

        {!isLoading && filteredBlogs.length === 0 ? (
          <Card className="p-10 text-center text-slate-600">No blog posts found.</Card>
        ) : null}

        {!isLoading && filteredBlogs.length > 0 ? (
          <div className="grid gap-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-32 overflow-hidden rounded-xl bg-slate-100">
                      <Image src={blog.image} alt={blog.title} fill className="object-cover" sizes="128px" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-900">{blog.title}</h2>
                        <Badge variant="outline">{blog.category}</Badge>
                        <Badge className={blog.status === 'published' ? 'bg-green-100 text-green-800' : blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'}>
                          {blog.status}
                        </Badge>
                        {blog.featured ? <Badge className="bg-blue-100 text-blue-800">Featured</Badge> : null}
                      </div>
                      <p className="line-clamp-2 text-sm text-slate-600">{blog.excerpt}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>Author: {blog.authorName}</span>
                        <span>Views: {blog.views}</span>
                        <span>Comments: {blog.commentsCount}</span>
                        <span>Date: {new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openEdit(blog)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setDeleteId(blog.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
              <DialogDescription>Admin-created posts are the only ones visible on the public blog.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <FileUpload
                  id="blog-featured-image"
                  accept="image/*"
                  label={form.image ? 'Change Featured Image' : 'Upload Featured Image'}
                  uploadingLabel="Uploading Image..."
                  maxSizeMb={4}
                  onUpload={(url) => setForm((current) => ({ ...current, image: url }))}
                />
                {form.image ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image src={form.image} alt="Blog preview" fill className="object-cover" sizes="100vw" />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value: BlogFormState['status']) => setForm({ ...form, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={12} />
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                />
                Mark this post as featured
              </label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : editingBlog ? 'Save Changes' : 'Create Post'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Blog Post</DialogTitle>
              <DialogDescription>This will permanently remove the post and its comments.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
