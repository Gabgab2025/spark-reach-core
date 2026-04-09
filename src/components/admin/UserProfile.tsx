/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { teamApi, TeamMember } from '@/lib/api/team';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';
import ImageUpload from '@/components/admin/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User, Mail, Phone, Shield, Calendar, Globe, Linkedin, Github, Twitter,
  Star, Award, Target, TrendingUp, Quote, ExternalLink, Hash, Briefcase,
  Camera, Save, Loader2,
} from 'lucide-react';

const roleLabels: Record<string, string> = {
  ceo: 'Chief Executive Officer',
  cto: 'Chief Technology Officer',
  coo: 'Chief Operating Officer',
  cfo: 'Chief Financial Officer',
  vp_operations: 'VP of Operations',
  director: 'Director',
  manager: 'Manager',
  team_lead: 'Team Lead',
  staff: 'Staff',
};

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState<string | null>(null);
  const [editAvatar, setEditAvatar] = useState<string | null>(null);

  /* Fetch all team members to find the one matching the logged-in user */
  const { data: allMembers, isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ['team-members-profile'],
    queryFn: async () => {
      const { data, error } = await teamApi.list();
      if (error) return [];
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  /* Match by email (case-insensitive) */
  const linkedMember = useMemo(() => {
    if (!user?.email || !allMembers) return null;
    return allMembers.find(
      (m) => m.email?.toLowerCase() === user.email.toLowerCase()
    ) ?? null;
  }, [user, allMembers]);

  const expertise = linkedMember?.expertise ?? [];
  const achievements = linkedMember?.achievements ?? [];
  const displayTitle = linkedMember?.title || roleLabels[linkedMember?.role ?? ''] || linkedMember?.role;

  /* Effective values (use edits if user changed them, otherwise fall back to current) */
  const effectiveName = editName !== null ? editName : (user?.full_name ?? '');
  const effectiveAvatar = editAvatar !== null ? editAvatar : (user?.avatar_url ?? '');
  const hasChanges = editName !== null || editAvatar !== null;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload: any = {};
      if (editName !== null) payload.full_name = editName;
      if (editAvatar !== null) payload.avatar_url = editAvatar;

      const { error } = await api.put('/auth/me', payload);
      if (error) throw error;

      toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
      // Reset edits
      setEditName(null);
      setEditAvatar(null);
      // Refresh session so the auth context picks up updated user
      queryClient.invalidateQueries({ queryKey: ['team-members-profile'] });
      // Force a page reload to refresh session user data
      window.location.reload();
    } catch (err: any) {
      toast({ title: 'Save Failed', description: err?.message || 'Could not update profile.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <User className="w-6 h-6 text-primary" /> My Profile
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Your account details and linked team member profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Account Info Card ─── */}
        <Card className="glass border-slate-200/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Account
            </CardTitle>
            <CardDescription>Your CMS login credentials &amp; role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Profile Picture</Label>
              <ImageUpload
                currentImageUrl={effectiveAvatar || undefined}
                onImageSelect={(url) => setEditAvatar(url)}
                folder="avatars"
                aspectRatio="aspect-square"
                label=""
              />
            </div>

            {/* Editable Name */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Display Name</Label>
              <Input
                value={effectiveName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your full name"
                className="text-center"
              />
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="capitalize bg-primary/10 text-primary">
                {user.role}
              </Badge>
            </div>

            {/* Save button */}
            {hasChanges && (
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            )}

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              {user.updated_at && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Updated {new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ─── Team Profile Card ─── */}
        <div className="lg:col-span-2 space-y-6">
          {teamLoading ? (
            <Card className="glass border-slate-200/50">
              <CardContent className="p-8 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ) : linkedMember ? (
            <>
              {/* Team Profile Header */}
              <Card className="glass border-slate-200/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" /> Team Profile
                      </CardTitle>
                      <CardDescription>Your public team member profile</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        window.open(
                          `/team/${linkedMember.slug || linkedMember.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
                          '_blank'
                        )
                      }
                    >
                      <ExternalLink className="w-4 h-4" /> View Public Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left info block */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">{linkedMember.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</p>
                        <p className="text-base text-slate-700 dark:text-slate-300">{displayTitle || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</p>
                        <p className="text-base text-slate-700 dark:text-slate-300">
                          {roleLabels[linkedMember.role] || linkedMember.role}
                        </p>
                      </div>
                      {linkedMember.tagline && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tagline</p>
                          <p className="text-base text-slate-700 dark:text-slate-300">{linkedMember.tagline}</p>
                        </div>
                      )}
                    </div>

                    {/* Right info block */}
                    <div className="space-y-4">
                      {linkedMember.email && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                          <a href={`mailto:${linkedMember.email}`} className="text-base text-primary hover:underline flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {linkedMember.email}
                          </a>
                        </div>
                      )}
                      {linkedMember.phone && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</p>
                          <a href={`tel:${linkedMember.phone}`} className="text-base text-primary hover:underline flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {linkedMember.phone}
                          </a>
                        </div>
                      )}

                      {/* Badges row */}
                      <div className="flex flex-wrap gap-2">
                        {linkedMember.is_leadership && (
                          <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                            <Star className="w-3 h-3 mr-1 fill-yellow-500" /> Leadership
                          </Badge>
                        )}
                        {typeof linkedMember.sort_order === 'number' && (
                          <Badge variant="outline" className="text-muted-foreground">
                            <Hash className="w-3 h-3 mr-1" /> Position {linkedMember.sort_order}
                          </Badge>
                        )}
                      </div>

                      {/* Social links */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {linkedMember.linkedin_url && (
                          <a href={linkedMember.linkedin_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 text-xs font-medium transition">
                            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                          </a>
                        )}
                        {linkedMember.website_url && (
                          <a href={linkedMember.website_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition">
                            <Globe className="w-3.5 h-3.5" /> Website
                          </a>
                        )}
                        {linkedMember.github_url && (
                          <a href={linkedMember.github_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300 hover:bg-slate-500/20 text-xs font-medium transition">
                            <Github className="w-3.5 h-3.5" /> GitHub
                          </a>
                        )}
                        {linkedMember.twitter_url && (
                          <a href={linkedMember.twitter_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 text-xs font-medium transition">
                            <Twitter className="w-3.5 h-3.5" /> Twitter
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote */}
              {linkedMember.quote && (
                <Card className="glass border-slate-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Quote className="w-8 h-8 text-primary/30 flex-shrink-0 mt-1" />
                      <blockquote className="text-lg font-medium italic text-slate-700 dark:text-slate-300 leading-relaxed">
                        &ldquo;{linkedMember.quote}&rdquo;
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bio */}
              {linkedMember.bio && (
                <Card className="glass border-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" /> Bio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(linkedMember.bio) }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Expertise & Achievements side by side */}
              {(expertise.length > 0 || achievements.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {expertise.length > 0 && (
                    <Card className="glass border-slate-200/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" /> Expertise
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {expertise.map((item, i) => (
                            <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-0">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {achievements.length > 0 && (
                    <Card className="glass border-slate-200/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" /> Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {achievements.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                {i + 1}
                              </div>
                              <p className="text-sm text-muted-foreground">{item}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Cover image preview */}
              {linkedMember.cover_image_url && (
                <Card className="glass border-slate-200/50 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">Cover Image</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <img
                      src={linkedMember.cover_image_url}
                      alt="Profile cover"
                      className="w-full h-48 object-cover"
                    />
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* No linked team member */
            <Card className="glass border-slate-200/50">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  No Team Profile Linked
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Your account email (<span className="font-medium">{user.email}</span>) doesn't match
                  any team member profile. Ask an admin to create a team member entry with
                  your email address to link your profile.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
