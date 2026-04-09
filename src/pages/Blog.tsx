import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowRight, ChevronLeft, ChevronRight, Search, Share2, MessageCircle, Tag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { CMSPage } from '@/hooks/useCMS';
import { usePageMeta } from '@/hooks/usePageMeta';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  view_count: number;
  published_at: string;
  author_id: string;
  meta_description: string;
}

const Blog = () => {
  usePageMeta('blog');
  const { data: allPosts = [], isLoading: loading } = useQuery({
    queryKey: ['public-blog-posts'],
    queryFn: async () => {
      const { data, error } = await api.get<BlogPost[]>('/blog_posts', {
        params: { status: 'published', sort_by: 'published_at', order: 'desc' },
      });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch blog listing page content from CMS
  const { data: pageContent } = useQuery({
    queryKey: ['public-page', 'blog'],
    queryFn: async () => {
      const { data, error } = await api.get<CMSPage[]>('/pages', {
        params: { slug: 'blog', status: 'published' },
      });
      if (error) throw error;
      return data?.[0]?.content ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const heroTitle = pageContent?.hero?.title ?? 'Industry';
  const heroHighlight = pageContent?.hero?.highlight ?? 'Insights';
  const heroDescription = pageContent?.hero?.description ?? 'Stay updated with the latest trends, best practices, and expert insights in the call center industry.';

  // Use all posts for the main list
  const posts = useMemo(() => allPosts, [allPosts]);

  // Extract unique tags for the sidebar categories
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach(post => post.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allPosts]);

  const POSTS_PER_PAGE = 5; // Reduced for the vertical layout feel
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(
    () => filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
    [filteredPosts, currentPage, POSTS_PER_PAGE]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20">
          <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-12 w-64 mx-auto mb-6" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          </section>
          <section className="py-16 container mx-auto px-4 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-xl" />
               ))}
            </div>
            <div className="space-y-8">
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-64 w-full" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-white dark:bg-card border-b relative overflow-hidden">
             {/* Background Pattern similar to reference image header if possible, else clean */}
             <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.5))]" />
            <div className="container mx-auto px-4 text-center relative z-10">
              <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2 block">
                 {heroHighlight}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-foreground">
                {heroTitle}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {heroDescription}
              </p>
            </div>
        </section>

        <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-12">
                  {paginatedPosts.length > 0 ? (
                    paginatedPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden border-none shadow-none bg-transparent">
                         {post.featured_image && (
                          <div className="rounded-2xl overflow-hidden mb-6 shadow-sm">
                             <Link to={`/blog/${post.slug}`}>
                                <img 
                                  src={post.featured_image} 
                                  alt={post.title}
                                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 aspect-video"
                                />
                             </Link>
                          </div>
                         )}
                         
                         <CardContent className="p-0">
                            {post.tags && post.tags.length > 0 && (
                              <div className="mb-3">
                                <span className="text-orange-500 font-bold uppercase text-sm tracking-wide">
                                  {post.tags[0]}
                                </span>
                              </div>
                            )}

                            <Link to={`/blog/${post.slug}`}>
                              <h2 className="text-3xl font-bold mb-3 hover:text-primary transition-colors text-slate-900 dark:text-foreground">
                                {post.title}
                              </h2>
                            </Link>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                               <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>Admin</span>
                               </div>
                               <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(post.published_at)}</span>
                               </div>
                               <div className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>12 Comments</span>
                               </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                              {post.excerpt || post.meta_description}
                            </p>

                            <Separator className="mb-4" />

                            <div className="flex flex-wrap justify-between items-center text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                   <div className="flex items-center gap-2">
                                      <Tag className="w-4 h-4" />
                                      <span>{post.tags?.slice(0, 3).join(', ') || 'General'}</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                                   <Share2 className="w-4 h-4" />
                                   <span>Share</span>
                                </div>
                            </div>
                         </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                       <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                       <p className="text-muted-foreground">Try adjusting your search terms.</p>
                       {searchQuery && (
                         <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2">
                           Clear Search
                         </Button>
                       )}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-8">
                       <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'ghost'}
                          className={page === currentPage ? 'bg-orange-500 hover:bg-orange-600' : ''}
                          onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-8">
                   {/* Search Widget */}
                   <div className="bg-white dark:bg-card border rounded-xl p-6 shadow-sm">
                      <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Type to search..." 
                            className="pl-9 bg-slate-50 dark:bg-muted/50 border-slate-200" 
                          />
                      </div>
                   </div>

                   {/* Recent Posts Widget */}
                   <div className="bg-white dark:bg-card border rounded-xl p-6 shadow-sm">
                      <h3 className="font-bold text-lg mb-6 border-b pb-2 text-slate-900 dark:text-foreground">RECENT POSTS</h3>
                      <div className="space-y-6">
                         {posts.slice(0, 3).map((post) => (
                            <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                               <h4 className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-orange-500 transition-colors line-clamp-2 mb-1">
                                  {post.title}
                               </h4>
                               <span className="text-xs text-muted-foreground">
                                  {formatDate(post.published_at)}
                               </span>
                            </Link>
                         ))}
                      </div>
                   </div>

                   {/* Categories Widget */}
                   <div className="bg-white dark:bg-card border rounded-xl p-6 shadow-sm">
                      <h3 className="font-bold text-lg mb-6 border-b pb-2 text-slate-900 dark:text-foreground">CATEGORIES</h3>
                      <ul className="space-y-3">
                         {allTags.map((tag) => (
                            <li key={tag}>
                               <div className="flex items-center justify-between group cursor-pointer">
                                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-orange-500 transition-colors">
                                     - {tag}
                                  </span>
                               </div>
                            </li>
                         ))}
                         {allTags.length === 0 && (
                            <li className="text-sm text-muted-foreground">No categories found</li>
                         )}
                      </ul>
                   </div>
                </div>
              </div>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;