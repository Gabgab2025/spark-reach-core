/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContentBlocks } from '@/hooks/useContentBlocks';
import ImageUpload from './ImageUpload';
import { Layout, Plus, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HERO_BLOCK_NAME = 'home-hero';

const HeroManager = () => {
  const { blocks, isLoading, updateMutation, createMutation } = useContentBlocks();
  const { toast } = useToast();
  const [content, setContent] = useState<Record<string, any>>({});
  const [isDirty, setIsDirty] = useState(false);

  const heroBlock = blocks?.find(b => b.name === HERO_BLOCK_NAME);

  useEffect(() => {
    if (heroBlock?.content) {
      setContent(heroBlock.content);
      setIsDirty(false);
    }
  }, [heroBlock]);

  const update = (key: string, value: any) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      if (heroBlock) {
        await updateMutation.mutateAsync({
          id: heroBlock.id,
          content,
        });
      } else {
        await createMutation.mutateAsync({
          name: HERO_BLOCK_NAME,
          label: 'Home - Hero Section',
          block_type: 'hero',
          status: 'published',
          sort_order: 1,
          page_assignments: ['home'],
          content,
        } as any);
      }
      setIsDirty(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-2 text-muted-foreground">Loading hero section...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Hero Section
              </CardTitle>
              <CardDescription>
                Manage your homepage hero section — images, text, and call-to-action button
              </CardDescription>
            </div>
            <Button
              onClick={handleSave}
              disabled={!isDirty || updateMutation.isPending || createMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {(updateMutation.isPending || createMutation.isPending) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Background Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Background Images</CardTitle>
          <CardDescription>
            Upload slideshow images for the hero section. Images rotate automatically every 5 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(content.background_images || []).map((img: string, idx: number) => (
            <div key={idx} className="flex items-start gap-4 p-3 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground mb-1 block">Image {idx + 1}</Label>
                <ImageUpload
                  currentImage={img}
                  onImageUploaded={(url) => {
                    const arr = [...(content.background_images || [])];
                    arr[idx] = url;
                    update('background_images', arr);
                  }}
                  folder="hero"
                />
                {img && (
                  <div className="mt-2 rounded overflow-hidden border">
                    <img src={img} alt={`Hero slide ${idx + 1}`} className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  const arr = [...(content.background_images || [])];
                  arr.splice(idx, 1);
                  update('background_images', arr);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => update('background_images', [...(content.background_images || []), ''])}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </CardContent>
      </Card>

      {/* Hero Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hero Text</CardTitle>
          <CardDescription>Main heading, subtitle, and description shown over the hero images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title ?? ''}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. Results Driven,"
            />
          </div>
          <div>
            <Label>Subtitle (Highlighted)</Label>
            <Input
              value={content.subtitle ?? ''}
              onChange={e => update('subtitle', e.target.value)}
              placeholder="e.g. Client Focused"
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Textarea
              value={content.description ?? ''}
              onChange={e => update('description', e.target.value)}
              placeholder="Short tagline text"
              rows={2}
            />
          </div>
          <div>
            <Label>Body Text</Label>
            <Textarea
              value={content.body ?? ''}
              onChange={e => update('body', e.target.value)}
              placeholder="Longer description paragraph"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* CTA Button */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Call-to-Action Button</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.cta_text ?? ''}
                onChange={e => update('cta_text', e.target.value)}
                placeholder="e.g. Let's Work Together"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content.cta_link ?? ''}
                onChange={e => update('cta_link', e.target.value)}
                placeholder="e.g. /contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroManager;
