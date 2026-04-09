/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import DOMPurify from 'dompurify';
import { useBlocksByPage, ContentBlock } from '@/hooks/useContentBlocks';

/* ------------------------------------------------------------------ */
/*  Public-side renderer for CMS content blocks assigned to a page.   */
/*  Usage: <BlockRenderer pageSlug="gallery" />                       */
/*  Falls back to nothing if no blocks are assigned to that page.     */
/* ------------------------------------------------------------------ */

// ── Individual block renderers ──────────────────────────────────────

const HeroBlock = ({ content }: { content: Record<string, any> }) => (
  <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center">
        {content.badge && (
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <span className="text-primary text-sm font-medium">{content.badge}</span>
          </div>
        )}
        {content.title && (
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            {content.title}
            {content.subtitle && (
              <span className="block text-gradient">{content.subtitle}</span>
            )}
          </h1>
        )}
        {content.description && (
          <p className="text-lg text-muted-foreground">{content.description}</p>
        )}
      </div>
    </div>
  </section>
);

const TextBlock = ({ content }: { content: Record<string, any> }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">{content.title}</h2>
        )}
        {content.body && (
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.body) }}
          />
        )}
      </div>
    </div>
  </section>
);

const GalleryBlock = ({ content }: { content: Record<string, any> }) => {
  const images = content.images as { src: string; alt: string; category?: string }[] | undefined;
  if (!images?.length) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index < 6 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaBlock = ({ content }: { content: Record<string, any> }) => (
  <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
    <div className="container mx-auto px-4 text-center">
      {content.title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{content.title}</h2>
      )}
      {content.description && (
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{content.description}</p>
      )}
      {content.button_text && content.button_link && (
        <a
          href={content.button_link}
          className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          {content.button_text}
        </a>
      )}
    </div>
  </section>
);

const StatsBlock = ({ content }: { content: Record<string, any> }) => {
  const stats = content.stats as { label: string; value: string }[] | undefined;
  if (!stats?.length) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">{content.title}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CardsBlock = ({ content }: { content: Record<string, any> }) => {
  const cards = content.cards as { title: string; icon?: string; description: string }[] | undefined;
  if (!cards?.length) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">{content.title}</h2>
        )}
        {content.subtitle && (
          <p className="text-muted-foreground text-center mb-8">{content.subtitle}</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              {card.icon && <div className="text-3xl mb-4">{card.icon}</div>}
              <h3 className="text-xl font-bold mb-2 text-foreground">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqBlock = ({ content }: { content: Record<string, any> }) => {
  const items = content.items as { question: string; answer: string }[] | undefined;
  if (!items?.length) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {content.title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">{content.title}</h2>
        )}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <details key={index} className="bg-card border border-border rounded-lg group">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:text-primary transition-colors">
                {item.question}
              </summary>
              <div className="px-6 pb-4 text-muted-foreground leading-relaxed">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineBlock = ({ content }: { content: Record<string, any> }) => {
  const entries = content.entries as { year: string; event: string; desc: string }[] | undefined;
  if (!entries?.length) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {entries.map((entry, index) => (
            <div key={index} className="flex gap-6 md:gap-8 group">
              <div className="flex flex-col items-center flex-shrink-0">
                <span className="text-3xl font-bold text-primary">{entry.year}</span>
              </div>
              <div className="relative flex-shrink-0 pt-2">
                <div className="w-4 h-4 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                {index < entries.length - 1 && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary/20" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{entry.event}</h3>
                  <p className="text-muted-foreground leading-relaxed">{entry.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsBlock = ({ content }: { content: Record<string, any> }) => {
  const items = content.items as { name: string; title: string; content: string }[] | undefined;
  if (!items?.length) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-6">
              <p className="text-foreground/80 italic mb-4 leading-relaxed">"{item.content}"</p>
              <div>
                <p className="font-bold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamBlock = ({ content }: { content: Record<string, any> }) => {
  const members = content.members as { name: string; role: string; bio: string; avatar?: string }[] | undefined;
  if (!members?.length) return null;

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {members.map((member, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{getInitials(member.name)}</span>
                  </div>
                )}
              </div>
              <h3 className="text-base font-bold mb-1 text-foreground">{member.name}</h3>
              <p className="text-primary font-semibold text-xs mb-3">{member.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Block type → renderer map ───────────────────────────────────────

const BLOCK_RENDERERS: Record<string, React.FC<{ content: Record<string, any> }>> = {
  hero: HeroBlock,
  text: TextBlock,
  gallery: GalleryBlock,
  cta: CtaBlock,
  stats: StatsBlock,
  cards: CardsBlock,
  faq: FaqBlock,
  timeline: TimelineBlock,
  testimonials: TestimonialsBlock,
  team: TeamBlock,
};

// ── Single block renderer ───────────────────────────────────────────

const RenderBlock = ({ block }: { block: ContentBlock }) => {
  const Renderer = BLOCK_RENDERERS[block.block_type];
  if (!Renderer || !block.content) return null;
  return <Renderer content={block.content} />;
};

// ── Main component ──────────────────────────────────────────────────

interface BlockRendererProps {
  /** Page slug to fetch content blocks for (e.g. 'gallery', 'home'). */
  pageSlug: string;
  /** Optional: only render blocks of specific types. */
  filterTypes?: string[];
  /** Optional: only render a specific named block. */
  blockName?: string;
}

/**
 * Renders published content blocks assigned to a given page.
 * - If `blockName` is provided, only that specific block is rendered.
 * - If `filterTypes` is provided, only blocks matching those types are rendered.
 * - If no blocks are found, nothing is rendered (no fallback UI).
 */
const BlockRenderer: React.FC<BlockRendererProps> = ({ pageSlug, filterTypes, blockName }) => {
  const { blocks, isLoading } = useBlocksByPage(pageSlug);

  if (isLoading || !blocks?.length) return null;

  let filtered = blocks;

  if (blockName) {
    filtered = filtered.filter(b => b.name === blockName);
  }

  if (filterTypes?.length) {
    filtered = filtered.filter(b => filterTypes.includes(b.block_type));
  }

  if (!filtered.length) return null;

  return (
    <>
      {filtered.map(block => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </>
  );
};

export default BlockRenderer;
export { RenderBlock, BLOCK_RENDERERS };
