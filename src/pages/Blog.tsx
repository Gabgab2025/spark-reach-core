import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Update page meta
    document.title = 'Blog - CallCenter Pro | Latest Industry Insights';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stay updated with the latest call center industry insights, tips, and best practices from CallCenter Pro experts.');
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Set the most recent post as featured
        setFeaturedPost(data[0]);
        setPosts(data.slice(1)); // Rest of the posts
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Industry <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends, best practices, and expert insights in the call center industry.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 border-b">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Featured Article</Badge>
                <h2 className="text-3xl font-bold">Latest Featured Topic</h2>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    {featuredPost.featured_image && (
                      <div className="md:w-1/2">
                        <img 
                          src={featuredPost.featured_image} 
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="md:w-1/2 p-8">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(featuredPost.published_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{featuredPost.view_count || 0} views</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{featuredPost.title}</h3>
                      </CardHeader>
                      
                      <CardContent className="p-0">
                        <p className="text-muted-foreground mb-4">
                          {featuredPost.excerpt || featuredPost.meta_description}
                        </p>
                        
                        {featuredPost.tags && featuredPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {featuredPost.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="p-0">
                        <Button asChild className="btn-hero">
                          <Link to={`/blog/${featuredPost.slug}`}>
                            Read More <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        {posts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">All Articles</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    {post.featured_image && (
                      <div className="overflow-hidden">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.view_count || 0}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt || post.meta_description}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          Read Article <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && !featuredPost && posts.length === 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">No Blog Posts Yet</h2>
                <p className="text-muted-foreground mb-8">
                  We're working on creating amazing content for you. Check back soon!
                </p>
                <Button asChild className="btn-hero">
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;