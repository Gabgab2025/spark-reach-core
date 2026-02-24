import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Github,
  Twitter,
  Award,
  Target,
  TrendingUp,
  Quote,
  ChevronRight,
  Star,
  Hash,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { teamApi } from '@/lib/api/team';
import type { TeamMember } from '@/lib/api/team';
import { Skeleton } from '@/components/ui/skeleton';
import { useDirectMeta } from '@/hooks/usePageMeta';

/** Build initials from a person's name. */
const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Map role slugs to friendly labels. */
const roleLabels: Record<string, string> = {
  ceo: 'Chief Executive Officer',
  cto: 'Chief Technology Officer',
  manager: 'Manager',
  supervisor: 'Supervisor',
  agent: 'Agent',
  admin: 'Administrator',
};

const nameSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ───────────────── Component ───────────────── */

const TeamMemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* Fetch single team member by ID or slug */
  const {
    data: member,
    isLoading,
    isError,
  } = useQuery<TeamMember | null>({
    queryKey: ['team-member', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await teamApi.get(id);
      if (error) {
        console.error('[TeamProfile] fetch error:', error);
        return null;
      }
      return data ?? null;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

  // Dynamic meta from team member data
  useDirectMeta(member ? {
    meta_title: `${member.name} — ${member.title || 'Team Member'} | JDGK Business Solutions`,
    meta_description: member.bio?.slice(0, 160) || `Meet ${member.name}, ${member.title || 'team member'} at JDGK Business Solutions.`,
  } : null);

  /* Fetch all members for sidebar */
  const { data: allMembers } = useQuery({
    queryKey: ['team-members-sidebar'],
    queryFn: async () => {
      const { data, error } = await teamApi.list();
      if (error) return [];
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const otherMembers = allMembers
    ?.filter((m) => m.id !== member?.id)
    .slice(0, 4);

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-20">
              <Skeleton className="h-8 w-32 mb-10 bg-white/10" />
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <Skeleton className="w-48 h-48 rounded-2xl bg-white/10" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-12 w-72 bg-white/10" />
                  <Skeleton className="h-6 w-56 bg-white/10" />
                  <Skeleton className="h-5 w-96 bg-white/10" />
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-28 bg-white/10" />
                    <Skeleton className="h-10 w-28 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  /* ─── Not Found ─── */
  if (isError || !member) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-32 text-center">
            <h1 className="text-5xl font-bold mb-4">Team Member Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/about')} size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* Derived values */
  const displayTitle = member.title || roleLabels[member.role] || member.role;
  const initials = getInitials(member.name);
  const expertise = member.expertise ?? [];
  const achievements = member.achievements ?? [];
  const hasSocials =
    member.email ||
    member.phone ||
    member.linkedin_url ||
    member.website_url ||
    member.github_url ||
    member.twitter_url;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* ──── Hero ──── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {member.cover_image_url && (
            <div className="absolute inset-0">
              <img
                src={member.cover_image_url}
                alt=""
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
            </div>
          )}
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 py-16 lg:py-24">
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Team</span>
            </button>

            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-12">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    className="w-44 h-44 lg:w-52 lg:h-52 rounded-2xl object-cover ring-4 ring-white/10 shadow-2xl"
                  />
                ) : (
                  <div className="w-44 h-44 lg:w-52 lg:h-52 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-5xl font-bold ring-4 ring-white/10 shadow-2xl">
                    {initials}
                  </div>
                )}
              </div>

              {/* Name / Title / Socials */}
              <div className="flex-1 text-center lg:text-left pb-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3">
                  {member.name}
                </h1>
                <p className="text-xl md:text-2xl font-semibold text-primary mb-2">
                  {displayTitle}
                </p>

                {/* Role & Leadership badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                  {member.role && member.role !== member.title && (
                    <Badge variant="secondary" className="bg-white/10 text-white/80 border-0 text-xs px-3 py-1">
                      {roleLabels[member.role] || member.role}
                    </Badge>
                  )}
                  {member.is_leadership && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-0 text-xs px-3 py-1">
                      <Star className="w-3 h-3 mr-1 fill-yellow-300" /> Leadership Team
                    </Badge>
                  )}
                  {typeof member.sort_order === 'number' && (
                    <Badge variant="secondary" className="bg-white/10 text-white/60 border-0 text-xs px-3 py-1">
                      <Hash className="w-3 h-3 mr-1" /> Team Position {member.sort_order}
                    </Badge>
                  )}
                </div>

                {member.tagline && (
                  <p className="text-lg text-white/70 mb-5 max-w-xl">
                    {member.tagline}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-primary hover:text-white transition text-sm"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-primary hover:text-white transition text-sm"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-[#0A66C2] hover:text-white transition text-sm"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {member.website_url && (
                    <a
                      href={member.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-primary hover:text-white transition text-sm"
                    >
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-[#333] hover:text-white transition text-sm"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {member.twitter_url && (
                    <a
                      href={member.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-[#1DA1F2] hover:text-white transition text-sm"
                    >
                      <Twitter className="w-4 h-4" /> Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──── Content Grid ──── */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-10">
                {/* Quote */}
                {member.quote && (
                  <div className="relative rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-8">
                    <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                    <blockquote className="text-xl md:text-2xl font-semibold text-foreground italic leading-relaxed pl-6">
                      &ldquo;{member.quote}&rdquo;
                    </blockquote>
                  </div>
                )}

                {/* Bio */}
                {member.bio && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                      <Award className="w-6 h-6 text-primary" />
                      About
                    </h2>
                    <div
                      className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: member.bio }}
                    />
                  </div>
                )}

                {/* Expertise */}
                {expertise.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-5 flex items-center gap-3">
                      <Target className="w-6 h-6 text-primary" />
                      Areas of Expertise
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {expertise.map((item, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 border-0"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {achievements.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-5 flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      Key Achievements
                    </h2>
                    <div className="space-y-4">
                      {achievements.map((item, i) => (
                        <div key={i} className="flex items-start gap-4 group">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition">
                            {i + 1}
                          </div>
                          <p className="text-muted-foreground text-base pt-1">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Contact Card */}
                {hasSocials && (
                  <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
                    <h3 className="font-semibold text-lg">Contact Info</h3>
                    <Separator />
                    <div className="space-y-3 text-sm">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition">
                          <Linkedin className="w-4 h-4" />
                          <span>LinkedIn Profile</span>
                        </a>
                      )}
                      {member.website_url && (
                        <a href={member.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition">
                          <Globe className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                      {member.github_url && (
                        <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition">
                          <Github className="w-4 h-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {member.twitter_url && (
                        <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition">
                          <Twitter className="w-4 h-4" />
                          <span>Twitter</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Other Team Members */}
                {otherMembers && otherMembers.length > 0 && (
                  <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
                    <h3 className="font-semibold text-lg">Other Team Members</h3>
                    <Separator />
                    <div className="space-y-3">
                      {otherMembers.map((m) => (
                        <Link
                          key={m.id}
                          to={`/team/${m.slug || nameSlug(m.name)}`}
                          className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition group"
                        >
                          {m.avatar_url ? (
                            <img
                              src={m.avatar_url}
                              alt={m.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                              {getInitials(m.name)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition">
                              {m.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {m.title || roleLabels[m.role] || m.role}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                        </Link>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => navigate('/about')}
                    >
                      View Full Team
                    </Button>
                  </div>
                )}

                {/* Quick CTA */}
                <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-white space-y-4">
                  <h3 className="font-bold text-lg">Work With Us</h3>
                  <p className="text-sm text-white/80">
                    Get in touch to discover how our team can help drive your business success.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Us
                  </Button>
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

export default TeamMemberProfile;
