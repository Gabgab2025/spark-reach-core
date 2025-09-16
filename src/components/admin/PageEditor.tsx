import React, { useState, useEffect } from 'react';
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
import ImageUpload from './ImageUpload';
import { Edit, Eye, Plus, Trash2, Home, Info, Phone, Save, X } from 'lucide-react';

// Form interfaces for each page type
interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    background_image?: string;
    cta_text: string;
    cta_link: string;
  };
  services: {
    title: string;
    description: string;
  };
}

interface AboutPageContent {
  hero: {
    title: string;
    description: string;
    background_image?: string;
  };
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  values: Array<{
    title: string;
    description: string;
  }>;
}

interface ContactPageContent {
  hero: {
    title: string;
    description: string;
    background_image?: string;
  };
  contact_info: {
    phone: {
      main: string;
      sales: string;
      support: string;
    };
    email: {
      general: string;
      sales: string;
      support: string;
    };
    address: {
      street: string;
      city: string;
      hours: string;
    };
  };
  form: {
    title: string;
    description: string;
  };
}

const PageEditor = () => {
  const { pages, isLoading, createMutation, updateMutation, deleteMutation } = usePageContent();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [activeForm, setActiveForm] = useState<'home' | 'about' | 'contact' | null>(null);

  // Form states for each page type
  const [homeContent, setHomeContent] = useState<HomePageContent>({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      background_image: '',
      cta_text: '',
      cta_link: ''
    },
    services: {
      title: '',
      description: ''
    }
  });

  const [aboutContent, setAboutContent] = useState<AboutPageContent>({
    hero: {
      title: '',
      description: '',
      background_image: ''
    },
    mission: {
      title: '',
      description: ''
    },
    vision: {
      title: '',
      description: ''
    },
    values: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ]
  });

  const [contactContent, setContactContent] = useState<ContactPageContent>({
    hero: {
      title: '',
      description: '',
      background_image: ''
    },
    contact_info: {
      phone: {
        main: '',
        sales: '',
        support: ''
      },
      email: {
        general: '',
        sales: '',
        support: ''
      },
      address: {
        street: '',
        city: '',
        hours: ''
      }
    },
    form: {
      title: '',
      description: ''
    }
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    page_type: 'custom'
  });

  const loadPageContent = (page: any, pageType: 'home' | 'about' | 'contact') => {
    const content = page.content || {};
    
    switch (pageType) {
      case 'home':
        setHomeContent({
          hero: {
            title: content.hero?.title || '',
            subtitle: content.hero?.subtitle || '',
            description: content.hero?.description || '',
            background_image: content.hero?.background_image || '',
            cta_text: content.hero?.cta_text || '',
            cta_link: content.hero?.cta_link || ''
          },
          services: {
            title: content.services_title || content.services?.title || '',
            description: content.services_description || content.services?.description || ''
          }
        });
        break;
      case 'about':
        setAboutContent({
          hero: {
            title: content.hero?.title || '',
            description: content.hero?.description || '',
            background_image: content.hero?.background_image || ''
          },
          mission: {
            title: content.mission?.title || '',
            description: content.mission?.description || ''
          },
          vision: {
            title: content.vision?.title || '',
            description: content.vision?.description || ''
          },
          values: content.values?.length ? content.values : [
            { title: '', description: '' },
            { title: '', description: '' },
            { title: '', description: '' },
            { title: '', description: '' }
          ]
        });
        break;
      case 'contact':
        setContactContent({
          hero: {
            title: content.hero?.title || '',
            description: content.hero?.description || '',
            background_image: content.hero?.background_image || ''
          },
          contact_info: {
            phone: {
              main: content.contact_info?.phone?.main || '',
              sales: content.contact_info?.phone?.sales || '',
              support: content.contact_info?.phone?.support || ''
            },
            email: {
              general: content.contact_info?.email?.general || '',
              sales: content.contact_info?.email?.sales || '',
              support: content.contact_info?.email?.support || ''
            },
            address: {
              street: content.contact_info?.address?.street || '',
              city: content.contact_info?.address?.city || '',
              hours: content.contact_info?.address?.hours || ''
            }
          },
          form: {
            title: content.form?.title || '',
            description: content.form?.description || ''
          }
        });
        break;
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      status: page.status,
      page_type: page.page_type || 'custom'
    });

    if (page.page_type === 'system') {
      const pageType = page.slug as 'home' | 'about' | 'contact';
      setActiveForm(pageType);
      loadPageContent(page, pageType);
    }
    
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      let contentData = {};

      if (activeForm === 'home') {
        contentData = homeContent;
      } else if (activeForm === 'about') {
        contentData = aboutContent;
      } else if (activeForm === 'contact') {
        contentData = contactContent;
      }

      const pageData = {
        ...formData,
        content: contentData
      };

      if (editingPage) {
        await updateMutation.mutateAsync({ id: editingPage.id, ...pageData });
      } else {
        await createMutation.mutateAsync(pageData);
      }
      
      setDialogOpen(false);
      setActiveForm(null);
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const getPageIcon = (pageType: string, slug: string) => {
    if (pageType === 'system') {
      switch (slug) {
        case 'home': return <Home className="w-4 h-4" />;
        case 'about': return <Info className="w-4 h-4" />;
        case 'contact': return <Phone className="w-4 h-4" />;
        default: return <Edit className="w-4 h-4" />;
      }
    }
    return <Edit className="w-4 h-4" />;
  };

  const systemPages = pages?.filter(page => page.page_type === 'system') || [];
  const customPages = pages?.filter(page => page.page_type !== 'system') || [];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading pages...</p>
      </div>
    );
  }

  const renderHomeForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Main Title</Label>
            <Input
              id="hero-title"
              value={homeContent.hero.title}
              onChange={(e) => setHomeContent(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
              placeholder="Professional Call Center Solutions"
            />
          </div>
          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={homeContent.hero.subtitle}
              onChange={(e) => setHomeContent(prev => ({
                ...prev,
                hero: { ...prev.hero, subtitle: e.target.value }
              }))}
              placeholder="Excellence in Service"
            />
          </div>
          <div>
            <Label htmlFor="hero-description">Description</Label>
            <Textarea
              id="hero-description"
              value={homeContent.hero.description}
              onChange={(e) => setHomeContent(prev => ({
                ...prev,
                hero: { ...prev.hero, description: e.target.value }
              }))}
              placeholder="Transforming customer service..."
              rows={3}
            />
          </div>
          <ImageUpload
            currentImageUrl={homeContent.hero.background_image}
            onImageSelect={(url) => setHomeContent(prev => ({
              ...prev,
              hero: { ...prev.hero, background_image: url }
            }))}
            folder="hero"
            aspectRatio="aspect-video"
            label="Hero Background Image"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta-text">Button Text</Label>
              <Input
                id="cta-text"
                value={homeContent.hero.cta_text}
                onChange={(e) => setHomeContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, cta_text: e.target.value }
                }))}
                placeholder="Get Started Today"
              />
            </div>
            <div>
              <Label htmlFor="cta-link">Button Link</Label>
              <Input
                id="cta-link"
                value={homeContent.hero.cta_link}
                onChange={(e) => setHomeContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, cta_link: e.target.value }
                }))}
                placeholder="/contact"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Services Section</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="services-title">Services Title</Label>
            <Input
              id="services-title"
              value={homeContent.services.title}
              onChange={(e) => setHomeContent(prev => ({
                ...prev,
                services: { ...prev.services, title: e.target.value }
              }))}
              placeholder="Our Services"
            />
          </div>
          <div>
            <Label htmlFor="services-description">Services Description</Label>
            <Textarea
              id="services-description"
              value={homeContent.services.description}
              onChange={(e) => setHomeContent(prev => ({
                ...prev,
                services: { ...prev.services, description: e.target.value }
              }))}
              placeholder="Comprehensive call center solutions..."
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="about-hero-title">Page Title</Label>
            <Input
              id="about-hero-title"
              value={aboutContent.hero.title}
              onChange={(e) => setAboutContent(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
              placeholder="About CallCenter Pro"
            />
          </div>
          <div>
            <Label htmlFor="about-hero-description">Hero Description</Label>
            <Textarea
              id="about-hero-description"
              value={aboutContent.hero.description}
              onChange={(e) => setAboutContent(prev => ({
                ...prev,
                hero: { ...prev.hero, description: e.target.value }
              }))}
              placeholder="Since 2010, we've been transforming..."
              rows={3}
            />
          </div>
          <ImageUpload
            currentImageUrl={aboutContent.hero.background_image}
            onImageSelect={(url) => setAboutContent(prev => ({
              ...prev,
              hero: { ...prev.hero, background_image: url }
            }))}
            folder="about"
            aspectRatio="aspect-video"
            label="About Hero Background"
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Mission</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mission-title">Mission Title</Label>
            <Input
              id="mission-title"
              value={aboutContent.mission.title}
              onChange={(e) => setAboutContent(prev => ({
                ...prev,
                mission: { ...prev.mission, title: e.target.value }
              }))}
              placeholder="Empowering Financial Success"
            />
          </div>
          <div>
            <Label htmlFor="mission-description">Mission Description</Label>
            <Textarea
              id="mission-description"
              value={aboutContent.mission.description}
              onChange={(e) => setAboutContent(prev => ({
                ...prev,
                mission: { ...prev.mission, description: e.target.value }
              }))}
              placeholder="To empower financial institutions..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Vision</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="vision-title">Vision Title</Label>
            <Input
              id="vision-title"
              value={aboutContent.vision.title}
              onChange={(e) => setAboutContent(prev => ({
                ...prev,
                vision: { ...prev.vision, title: e.target.value }
              }))}
              placeholder="Leading the Future"
            />
          </div>
          <div>
            <Label htmlFor="vision-description">Vision Description</Label>
            <Textarea
              id="vision-description"
              value={aboutContent.vision.description}
              onChange={(e) => setAboutContent(prev => ({
                ...prev,
                vision: { ...prev.vision, description: e.target.value }
              }))}
              placeholder="To be the global leader..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Core Values</h3>
        <div className="space-y-4">
          {aboutContent.values.map((value, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <Label htmlFor={`value-${index}-title`}>Value {index + 1} Title</Label>
              <Input
                id={`value-${index}-title`}
                value={value.title}
                onChange={(e) => {
                  const newValues = [...aboutContent.values];
                  newValues[index].title = e.target.value;
                  setAboutContent(prev => ({ ...prev, values: newValues }));
                }}
                placeholder={`Value ${index + 1} title`}
              />
              <Label htmlFor={`value-${index}-description`}>Description</Label>
              <Textarea
                id={`value-${index}-description`}
                value={value.description}
                onChange={(e) => {
                  const newValues = [...aboutContent.values];
                  newValues[index].description = e.target.value;
                  setAboutContent(prev => ({ ...prev, values: newValues }));
                }}
                placeholder={`Describe this value...`}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contact-hero-title">Page Title</Label>
            <Input
              id="contact-hero-title"
              value={contactContent.hero.title}
              onChange={(e) => setContactContent(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
              placeholder="Contact Us"
            />
          </div>
          <div>
            <Label htmlFor="contact-hero-description">Hero Description</Label>
            <Textarea
              id="contact-hero-description"
              value={contactContent.hero.description}
              onChange={(e) => setContactContent(prev => ({
                ...prev,
                hero: { ...prev.hero, description: e.target.value }
              }))}
              placeholder="Ready to transform your call center operations?"
              rows={3}
            />
          </div>
          <ImageUpload
            currentImageUrl={contactContent.hero.background_image}
            onImageSelect={(url) => setContactContent(prev => ({
              ...prev,
              hero: { ...prev.hero, background_image: url }
            }))}
            folder="contact"
            aspectRatio="aspect-video"
            label="Contact Hero Background"
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Phone Numbers</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="phone-main">Main Line</Label>
                <Input
                  id="phone-main"
                  value={contactContent.contact_info.phone.main}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      phone: { ...prev.contact_info.phone, main: e.target.value }
                    }
                  }))}
                  placeholder="1-800-CALL-PRO"
                />
              </div>
              <div>
                <Label htmlFor="phone-sales">Sales</Label>
                <Input
                  id="phone-sales"
                  value={contactContent.contact_info.phone.sales}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      phone: { ...prev.contact_info.phone, sales: e.target.value }
                    }
                  }))}
                  placeholder="1-800-555-0123"
                />
              </div>
              <div>
                <Label htmlFor="phone-support">Support</Label>
                <Input
                  id="phone-support"
                  value={contactContent.contact_info.phone.support}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      phone: { ...prev.contact_info.phone, support: e.target.value }
                    }
                  }))}
                  placeholder="1-800-555-0124"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Email Addresses</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email-general">General</Label>
                <Input
                  id="email-general"
                  value={contactContent.contact_info.email.general}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      email: { ...prev.contact_info.email, general: e.target.value }
                    }
                  }))}
                  placeholder="info@callcenterpro.com"
                />
              </div>
              <div>
                <Label htmlFor="email-sales">Sales</Label>
                <Input
                  id="email-sales"
                  value={contactContent.contact_info.email.sales}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      email: { ...prev.contact_info.email, sales: e.target.value }
                    }
                  }))}
                  placeholder="sales@callcenterpro.com"
                />
              </div>
              <div>
                <Label htmlFor="email-support">Support</Label>
                <Input
                  id="email-support"
                  value={contactContent.contact_info.email.support}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      email: { ...prev.contact_info.email, support: e.target.value }
                    }
                  }))}
                  placeholder="support@callcenterpro.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="address-street">Street Address</Label>
                <Input
                  id="address-street"
                  value={contactContent.contact_info.address.street}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      address: { ...prev.contact_info.address, street: e.target.value }
                    }
                  }))}
                  placeholder="123 Business Center Drive"
                />
              </div>
              <div>
                <Label htmlFor="address-city">City, State ZIP</Label>
                <Input
                  id="address-city"
                  value={contactContent.contact_info.address.city}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      address: { ...prev.contact_info.address, city: e.target.value }
                    }
                  }))}
                  placeholder="New York, NY 10001"
                />
              </div>
              <div>
                <Label htmlFor="address-hours">Business Hours</Label>
                <Input
                  id="address-hours"
                  value={contactContent.contact_info.address.hours}
                  onChange={(e) => setContactContent(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      address: { ...prev.contact_info.address, hours: e.target.value }
                    }
                  }))}
                  placeholder="Mon-Fri: 8:00 AM - 6:00 PM EST"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Form Section</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={contactContent.form.title}
              onChange={(e) => setContactContent(prev => ({
                ...prev,
                form: { ...prev.form, title: e.target.value }
              }))}
              placeholder="Send Us a Message"
            />
          </div>
          <div>
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              value={contactContent.form.description}
              onChange={(e) => setContactContent(prev => ({
                ...prev,
                form: { ...prev.form, description: e.target.value }
              }))}
              placeholder="Fill out the form below..."
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* System Pages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Editable Pages</span>
              </CardTitle>
              <CardDescription>
                Manage content for Home, About, and Contact pages
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {systemPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
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
                  <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Content
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
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
            <Button onClick={() => {
              setEditingPage(null);
              setActiveForm(null);
              setFormData({
                title: '',
                slug: '',
                meta_title: '',
                meta_description: '',
                status: 'draft',
                page_type: 'custom'
              });
              setDialogOpen(true);
            }} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {customPages.length === 0 ? (
            <div className="text-center py-12">
              <Edit className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No custom pages yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                Create your first custom page to get started
              </p>
              <Button onClick={() => {
                setEditingPage(null);
                setActiveForm(null);
                setFormData({
                  title: '',
                  slug: '',
                  meta_title: '',
                  meta_description: '',
                  status: 'draft',
                  page_type: 'custom'
                });
                setDialogOpen(true);
              }} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Page
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {customPages.map((page) => (
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
                    <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
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

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {activeForm && getPageIcon('system', activeForm)}
              <span>
                {editingPage ? 'Edit' : 'Create'} {activeForm ? activeForm.charAt(0).toUpperCase() + activeForm.slice(1) : ''} Page
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Meta Information */}
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

            {!activeForm && (
              <div>
                <Label htmlFor="page-slug">URL Slug</Label>
                <Input
                  id="page-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-url-slug"
                />
              </div>
            )}

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
            </div>

            {/* Content Forms */}
            {activeForm === 'home' && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">Home Page Content</h2>
                  {renderHomeForm()}
                </div>
              </>
            )}

            {activeForm === 'about' && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">About Page Content</h2>
                  {renderAboutForm()}
                </div>
              </>
            )}

            {activeForm === 'contact' && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Page Content</h2>
                  {renderContactForm()}
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 border-t pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingPage ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    {editingPage ? 'Update' : 'Create'}
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