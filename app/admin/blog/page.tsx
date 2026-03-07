'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Filter,
  LayoutGrid,
  LayoutList,
  FileText,
  Calendar,
  User,
  Eye as ViewIcon,
  MessageSquare,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AdminLayout from '@/components/admin/admin-layout'

interface BlogPost {
  id: number
  title: string
  slug: string
  author: string
  category: string
  status: 'published' | 'draft' | 'archived'
  date: string
  views: number
  comments: number
  excerpt: string
  image?: string
}

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 Luxury Properties in Lagos',
    slug: 'top-10-luxury-properties-lagos',
    author: 'Sarah Johnson',
    category: 'Market Trends',
    status: 'published',
    date: '2024-01-15',
    views: 1542,
    comments: 23,
    excerpt: 'Discover the most luxurious properties currently available in Lagos...',
  },
  {
    id: 2,
    title: 'Investment Opportunities in Nigerian Real Estate',
    slug: 'investment-opportunities-nigerian-real-estate',
    author: 'Michael Brown',
    category: 'Investment',
    status: 'published',
    date: '2024-01-12',
    views: 2103,
    comments: 45,
    excerpt: 'Explore the growing investment opportunities in Nigeria real estate market...',
  },
  {
    id: 3,
    title: 'First-Time Home Buyer Guide',
    slug: 'first-time-home-buyer-guide',
    author: 'Emily Davis',
    category: 'Guides',
    status: 'published',
    date: '2024-01-10',
    views: 3521,
    comments: 67,
    excerpt: 'Everything you need to know before buying your first home...',
  },
  {
    id: 4,
    title: 'Commercial vs Residential Properties',
    slug: 'commercial-vs-residential-properties',
    author: 'David Wilson',
    category: 'Investment',
    status: 'draft',
    date: '2024-01-08',
    views: 890,
    comments: 12,
    excerpt: 'Comparing the pros and cons of commercial and residential investments...',
  },
  {
    id: 5,
    title: 'Neighborhood Guide: Victoria Island',
    slug: 'neighborhood-guide-victoria-island',
    author: 'Lisa Martinez',
    category: 'Neighborhoods',
    status: 'published',
    date: '2024-01-05',
    views: 1876,
    comments: 34,
    excerpt: 'A comprehensive guide to living in Victoria Island, Lagos...',
  },
  {
    id: 6,
    title: 'Real Estate Market Predictions 2024',
    slug: 'real-estate-market-predictions-2024',
    author: 'John Doe',
    category: 'Market Trends',
    status: 'archived',
    date: '2023-12-28',
    views: 4521,
    comments: 89,
    excerpt: 'What to expect in the Nigerian real estate market in 2024...',
  },
]

const categoryOptions = ['Market Trends', 'Investment', 'Guides', 'Neighborhoods', 'Tips', 'News']
const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-slate-100 text-slate-800',
}

export default function AdminBlogPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [viewPost, setViewPost] = useState<BlogPost | null>(null)
  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [addPostOpen, setAddPostOpen] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts)
  
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    author: '',
    category: 'Market Trends',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    views: 0,
    comments: 0,
    excerpt: '',
  })
  
  const itemsPerPage = 10

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory
      const matchesStatus = filterStatus === 'all' || post.status === filterStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, filterCategory, filterStatus, posts])

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPosts, currentPage])

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)

  const handleDelete = (id: number) => {
    setPosts(posts.filter(p => p.id !== id))
    setDeleteId(null)
  }

  const handleSaveEdit = () => {
    if (editPost) {
      setPosts(posts.map(p => p.id === editPost.id ? editPost : p))
      setEditPost(null)
    }
  }

  const handleAddPost = () => {
    if (newPost.title && newPost.author) {
      const post: BlogPost = {
        id: Date.now(),
        title: newPost.title || '',
        slug: newPost.title?.toLowerCase().replace(/\s+/g, '-') || '',
        author: newPost.author || '',
        category: newPost.category || 'Market Trends',
        status: newPost.status as BlogPost['status'] || 'draft',
        date: newPost.date || new Date().toISOString().split('T')[0],
        views: 0,
        comments: 0,
        excerpt: newPost.excerpt || '',
      }
      setPosts([post, ...posts])
      setNewPost({
        title: '',
        slug: '',
        author: '',
        category: 'Market Trends',
        status: 'draft',
        date: new Date().toISOString().split('T')[0],
        views: 0,
        comments: 0,
        excerpt: '',
      })
      setAddPostOpen(false)
    }
  }

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={0}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Blog Management</h2>
              <p className="text-slate-600 text-sm mt-1">
                Manage all blog posts and articles
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setAddPostOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Post
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new blog post</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Search and Filter */}
          <Card className="bg-white p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>

              <Select value={filterCategory} onValueChange={(value) => {
                setFilterCategory(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value) => {
                setFilterStatus(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 border border-slate-200 rounded-lg p-1">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded transition ${
                          viewMode === 'card' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <LayoutGrid className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Card View</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded transition ${
                          viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <LayoutList className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Table View</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Card>

          {/* Results Counter */}
          <p className="text-sm text-slate-600">
            Showing {paginatedPosts.length} of {filteredPosts.length} posts
          </p>

          {/* Table View */}
          {viewMode === 'table' && (
            <Card className="bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPosts.map((post) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{post.title}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{post.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[post.status]}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{post.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600">
                          <Eye className="w-3 h-3" />
                          {post.views.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setViewPost(post)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditPost(post)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(post.id)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 h-32 relative flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-300" />
                      <Badge className={`absolute top-3 right-3 ${statusColors[post.status]}`}>
                        {post.status}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 line-clamp-2 mb-2">{post.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem onClick={() => setViewPost(post)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditPost(post)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setDeleteId(post.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {paginatedPosts.length === 0 && (
            <Card className="bg-white p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No blog posts found</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAddPostOpen(true)}>
                Create Your First Post
              </Button>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</Button>
              </div>
            </div>
          )}

          {/* View Post Modal */}
          <Dialog open={!!viewPost} onOpenChange={() => setViewPost(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Blog Post Details</DialogTitle>
              </DialogHeader>
              {viewPost && (
                <div className="space-y-6">
                  <div className="w-full h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-300" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{viewPost.title}</h3>
                      <Badge className={statusColors[viewPost.status]}>{viewPost.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><User className="w-4 h-4" />{viewPost.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{viewPost.date}</span>
                    </div>
                    <Badge variant="outline" className="mb-4">{viewPost.category}</Badge>
                    <p className="text-slate-600 mb-4">{viewPost.excerpt}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-t">
                    <div className="text-center">
                      <Eye className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewPost.views.toLocaleString()}</span>
                      <p className="text-xs text-slate-500">Views</p>
                    </div>
                    <div className="text-center">
                      <MessageSquare className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewPost.comments}</span>
                      <p className="text-xs text-slate-500">Comments</p>
                    </div>
                    <div className="text-center">
                      <FileText className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewPost.slug}</span>
                      <p className="text-xs text-slate-500">Slug</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewPost(null)}>Close</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setViewPost(null); setEditPost(viewPost!) }}>
                  <Edit className="w-4 h-4 mr-2" />Edit Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Post Modal */}
          <Dialog open={!!editPost} onOpenChange={() => setEditPost(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Edit Blog Post</DialogTitle>
                <DialogDescription>Update the blog post details.</DialogDescription>
              </DialogHeader>
              {editPost && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={editPost.title} onChange={(e) => setEditPost({ ...editPost, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Author</Label>
                      <Input value={editPost.author} onChange={(e) => setEditPost({ ...editPost, author: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={editPost.category} onValueChange={(value) => setEditPost({ ...editPost, category: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea value={editPost.excerpt} onChange={(e) => setEditPost({ ...editPost, excerpt: e.target.value })} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editPost.status} onValueChange={(value: BlogPost['status']) => setEditPost({ ...editPost, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={editPost.date} onChange={(e) => setEditPost({ ...editPost, date: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditPost(null)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Post Modal */}
          <Dialog open={addPostOpen} onOpenChange={setAddPostOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Blog Post</DialogTitle>
                <DialogDescription>Create a new blog post.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="Blog post title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Author *</Label>
                    <Input value={newPost.author} onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} placeholder="Author name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea value={newPost.excerpt} onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })} placeholder="Short description..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newPost.status} onValueChange={(value: BlogPost['status']) => setNewPost({ ...newPost, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={newPost.date} onChange={(e) => setNewPost({ ...newPost, date: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddPostOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddPost}>Add Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white p-6 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Post?</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
                  <Button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    </AdminLayout>
  )
}

