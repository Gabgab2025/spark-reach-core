import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 1. Static Routes
    const staticRoutes = [
      '',
      'about',
      'services',
      'blog',
      'careers',
      'contact',
      'gallery',
    ]

    const baseUrl = 'https://jdgkbusiness.com'
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Add static routes
    staticRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${baseUrl}${route ? '/' + route : ''}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
    })

    // 2. Dynamic Routes - Pages
    const { data: pages } = await supabaseClient
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published')

    pages?.forEach((page: any) => {
      // Avoid duplicating static routes if they exist as pages in CMS
      if (!staticRoutes.includes(page.slug)) {
        sitemap += `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      }
    })

    // 3. Dynamic Routes - Services
    const { data: services } = await supabaseClient
      .from('services')
      .select('slug, updated_at')

    services?.forEach((service: any) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/service/${service.slug}</loc>
    <lastmod>${new Date(service.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    })

    // 4. Dynamic Routes - Blog Posts
    const { data: posts } = await supabaseClient
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')

    posts?.forEach((post: any) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
    })

    // 5. Dynamic Routes - Job Listings
    const { data: jobs } = await supabaseClient
      .from('job_listings')
      .select('id, updated_at')
      .eq('status', 'open')

    jobs?.forEach((job: any) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/job/${job.id}</loc>
    <lastmod>${new Date(job.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    })

    sitemap += `
</urlset>`

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
