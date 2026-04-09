/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePageContent } from '@/hooks/usePageContent';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import ImageUpload from './ImageUpload';
import {
  Edit, Eye, Plus, Trash2, Home, Info, Phone, Save, X,
  Briefcase, BookOpen, Users, Image as ImageIcon,
  ChevronDown, ChevronRight, Award, Target, Clock, FileText, Layout, MapPin,
  Search
} from 'lucide-react';

// ── Block definitions per page type ──
interface BlockDef {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const PAGE_BLOCKS: Record<string, BlockDef[]> = {
  home: [
    { key: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
    { key: 'services', label: 'Services Section', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'license_section', label: 'License Section', icon: <Award className="w-4 h-4" /> },
  ],
  about: [
    { key: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
    { key: 'ceo_message', label: 'CEO Message', icon: <Users className="w-4 h-4" /> },
    { key: 'mission', label: 'Mission Statement', icon: <Target className="w-4 h-4" /> },
    { key: 'vision', label: 'Vision Statement', icon: <Eye className="w-4 h-4" /> },
    { key: 'values', label: 'Core Values', icon: <Award className="w-4 h-4" /> },
    { key: 'timeline', label: 'Company Timeline', icon: <Clock className="w-4 h-4" /> },
    { key: 'licenses', label: 'Licenses & Awards', icon: <FileText className="w-4 h-4" /> },
  ],
  services: [
    { key: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
    { key: 'why_choose', label: 'Why Choose Us', icon: <Award className="w-4 h-4" /> },
    { key: 'cta', label: 'Call to Action', icon: <Target className="w-4 h-4" /> },
  ],
  blog: [
    { key: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
  ],
  careers: [
    { key: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
    { key: 'benefits', label: 'Benefits', icon: <Award className="w-4 h-4" /> },
    { key: 'culture', label: 'Culture Section', icon: <Users className="w-4 h-4" /> },
  ],
  gallery: [
    { key: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
    { key: 'images', label: 'Gallery Images', icon: <ImageIcon className="w-4 h-4" /> },
  ],
  contact: [
    { key: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4" /> },
    { key: 'office', label: 'Office Information', icon: <MapPin className="w-4 h-4" /> },
    { key: 'contact_info', label: 'Contact Details', icon: <Phone className="w-4 h-4" /> },
    { key: 'form', label: 'Contact Form', icon: <FileText className="w-4 h-4" /> },
  ],
};

const HERO_BLOCK_NAME = 'home-hero';

const PageEditor = () => {
  const { pages, isLoading, createMutation, updateMutation, deleteMutation } = usePageContent();
  const { blocks: contentBlocks, updateMutation: cbUpdateMutation, createMutation: cbCreateMutation } = useContentBlocks();

  // ── Dialog / custom-page state ──
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_image: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    page_type: 'custom'
  });

  // ── Block-level editing state ──
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<{
    page: any;
    blockKey: string;
    blockLabel: string;
  } | null>(null);
  const [blockData, setBlockData] = useState<any>({});

  // ── SEO editing state for system pages ──
  const [editingSEO, setEditingSEO] = useState<any>(null);
  const [seoData, setSeoData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: '',
    og_image: '',
  });

  // Flat setter for blockData fields
  const bd = (key: string, value: any) =>
    setBlockData((prev: any) => ({ ...prev, [key]: value }));

  // Nested setter for blockData (e.g. 'phone.main')
  const bdNested = (path: string, value: any) => {
    setBlockData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]] || typeof obj[keys[i]] !== 'object') obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  // ── Block editing handlers ──
  const heroBlock = contentBlocks?.find(b => b.name === HERO_BLOCK_NAME);

  const handleBlockEdit = (page: any, blockKey: string, blockLabel: string) => {
    // Home hero → load from content blocks
    if (page.slug === 'home' && blockKey === 'hero') {
      const data = heroBlock?.content ? { ...heroBlock.content } : {};
      if (!data.background_images && data.background_image) {
        data.background_images = [data.background_image];
      }
      setBlockData(data);
      setEditingBlock({ page, blockKey, blockLabel });
      setDialogOpen(true);
      return;
    }

    const content = page.content || {};
    let data = content[blockKey];

    // Home services legacy flat keys
    if (page.slug === 'home' && blockKey === 'services' && !data) {
      data = {
        title: content.services_title || '',
        description: content.services_description || '',
      };
    }

    // Hero backward compat: single image → array
    if (blockKey === 'hero' && data) {
      if (!data.background_images && data.background_image) {
        data = { ...data, background_images: [data.background_image] };
      }
    }

    // About values normalize desc/description
    if (blockKey === 'values' && Array.isArray(data)) {
      data = data.map((v: any) => ({
        icon: v.icon || '',
        title: v.title || '',
        desc: v.desc || v.description || '',
      }));
    }

    setBlockData(data != null ? (Array.isArray(data) ? [...data] : { ...data }) : {});
    setEditingBlock({ page, blockKey, blockLabel });
    setDialogOpen(true);
  };

  const handleBlockSave = async () => {
    if (!editingBlock) return;
    try {
      const { page, blockKey } = editingBlock;

      // Home hero → save to content blocks
      if (page.slug === 'home' && blockKey === 'hero') {
        if (heroBlock) {
          await cbUpdateMutation.mutateAsync({ id: heroBlock.id, content: blockData });
        } else {
          await cbCreateMutation.mutateAsync({
            name: HERO_BLOCK_NAME,
            label: 'Home - Hero Section',
            block_type: 'hero',
            status: 'published',
            sort_order: 1,
            page_assignments: ['home'],
            content: blockData,
          } as any);
        }
        setDialogOpen(false);
        setEditingBlock(null);
        return;
      }

      const existingContent = page.content || {};
      const updatedContent = { ...existingContent, [blockKey]: blockData };

      // Clean up legacy flat keys for home services
      if (page.slug === 'home' && blockKey === 'services') {
        delete updatedContent.services_title;
        delete updatedContent.services_description;
      }

      await updateMutation.mutateAsync({
        id: page.id,
        title: page.title,
        slug: page.slug,
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        meta_keywords: page.meta_keywords || '',
        canonical_url: page.canonical_url || '',
        og_image: page.og_image || '',
        status: page.status,
        page_type: page.page_type,
        content: updatedContent,
      });

      setDialogOpen(false);
      setEditingBlock(null);
    } catch (error) {
      console.error('Error saving block:', error);
    }
  };

  // ── SEO editing handlers for system pages ──
  const handleEditSEO = (page: any) => {
    setEditingSEO(page);
    setSeoData({
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      canonical_url: page.canonical_url || '',
      og_image: page.og_image || '',
    });
    setEditingBlock(null);
    setEditingPage(null);
    setDialogOpen(true);
  };

  const handleSaveSEO = async () => {
    if (!editingSEO) return;
    try {
      await updateMutation.mutateAsync({
        id: editingSEO.id,
        title: editingSEO.title,
        slug: editingSEO.slug,
        status: editingSEO.status,
        page_type: editingSEO.page_type,
        content: editingSEO.content,
        ...seoData,
      });
      setDialogOpen(false);
      setEditingSEO(null);
    } catch (error) {
      console.error('Error saving SEO:', error);
    }
  };

  // ── Custom page handlers ──
  const handleEditCustom = (page: any) => {
    setEditingPage(page);
    setEditingBlock(null);
    setEditingSEO(null);
    setFormData({
      title: page.title,
      slug: page.slug,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      canonical_url: page.canonical_url || '',
      og_image: page.og_image || '',
      status: page.status,
      page_type: page.page_type || 'custom'
    });
    setDialogOpen(true);
  };

  const handleCreateCustom = () => {
    setEditingPage(null);
    setEditingBlock(null);
    setEditingSEO(null);
    setFormData({
      title: '',
      slug: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      canonical_url: '',
      og_image: '',
      status: 'draft',
      page_type: 'custom'
    });
    setDialogOpen(true);
  };

  const handleSaveCustom = async () => {
    try {
      const pageData = { ...formData, content: {} };
      if (editingPage) {
        await updateMutation.mutateAsync({ id: editingPage.id, ...pageData });
      } else {
        await createMutation.mutateAsync(pageData);
      }
      setDialogOpen(false);
      setEditingPage(null);
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const getPageRoute = (slug: string) => {
    const systemRoutes: Record<string, string> = {
      home: '/',
      about: '/about',
      contact: '/contact',
      services: '/services',
      blog: '/blog',
      careers: '/careers',
      gallery: '/gallery',
    };
    return systemRoutes[slug] || `/${slug}`;
  };

  const getPageIcon = (pageType: string, slug: string) => {
    if (pageType === 'system') {
      switch (slug) {
        case 'home': return <Home className="w-4 h-4" />;
        case 'about': return <Info className="w-4 h-4" />;
        case 'contact': return <Phone className="w-4 h-4" />;
        case 'services': return <Briefcase className="w-4 h-4" />;
        case 'blog': return <BookOpen className="w-4 h-4" />;
        case 'careers': return <Users className="w-4 h-4" />;
        case 'gallery': return <ImageIcon className="w-4 h-4" />;
        default: return <Edit className="w-4 h-4" />;
      }
    }
    return <Edit className="w-4 h-4" />;
  };

  const systemPages = pages?.filter((page: any) => page.page_type === 'system') || [];
  const customPages = pages?.filter((page: any) => page.page_type !== 'system') || [];

  // ── Per-block form renderer ──
  const renderBlockContent = (pageSlug: string, blockKey: string): React.ReactNode => {
    const compositeKey = `${pageSlug}.${blockKey}`;

    switch (compositeKey) {
      // ── HOME BLOCKS ──
      case 'home.hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Main Title</Label>
              <Input value={blockData.title ?? ''} onChange={e => bd('title', e.target.value)} placeholder="Professional Call Center Solutions" />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input value={blockData.subtitle ?? ''} onChange={e => bd('subtitle', e.target.value)} placeholder="Excellence in Service" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={blockData.description ?? ''} onChange={e => bd('description', e.target.value)} rows={2} />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea value={blockData.body ?? ''} onChange={e => bd('body', e.target.value)} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Button Text</Label><Input value={blockData.cta_text ?? ''} onChange={e => bd('cta_text', e.target.value)} /></div>
              <div><Label>Button Link</Label><Input value={blockData.cta_link ?? ''} onChange={e => bd('cta_link', e.target.value)} /></div>
            </div>
            <div>
              <Label className="mb-2 block">Background Images (Slideshow)</Label>
              {(blockData.background_images || []).map((img: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <ImageUpload
                    currentImage={img}
                    onImageUploaded={(url) => {
                      const arr = [...(blockData.background_images || [])];
                      arr[idx] = url;
                      bd('background_images', arr);
                    }}
                    folder="hero"
                  />
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockData.background_images || [])];
                    arr.splice(idx, 1);
                    bd('background_images', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => bd('background_images', [...(blockData.background_images || []), ''])}>
                <Plus className="w-4 h-4 mr-1" /> Add Slide
              </Button>
            </div>
          </div>
        );

      case 'home.services':
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} />
            </div>
            <div>
              <Label>Section Description</Label>
              <Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} />
            </div>
          </div>
        );

      case 'home.license_section':
        return (
          <div className="space-y-4">
            <div>
              <Label>Badge Text</Label>
              <Input value={blockData.badge || ''} onChange={e => bd('badge', e.target.value)} />
            </div>
            <div>
              <Label>Title</Label>
              <Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} />
            </div>
            <div>
              <Label>Highlight Text</Label>
              <Input value={blockData.highlight || ''} onChange={e => bd('highlight', e.target.value)} />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input value={blockData.subtitle || ''} onChange={e => bd('subtitle', e.target.value)} />
            </div>
          </div>
        );

      // ── ABOUT BLOCKS ──
      case 'about.hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Badge</Label>
              <Input value={blockData.badge || ''} onChange={e => bd('badge', e.target.value)} />
            </div>
            <div>
              <Label>Title</Label>
              <Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} />
            </div>
            <div>
              <Label>Highlight</Label>
              <Input value={blockData.highlight || ''} onChange={e => bd('highlight', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Background Image</Label>
              <ImageUpload currentImage={blockData.background_image || ''} onImageUploaded={url => bd('background_image', url)} folder="hero" />
            </div>
          </div>
        );

      case 'about.ceo_message':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={blockData.name || ''} onChange={e => bd('name', e.target.value)} />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} />
              </div>
              <div>
                <Label>Initials</Label>
                <Input value={blockData.initials || ''} onChange={e => bd('initials', e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Quotes</Label>
              {(blockData.quotes || ['', '', '']).map((q: string, idx: number) => (
                <div key={idx} className="mb-2">
                  <Textarea value={q} onChange={e => {
                    const arr = [...(blockData.quotes || ['', '', ''])];
                    arr[idx] = e.target.value;
                    bd('quotes', arr);
                  }} rows={2} placeholder={`Quote ${idx + 1}`} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => bd('quotes', [...(blockData.quotes || []), ''])}>
                <Plus className="w-4 h-4 mr-1" /> Add Quote
              </Button>
            </div>
          </div>
        );

      case 'about.mission':
      case 'about.vision':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={4} />
            </div>
          </div>
        );

      case 'about.values':
        return (
          <div className="space-y-4">
            {(Array.isArray(blockData) ? blockData : []).map((val: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Value {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...blockData]; arr.splice(idx, 1); setBlockData(arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label>Icon (emoji)</Label>
                    <Input value={val.icon || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], icon: e.target.value }; setBlockData(arr);
                    }} />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input value={val.title || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], title: e.target.value }; setBlockData(arr);
                    }} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={val.desc || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], desc: e.target.value }; setBlockData(arr);
                    }} rows={2} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBlockData([...(Array.isArray(blockData) ? blockData : []), { icon: '', title: '', desc: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Value
            </Button>
          </div>
        );

      case 'about.timeline':
        return (
          <div className="space-y-4">
            {(Array.isArray(blockData) ? blockData : []).map((t: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Entry {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...blockData]; arr.splice(idx, 1); setBlockData(arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Year</Label>
                    <Input value={t.year || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], year: e.target.value }; setBlockData(arr);
                    }} />
                  </div>
                  <div>
                    <Label>Event</Label>
                    <Input value={t.event || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], event: e.target.value }; setBlockData(arr);
                    }} />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea value={t.desc || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], desc: e.target.value }; setBlockData(arr);
                    }} rows={2} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBlockData([...(Array.isArray(blockData) ? blockData : []), { year: '', event: '', desc: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Entry
            </Button>
          </div>
        );

      case 'about.licenses':
        return (
          <div className="space-y-4">
            {(Array.isArray(blockData) ? blockData : []).map((lic: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">License {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...blockData]; arr.splice(idx, 1); setBlockData(arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2">
                  <ImageUpload currentImage={lic.src || ''} onImageUploaded={url => {
                    const arr = [...blockData]; arr[idx] = { ...arr[idx], src: url }; setBlockData(arr);
                  }} folder="licenses" />
                  <div>
                    <Label>Alt Text</Label>
                    <Input value={lic.alt || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], alt: e.target.value }; setBlockData(arr);
                    }} />
                  </div>
                  <div>
                    <Label>Caption</Label>
                    <Input value={lic.caption || ''} onChange={e => {
                      const arr = [...blockData]; arr[idx] = { ...arr[idx], caption: e.target.value }; setBlockData(arr);
                    }} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBlockData([...(Array.isArray(blockData) ? blockData : []), { src: '', alt: '', caption: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add License
            </Button>
          </div>
        );

      // ── CONTACT BLOCKS ──
      case 'contact.hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Badge</Label>
              <Input value={blockData.badge || ''} onChange={e => bd('badge', e.target.value)} />
            </div>
            <div>
              <Label>Title</Label>
              <Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} />
            </div>
            <div>
              <Label>Highlight</Label>
              <Input value={blockData.highlight || ''} onChange={e => bd('highlight', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Background Image</Label>
              <ImageUpload currentImage={blockData.background_image || ''} onImageUploaded={url => bd('background_image', url)} folder="hero" />
            </div>
          </div>
        );

      case 'contact.office':
        return (
          <div className="space-y-4">
            <div>
              <Label>City</Label>
              <Input value={blockData.city || ''} onChange={e => bd('city', e.target.value)} />
            </div>
          </div>
        );

      case 'contact.contact_info':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Phone Numbers</h4>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Main</Label><Input value={blockData.phone?.main || ''} onChange={e => bdNested('phone.main', e.target.value)} /></div>
                <div><Label>Sales</Label><Input value={blockData.phone?.sales || ''} onChange={e => bdNested('phone.sales', e.target.value)} /></div>
                <div><Label>Support</Label><Input value={blockData.phone?.support || ''} onChange={e => bdNested('phone.support', e.target.value)} /></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Email Addresses</h4>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>General</Label><Input value={blockData.email?.general || ''} onChange={e => bdNested('email.general', e.target.value)} /></div>
                <div><Label>Sales</Label><Input value={blockData.email?.sales || ''} onChange={e => bdNested('email.sales', e.target.value)} /></div>
                <div><Label>Support</Label><Input value={blockData.email?.support || ''} onChange={e => bdNested('email.support', e.target.value)} /></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Address</h4>
              <div className="space-y-4">
                <div><Label>Street</Label><Input value={blockData.address?.street || ''} onChange={e => bdNested('address.street', e.target.value)} /></div>
                <div><Label>City</Label><Input value={blockData.address?.city || ''} onChange={e => bdNested('address.city', e.target.value)} /></div>
                <div><Label>Hours</Label><Input value={blockData.address?.hours || ''} onChange={e => bdNested('address.hours', e.target.value)} /></div>
              </div>
            </div>
          </div>
        );

      case 'contact.form':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} />
            </div>
          </div>
        );

      // ── SERVICES BLOCKS ──
      case 'services.hero':
        return (
          <div className="space-y-4">
            <div><Label>Badge</Label><Input value={blockData.badge || ''} onChange={e => bd('badge', e.target.value)} /></div>
            <div><Label>Title</Label><Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} /></div>
            <div><Label>Highlight</Label><Input value={blockData.highlight || ''} onChange={e => bd('highlight', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} /></div>
          </div>
        );

      case 'services.why_choose':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} /></div>
            <div><Label>Subtitle</Label><Input value={blockData.subtitle || ''} onChange={e => bd('subtitle', e.target.value)} /></div>
            <div>
              <Label className="mb-2 block">Cards</Label>
              {(blockData.cards || []).map((card: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Card {idx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const arr = [...(blockData.cards || [])]; arr.splice(idx, 1); bd('cards', arr);
                    }}><X className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={card.title || ''} onChange={e => {
                      const arr = [...(blockData.cards || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; bd('cards', arr);
                    }} /></div>
                    <div><Label>Icon (emoji)</Label><Input value={card.icon || ''} onChange={e => {
                      const arr = [...(blockData.cards || [])]; arr[idx] = { ...arr[idx], icon: e.target.value }; bd('cards', arr);
                    }} /></div>
                    <div className="col-span-2"><Label>Description</Label><Textarea value={card.description || ''} onChange={e => {
                      const arr = [...(blockData.cards || [])]; arr[idx] = { ...arr[idx], description: e.target.value }; bd('cards', arr);
                    }} rows={2} /></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => bd('cards', [...(blockData.cards || []), { title: '', icon: '', description: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Card
              </Button>
            </div>
          </div>
        );

      case 'services.cta':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} /></div>
          </div>
        );

      // ── BLOG BLOCKS ──
      case 'blog.hero':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} /></div>
            <div><Label>Highlight</Label><Input value={blockData.highlight || ''} onChange={e => bd('highlight', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} /></div>
          </div>
        );

      // ── CAREERS BLOCKS ──
      case 'careers.hero':
        return (
          <div className="space-y-4">
            <div><Label>Badge</Label><Input value={blockData.badge || ''} onChange={e => bd('badge', e.target.value)} /></div>
            <div><Label>Title</Label><Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} /></div>
            <div><Label>Highlight</Label><Input value={blockData.highlight || ''} onChange={e => bd('highlight', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} /></div>
          </div>
        );

      case 'careers.benefits':
        return (
          <div className="space-y-4">
            {(Array.isArray(blockData) ? blockData : []).map((b: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Benefit {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...blockData]; arr.splice(idx, 1); setBlockData(arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2">
                  <div><Label>Icon</Label><Input value={b.icon || ''} onChange={e => {
                    const arr = [...blockData]; arr[idx] = { ...arr[idx], icon: e.target.value }; setBlockData(arr);
                  }} /></div>
                  <div><Label>Title</Label><Input value={b.title || ''} onChange={e => {
                    const arr = [...blockData]; arr[idx] = { ...arr[idx], title: e.target.value }; setBlockData(arr);
                  }} /></div>
                  <div><Label>Description</Label><Textarea value={b.desc || ''} onChange={e => {
                    const arr = [...blockData]; arr[idx] = { ...arr[idx], desc: e.target.value }; setBlockData(arr);
                  }} rows={2} /></div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBlockData([...(Array.isArray(blockData) ? blockData : []), { icon: '', title: '', desc: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Benefit
            </Button>
          </div>
        );

      case 'careers.culture':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} /></div>
            <div>
              <Label className="mb-2 block">Pillars</Label>
              {(blockData.pillars || []).map((p: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input value={p} onChange={e => {
                    const arr = [...(blockData.pillars || [])]; arr[idx] = e.target.value; bd('pillars', arr);
                  }} />
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockData.pillars || [])]; arr.splice(idx, 1); bd('pillars', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => bd('pillars', [...(blockData.pillars || []), ''])}>
                <Plus className="w-4 h-4 mr-1" /> Add Pillar
              </Button>
            </div>
          </div>
        );

      // ── GALLERY BLOCKS ──
      case 'gallery.hero':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockData.title || ''} onChange={e => bd('title', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockData.description || ''} onChange={e => bd('description', e.target.value)} rows={3} /></div>
          </div>
        );

      case 'gallery.images':
        return (
          <div className="space-y-4">
            {(Array.isArray(blockData) ? blockData : []).map((img: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Image {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...blockData]; arr.splice(idx, 1); setBlockData(arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2">
                  <ImageUpload currentImage={img.src || ''} onImageUploaded={url => {
                    const arr = [...blockData]; arr[idx] = { ...arr[idx], src: url }; setBlockData(arr);
                  }} folder="gallery" />
                  <div><Label>Alt Text</Label><Input value={img.alt || ''} onChange={e => {
                    const arr = [...blockData]; arr[idx] = { ...arr[idx], alt: e.target.value }; setBlockData(arr);
                  }} /></div>
                  <div><Label>Category</Label><Input value={img.category || ''} onChange={e => {
                    const arr = [...blockData]; arr[idx] = { ...arr[idx], category: e.target.value }; setBlockData(arr);
                  }} placeholder="e.g. Office, Events, Team" /></div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setBlockData([...(Array.isArray(blockData) ? blockData : []), { src: '', alt: '', category: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Image
            </Button>
          </div>
        );

      default:
        return <p className="text-slate-500">No editor available for this block.</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Pages – expandable with content blocks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Editable Pages</span>
              </CardTitle>
              <CardDescription>Click a page to expand its content blocks, then edit each section individually</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {systemPages.map((page: any) => {
              const isExpanded = expandedPage === page.slug;
              const blocks = PAGE_BLOCKS[page.slug] || [];

              return (
                <div key={page.id} className="border rounded-lg overflow-hidden">
                  {/* Page row – click to expand */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setExpandedPage(isExpanded ? null : page.slug)}
                  >
                    <div className="flex items-center space-x-3">
                      {isExpanded
                        ? <ChevronDown className="w-4 h-4 text-slate-400" />
                        : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      {getPageIcon(page.page_type, page.slug)}
                      <div>
                        <h3 className="font-medium">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">/{page.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                        {page.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                      </Badge>
                      <Button size="sm" variant="ghost" asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <a href={getPageRoute(page.slug)} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Expanded block cards */}
                  {isExpanded && blocks.length > 0 && (
                    <div className="border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {blocks.map((block) => (
                          <div
                            key={block.key}
                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">{block.icon}</span>
                              <span className="text-sm font-medium">{block.label}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBlockEdit(page, block.key, block.label)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        ))}

                        {/* SEO / Meta Settings card */}
                        <div
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 dark:text-blue-400"><Search className="w-4 h-4" /></span>
                            <div>
                              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">SEO / Meta</span>
                              {page.meta_title && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[140px]">{page.meta_title}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                            onClick={(e) => { e.stopPropagation(); handleEditSEO(page); }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Pages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Pages</CardTitle>
              <CardDescription>Create and manage custom pages</CardDescription>
            </div>
            <Button onClick={handleCreateCustom} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {customPages.length === 0 ? (
            <div className="text-center py-12">
              <Edit className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No custom pages yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">Create your first custom page to get started</p>
              <Button onClick={handleCreateCustom} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create Page
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {customPages.map((page: any) => (
                <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Edit className="w-4 h-4" />
                    <div>
                      <h3 className="font-medium">{page.title}</h3>
                      <p className="text-sm text-muted-foreground">/{page.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                      {page.status}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleEditCustom(page)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={getPageRoute(page.slug)} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) { setEditingBlock(null); setEditingPage(null); }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {editingSEO ? (
                <>
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>{editingSEO.title} — SEO / Meta Settings</span>
                </>
              ) : editingBlock ? (
                <>
                  {getPageIcon('system', editingBlock.page.slug)}
                  <span>{editingBlock.page.title} — {editingBlock.blockLabel}</span>
                </>
              ) : (
                <span>{editingPage ? 'Edit' : 'Create'} Page</span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* SEO editing mode for system pages */}
            {editingSEO && (
              <>
                <Separator />
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configure how this page appears in search engine results, social media shares, and browser tabs.
                  </p>

                  <div>
                    <Label htmlFor="seo-meta-title">SEO Title</Label>
                    <Input
                      id="seo-meta-title"
                      value={seoData.meta_title}
                      onChange={(e) => setSeoData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="Page title for search engines and browser tabs"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {seoData.meta_title.length}/60 characters (recommended max)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="seo-meta-description">Meta Description</Label>
                    <Textarea
                      id="seo-meta-description"
                      value={seoData.meta_description}
                      onChange={(e) => setSeoData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="Brief description for search engine result snippets"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {seoData.meta_description.length}/160 characters (recommended max)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="seo-meta-keywords">Meta Keywords</Label>
                    <Input
                      id="seo-meta-keywords"
                      value={seoData.meta_keywords}
                      onChange={(e) => setSeoData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                      placeholder="Comma-separated keywords (e.g. BPO, call center, Philippines)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seo-canonical-url">Canonical URL</Label>
                    <Input
                      id="seo-canonical-url"
                      value={seoData.canonical_url}
                      onChange={(e) => setSeoData(prev => ({ ...prev, canonical_url: e.target.value }))}
                      placeholder="https://jdgkbsi.ph/about (leave blank for auto)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The preferred URL for this page. Used to avoid duplicate content issues.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="seo-og-image">Social Share Image (OG Image)</Label>
                    <ImageUpload
                      value={seoData.og_image}
                      onChange={(url) => setSeoData(prev => ({ ...prev, og_image: url }))}
                      label="Upload or enter URL for social media preview image"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1200 x 630px. Shown when sharing on Facebook, Twitter, LinkedIn, etc.
                    </p>
                  </div>

                  {/* Live preview */}
                  <div className="border rounded-lg p-4 bg-white dark:bg-slate-900">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Google Search Preview</p>
                    <div className="space-y-1">
                      <p className="text-blue-700 dark:text-blue-400 text-lg font-medium truncate">
                        {seoData.meta_title || editingSEO.title || 'Page Title'}
                      </p>
                      <p className="text-green-700 dark:text-green-500 text-sm">
                        jdgkbsi.ph{getPageRoute(editingSEO.slug)}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {seoData.meta_description || 'No description set. Search engines will generate one automatically.'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Block editing mode */}
            {editingBlock && !editingSEO && (
              <>
                <Separator />
                {renderBlockContent(editingBlock.page.slug, editingBlock.blockKey)}
              </>
            )}

            {/* Custom page editing mode */}
            {!editingBlock && !editingSEO && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input
                      id="page-title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Page title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="page-status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="page-slug">URL Slug</Label>
                  <Input
                    id="page-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="page-url-slug"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="meta-title">SEO Title</Label>
                    <Input
                      id="meta-title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta-description">SEO Description</Label>
                    <Textarea
                      id="meta-description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="SEO description for search engines"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta-keywords">Meta Keywords</Label>
                    <Input
                      id="meta-keywords"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                  <div>
                    <Label htmlFor="canonical-url">Canonical URL</Label>
                    <Input
                      id="canonical-url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                      placeholder="https://jdgkbsi.ph/page-slug (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og-image">OG Image</Label>
                    <ImageUpload
                      value={formData.og_image}
                      onChange={(url) => setFormData(prev => ({ ...prev, og_image: url }))}
                      label="Social share image"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 border-t pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingBlock(null); setEditingPage(null); setEditingSEO(null); }}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={editingSEO ? handleSaveSEO : editingBlock ? handleBlockSave : handleSaveCustom}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    {editingSEO ? 'Save SEO' : editingBlock ? 'Save Block' : editingPage ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageEditor;
