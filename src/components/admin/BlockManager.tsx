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
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from './ImageUpload';
import {
  useContentBlocks,
  ContentBlock,
  BLOCK_TYPES,
  ASSIGNABLE_PAGES,
} from '@/hooks/useContentBlocks';
import {
  Plus, Edit, Trash2, Save, X, Layout, FileText, Image as ImageIcon,
  Target, MessageSquare, BarChart3, Clock, Users, HelpCircle, Layers,
  Eye, Copy, Filter,
} from 'lucide-react';

// Icon map for block types
const BLOCK_TYPE_ICON: Record<string, React.ReactNode> = {
  hero: <Layout className="w-4 h-4" />,
  text: <FileText className="w-4 h-4" />,
  gallery: <ImageIcon className="w-4 h-4" />,
  cta: <Target className="w-4 h-4" />,
  form: <FileText className="w-4 h-4" />,
  stats: <BarChart3 className="w-4 h-4" />,
  testimonials: <MessageSquare className="w-4 h-4" />,
  cards: <Layers className="w-4 h-4" />,
  timeline: <Clock className="w-4 h-4" />,
  team: <Users className="w-4 h-4" />,
  faq: <HelpCircle className="w-4 h-4" />,
  custom: <Layout className="w-4 h-4" />,
};

const emptyFormData = {
  name: '',
  label: '',
  block_type: 'custom',
  status: 'draft' as const,
  sort_order: 0,
  page_assignments: [] as string[],
};

type FormData = typeof emptyFormData;

const BlockManager = () => {
  const { blocks, isLoading, createMutation, updateMutation, deleteMutation } = useContentBlocks();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'content'>('create');
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...emptyFormData });
  const [blockContent, setBlockContent] = useState<Record<string, any>>({});

  // Filtering
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPage, setFilterPage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // -- Handlers --
  const handleCreate = () => {
    setEditingBlock(null);
    setFormData({ ...emptyFormData });
    setBlockContent({});
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock(block);
    setFormData({
      name: block.name,
      label: block.label,
      block_type: block.block_type,
      status: block.status as any,
      sort_order: block.sort_order,
      page_assignments: block.page_assignments || [],
    });
    setBlockContent(block.content || {});
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleEditContent = (block: ContentBlock) => {
    setEditingBlock(block);
    setBlockContent(block.content || {});
    setDialogMode('content');
    setDialogOpen(true);
  };

  const handleDuplicate = (block: ContentBlock) => {
    setEditingBlock(null);
    setFormData({
      name: `${block.name}-copy`,
      label: `${block.label} (Copy)`,
      block_type: block.block_type,
      status: 'draft',
      sort_order: block.sort_order,
      page_assignments: block.page_assignments || [],
    });
    setBlockContent(block.content || {});
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleDelete = async (block: ContentBlock) => {
    if (window.confirm(`Delete block "${block.label}"? This cannot be undone.`)) {
      await deleteMutation.mutateAsync(block.id);
    }
  };

  const handleSave = async () => {
    try {
      if (dialogMode === 'create') {
        await createMutation.mutateAsync({
          ...formData,
          content: blockContent,
        } as any);
      } else if (dialogMode === 'edit' && editingBlock) {
        await updateMutation.mutateAsync({
          id: editingBlock.id,
          ...formData,
          content: blockContent,
        });
      } else if (dialogMode === 'content' && editingBlock) {
        await updateMutation.mutateAsync({
          id: editingBlock.id,
          content: blockContent,
        });
      }
      setDialogOpen(false);
      setEditingBlock(null);
    } catch (error) {
      console.error('Error saving block:', error);
    }
  };

  const togglePageAssignment = (slug: string) => {
    setFormData(prev => {
      const current = prev.page_assignments || [];
      const next = current.includes(slug)
        ? current.filter(s => s !== slug)
        : [...current, slug];
      return { ...prev, page_assignments: next };
    });
  };

  // Auto-generate name from label
  const handleLabelChange = (label: string) => {
    setFormData(prev => ({
      ...prev,
      label,
      name: dialogMode === 'create'
        ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.name,
    }));
  };

  // -- Content fields helper --
  const bc = (key: string, value: any) =>
    setBlockContent(prev => ({ ...prev, [key]: value }));

  // -- Content editor per block type --
  const renderContentEditor = () => {
    const type = dialogMode === 'content' ? editingBlock?.block_type : formData.block_type;

    switch (type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            <div><Label>Subtitle</Label><Input value={blockContent.subtitle || ''} onChange={e => bc('subtitle', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockContent.description || ''} onChange={e => bc('description', e.target.value)} rows={3} /></div>
            <div><Label>Badge</Label><Input value={blockContent.badge || ''} onChange={e => bc('badge', e.target.value)} /></div>
            <div><Label>Highlight</Label><Input value={blockContent.highlight || ''} onChange={e => bc('highlight', e.target.value)} /></div>
            <div>
              <Label className="mb-2 block">Background Images</Label>
              {(blockContent.background_images || []).map((img: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <ImageUpload
                    currentImage={img}
                    onImageUploaded={(url) => {
                      const arr = [...(blockContent.background_images || [])];
                      arr[idx] = url;
                      bc('background_images', arr);
                    }}
                    folder="hero"
                  />
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.background_images || [])];
                    arr.splice(idx, 1);
                    bc('background_images', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => bc('background_images', [...(blockContent.background_images || []), ''])}>
                <Plus className="w-4 h-4 mr-1" /> Add Image
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Button Text</Label><Input value={blockContent.cta_text || ''} onChange={e => bc('cta_text', e.target.value)} /></div>
              <div><Label>Button Link</Label><Input value={blockContent.cta_link || ''} onChange={e => bc('cta_link', e.target.value)} /></div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            <div><Label>Body</Label><Textarea value={blockContent.body || ''} onChange={e => bc('body', e.target.value)} rows={8} placeholder="Block content (supports markdown / HTML)" /></div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div><Label>Gallery Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            {(blockContent.images || []).map((img: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Image {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.images || [])]; arr.splice(idx, 1); bc('images', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <ImageUpload currentImage={img.src || ''} onImageUploaded={url => {
                  const arr = [...(blockContent.images || [])]; arr[idx] = { ...arr[idx], src: url }; bc('images', arr);
                }} folder="gallery" />
                <Input value={img.alt || ''} onChange={e => {
                  const arr = [...(blockContent.images || [])]; arr[idx] = { ...arr[idx], alt: e.target.value }; bc('images', arr);
                }} placeholder="Alt text" />
                <Input value={img.category || ''} onChange={e => {
                  const arr = [...(blockContent.images || [])]; arr[idx] = { ...arr[idx], category: e.target.value }; bc('images', arr);
                }} placeholder="Category" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('images', [...(blockContent.images || []), { src: '', alt: '', category: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Image
            </Button>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockContent.description || ''} onChange={e => bc('description', e.target.value)} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Button Text</Label><Input value={blockContent.button_text || ''} onChange={e => bc('button_text', e.target.value)} /></div>
              <div><Label>Button Link</Label><Input value={blockContent.button_link || ''} onChange={e => bc('button_link', e.target.value)} /></div>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            <div><Label>Form Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={blockContent.description || ''} onChange={e => bc('description', e.target.value)} rows={3} /></div>
            <div>
              <Label className="mb-2 block">Fields</Label>
              {(blockContent.fields || []).map((field: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-3 mb-2 grid grid-cols-3 gap-2">
                  <Input value={field.label || ''} onChange={e => {
                    const arr = [...(blockContent.fields || [])]; arr[idx] = { ...arr[idx], label: e.target.value }; bc('fields', arr);
                  }} placeholder="Label" />
                  <Select value={field.type || 'text'} onValueChange={v => {
                    const arr = [...(blockContent.fields || [])]; arr[idx] = { ...arr[idx], type: v }; bc('fields', arr);
                  }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.fields || [])]; arr.splice(idx, 1); bc('fields', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => bc('fields', [...(blockContent.fields || []), { label: '', type: 'text' }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Field
              </Button>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <div><Label>Section Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            {(blockContent.stats || []).map((stat: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 grid grid-cols-3 gap-2 items-end">
                <div><Label>Label</Label><Input value={stat.label || ''} onChange={e => {
                  const arr = [...(blockContent.stats || [])]; arr[idx] = { ...arr[idx], label: e.target.value }; bc('stats', arr);
                }} /></div>
                <div><Label>Value</Label><Input value={stat.value || ''} onChange={e => {
                  const arr = [...(blockContent.stats || [])]; arr[idx] = { ...arr[idx], value: e.target.value }; bc('stats', arr);
                }} /></div>
                <Button variant="ghost" size="sm" onClick={() => {
                  const arr = [...(blockContent.stats || [])]; arr.splice(idx, 1); bc('stats', arr);
                }}><X className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('stats', [...(blockContent.stats || []), { label: '', value: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Stat
            </Button>
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-4">
            <div><Label>Section Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            <div><Label>Subtitle</Label><Input value={blockContent.subtitle || ''} onChange={e => bc('subtitle', e.target.value)} /></div>
            {(blockContent.cards || []).map((card: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Card {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.cards || [])]; arr.splice(idx, 1); bc('cards', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <Input value={card.title || ''} onChange={e => {
                  const arr = [...(blockContent.cards || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; bc('cards', arr);
                }} placeholder="Card title" />
                <Input value={card.icon || ''} onChange={e => {
                  const arr = [...(blockContent.cards || [])]; arr[idx] = { ...arr[idx], icon: e.target.value }; bc('cards', arr);
                }} placeholder="Icon (emoji or class)" />
                <Textarea value={card.description || ''} onChange={e => {
                  const arr = [...(blockContent.cards || [])]; arr[idx] = { ...arr[idx], description: e.target.value }; bc('cards', arr);
                }} rows={2} placeholder="Description" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('cards', [...(blockContent.cards || []), { title: '', icon: '', description: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Card
            </Button>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            {(blockContent.entries || []).map((entry: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Entry {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.entries || [])]; arr.splice(idx, 1); bc('entries', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={entry.year || ''} onChange={e => {
                    const arr = [...(blockContent.entries || [])]; arr[idx] = { ...arr[idx], year: e.target.value }; bc('entries', arr);
                  }} placeholder="Year" />
                  <Input value={entry.event || ''} onChange={e => {
                    const arr = [...(blockContent.entries || [])]; arr[idx] = { ...arr[idx], event: e.target.value }; bc('entries', arr);
                  }} placeholder="Event" />
                </div>
                <Textarea value={entry.desc || ''} onChange={e => {
                  const arr = [...(blockContent.entries || [])]; arr[idx] = { ...arr[idx], desc: e.target.value }; bc('entries', arr);
                }} rows={2} placeholder="Description" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('entries', [...(blockContent.entries || []), { year: '', event: '', desc: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Entry
            </Button>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            {(blockContent.items || []).map((item: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Testimonial {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.items || [])]; arr.splice(idx, 1); bc('items', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <Input value={item.name || ''} onChange={e => {
                  const arr = [...(blockContent.items || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; bc('items', arr);
                }} placeholder="Client name" />
                <Input value={item.title || ''} onChange={e => {
                  const arr = [...(blockContent.items || [])]; arr[idx] = { ...arr[idx], title: e.target.value }; bc('items', arr);
                }} placeholder="Client title" />
                <Textarea value={item.content || ''} onChange={e => {
                  const arr = [...(blockContent.items || [])]; arr[idx] = { ...arr[idx], content: e.target.value }; bc('items', arr);
                }} rows={3} placeholder="Testimonial" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('items', [...(blockContent.items || []), { name: '', title: '', content: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Testimonial
            </Button>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            {(blockContent.members || []).map((member: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Member {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.members || [])]; arr.splice(idx, 1); bc('members', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={member.name || ''} onChange={e => {
                    const arr = [...(blockContent.members || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; bc('members', arr);
                  }} placeholder="Name" />
                  <Input value={member.role || ''} onChange={e => {
                    const arr = [...(blockContent.members || [])]; arr[idx] = { ...arr[idx], role: e.target.value }; bc('members', arr);
                  }} placeholder="Role" />
                </div>
                <Textarea value={member.bio || ''} onChange={e => {
                  const arr = [...(blockContent.members || [])]; arr[idx] = { ...arr[idx], bio: e.target.value }; bc('members', arr);
                }} rows={2} placeholder="Bio" />
                <ImageUpload currentImage={member.avatar || ''} onImageUploaded={url => {
                  const arr = [...(blockContent.members || [])]; arr[idx] = { ...arr[idx], avatar: url }; bc('members', arr);
                }} folder="team" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('members', [...(blockContent.members || []), { name: '', role: '', bio: '', avatar: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Member
            </Button>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <div><Label>Section Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            {(blockContent.items || []).map((item: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">FAQ {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.items || [])]; arr.splice(idx, 1); bc('items', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <Input value={item.question || ''} onChange={e => {
                  const arr = [...(blockContent.items || [])]; arr[idx] = { ...arr[idx], question: e.target.value }; bc('items', arr);
                }} placeholder="Question" />
                <Textarea value={item.answer || ''} onChange={e => {
                  const arr = [...(blockContent.items || [])]; arr[idx] = { ...arr[idx], answer: e.target.value }; bc('items', arr);
                }} rows={3} placeholder="Answer" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('items', [...(blockContent.items || []), { question: '', answer: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add FAQ
            </Button>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-4">
            <div><Label>Section Title (optional)</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} placeholder="e.g. Quick Links" /></div>
            {(blockContent.items || []).map((item: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Link {idx + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => {
                    const arr = [...(blockContent.items || [])]; arr.splice(idx, 1); bc('items', arr);
                  }}><X className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={item.label || ''} onChange={e => {
                    const arr = [...(blockContent.items || [])]; arr[idx] = { ...arr[idx], label: e.target.value }; bc('items', arr);
                  }} placeholder="Link label" />
                  <Input value={item.href || ''} onChange={e => {
                    const arr = [...(blockContent.items || [])]; arr[idx] = { ...arr[idx], href: e.target.value }; bc('items', arr);
                  }} placeholder="/path or https://..." />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => bc('items', [...(blockContent.items || []), { label: '', href: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </div>
        );

      default: // 'custom' or unrecognized
        return (
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={blockContent.title || ''} onChange={e => bc('title', e.target.value)} /></div>
            <div><Label>Content (JSON)</Label>
              <Textarea
                value={typeof blockContent.raw === 'string' ? blockContent.raw : JSON.stringify(blockContent, null, 2)}
                onChange={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setBlockContent(parsed);
                  } catch {
                    bc('raw', e.target.value);
                  }
                }}
                rows={10}
                className="font-mono text-sm"
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
        );
    }
  };

  // -- Filtering --
  const filteredBlocks = (blocks || []).filter(block => {
    if (filterType !== 'all' && block.block_type !== filterType) return false;
    if (filterPage !== 'all' && !(block.page_assignments || []).includes(filterPage)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return block.label.toLowerCase().includes(q) || block.name.toLowerCase().includes(q);
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading blocks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>Content Blocks</span>
              </CardTitle>
              <CardDescription>Create reusable content blocks and assign them to pages</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              New Block
            </Button>
          </div>
        </CardHeader>

        {/* Filters */}
        <CardContent className="border-t pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs mb-1 block">Search</Label>
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search blocks..."
                className="h-9"
              />
            </div>
            <div className="min-w-[150px]">
              <Label className="text-xs mb-1 block">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {BLOCK_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <Label className="text-xs mb-1 block">Assigned To</Label>
              <Select value={filterPage} onValueChange={setFilterPage}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  {ASSIGNABLE_PAGES.map(p => (
                    <SelectItem key={p.slug} value={p.slug}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blocks list */}
      {filteredBlocks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              {blocks?.length === 0 ? 'No blocks yet' : 'No blocks match your filters'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              {blocks?.length === 0
                ? 'Create your first content block to get started'
                : 'Try adjusting your search or filter criteria'}
            </p>
            {blocks?.length === 0 && (
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                New Block
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlocks.map(block => (
            <Card key={block.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">{BLOCK_TYPE_ICON[block.block_type] || <Layout className="w-4 h-4" />}</span>
                    <div>
                      <CardTitle className="text-base">{block.label}</CardTitle>
                      <p className="text-xs text-muted-foreground font-mono">{block.name}</p>
                    </div>
                  </div>
                  <Badge variant={block.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                    {block.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Block type */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {BLOCK_TYPES.find(t => t.value === block.block_type)?.label || block.block_type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Order: {block.sort_order}</span>
                </div>

                {/* Page assignments */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assigned to:</p>
                  {(block.page_assignments || []).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {(block.page_assignments || []).map(slug => (
                        <Badge key={slug} variant="secondary" className="text-xs capitalize">
                          {slug}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                  )}
                </div>

                {/* Actions */}
                <Separator />
                <div className="flex items-center justify-end gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEditContent(block)} title="Edit content">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(block)} title="Edit settings">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDuplicate(block)} title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(block)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary bar */}
      <div className="text-sm text-muted-foreground text-center">
        {filteredBlocks.length} of {blocks?.length || 0} block{(blocks?.length || 0) !== 1 ? 's' : ''}
        {filterType !== 'all' || filterPage !== 'all' || searchQuery ? ' (filtered)' : ''}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) { setEditingBlock(null); }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Layers className="w-5 h-5" />
              <span>
                {dialogMode === 'create' ? 'Create New Block' :
                 dialogMode === 'content' ? `Edit Content — ${editingBlock?.label}` :
                 `Edit Block — ${editingBlock?.label}`}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Block settings (create / edit mode) */}
            {(dialogMode === 'create' || dialogMode === 'edit') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Label *</Label>
                    <Input
                      value={formData.label}
                      onChange={e => handleLabelChange(e.target.value)}
                      placeholder="e.g. About Page Hero"
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="auto-generated-slug"
                      disabled={dialogMode === 'edit'}
                      className={dialogMode === 'edit' ? 'opacity-60' : ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Block Type</Label>
                    <Select value={formData.block_type} onValueChange={v => setFormData(prev => ({ ...prev, block_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BLOCK_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v: any) => setFormData(prev => ({ ...prev, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={formData.sort_order}
                      onChange={e => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                {/* Page assignments */}
                <div>
                  <Label className="mb-2 block">Assign to Pages</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ASSIGNABLE_PAGES.map(page => (
                      <div
                        key={page.slug}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => togglePageAssignment(page.slug)}
                      >
                        <Checkbox
                          checked={(formData.page_assignments || []).includes(page.slug)}
                          onCheckedChange={() => togglePageAssignment(page.slug)}
                        />
                        <span className="text-sm capitalize">{page.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                <h3 className="font-medium">Block Content</h3>
              </>
            )}

            {/* Content editor */}
            {renderContentEditor()}

            {/* Actions */}
            <div className="flex justify-end space-x-2 border-t pt-4">
              <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingBlock(null); }}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={
                  createMutation.isPending || updateMutation.isPending ||
                  ((dialogMode === 'create' || dialogMode === 'edit') && (!formData.label || !formData.name))
                }
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    {dialogMode === 'create' ? 'Create Block' : 'Save Changes'}
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

export default BlockManager;
