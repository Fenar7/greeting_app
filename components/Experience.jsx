'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Heart, MoveUpRight, Sparkles } from 'lucide-react';
import { birthday } from '@/lib/content';
import FloralArt from './FloralArt';

const CelestialCanvas = dynamic(() => import('./CelestialCanvas'), { ssr: false });
const BloomFlower = dynamic(() => import('./BloomFlower'), { ssr: false });

const sections = [
  { id: 'invitation', label: 'The invitation' },
  { id: 'universe', label: 'Your universe' },
  { id: 'beginning', label: 'The beginning' },
  { id: 'little-things', label: 'Little things' },
  { id: 'memories', label: 'Memories' },
  { id: 'letter', label: 'A letter' },
  { id: 'surprise', label: 'Your surprise' },
];

function SectionLabel({ index, children, light = false }) {
  return (
    <div className={`section-label ${light ? 'section-label--light' : ''}`}>
      <span className="section-label__number">{String(index).padStart(2, '0')}</span>
      <span className="section-label__line" />
      <span>{children}</span>
    </div>
  );
}

function TinyFlower({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse key={angle} cx="24" cy="14" rx="6.5" ry="12" transform={`rotate(${angle} 24 24)`} fill="currentColor" opacity=".78" />
      ))}
      <circle cx="24" cy="24" r="5" fill="#EAD3AA" />
    </svg>
  );
}

function MemoryIllustration({ theme }) {
  return (
    <div className={`memory-art memory-art--${theme}`} aria-hidden="true">
      <div className="memory-art__moon" />
      <div className="memory-art__glow" />
      <FloralArt variant={theme} />
      <span className="memory-art__orbit memory-art__orbit--one" />
      <span className="memory-art__orbit memory-art__orbit--two" />
    </div>
  );
}

export default function Experience() {
  const rootRef = useRef(null);
  const finaleRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [webGL, setWebGL] = useState(false);
  const [finaleVisible, setFinaleVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);
    const updateMotion = (event) => setReduceMotion(event.matches);
    media.addEventListener('change', updateMotion);
    let enabled = false;
    try {
      const canvas = document.createElement('canvas');
      enabled = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch (error) {
      enabled = false;
    }
    setWebGL(enabled);
    return () => media.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    const target = finaleRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setFinaleVisible(true);
    }, { rootMargin: '750px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
      ]);
      if (disposed || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      let lenis;
      let rafId;
      if (!reduceMotion) {
        lenis = new Lenis({ duration: 1.25, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.1 });
        lenis.on('scroll', ScrollTrigger.update);
        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      }

      const context = gsap.context(() => {
        sections.forEach(({ id }, index) => {
          ScrollTrigger.create({
            trigger: `#${id}`,
            start: 'top 52%',
            end: 'bottom 52%',
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          });
        });
        if (!reduceMotion) {
          gsap.utils.toArray('[data-reveal]').forEach((node) => {
            gsap.fromTo(node,
              { opacity: 0, y: 42, filter: 'blur(9px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power3.out',
                scrollTrigger: { trigger: node, start: 'top 85%', toggleActions: 'play none none none' } }
            );
          });
          gsap.to('.universe__halo', {
            scale: 1.35, rotation: 38, opacity: 0.2, ease: 'none',
            scrollTrigger: { trigger: '#universe', start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.hero__bloom', {
            y: -95, rotate: 9, opacity: 0.72, ease: 'none',
            scrollTrigger: { trigger: '#invitation', start: 'top top', end: 'bottom top', scrub: true },
          });
          const media = gsap.matchMedia();
          media.add('(min-width: 800px) and (prefers-reduced-motion: no-preference)', () => {
            const storyLines = gsap.utils.toArray('.story__line');
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: '.story__stage', start: 'top top', end: '+=2500', pin: true, scrub: 0.8, anticipatePin: 1 },
            });
            storyLines.forEach((line, index) => {
              timeline.fromTo(line, { opacity: index === 0 ? 0.25 : 0, y: 65, filter: 'blur(8px)' },
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
              timeline.to(line, { opacity: 0, y: -55, filter: 'blur(7px)', duration: 0.7, delay: 0.45 });
            });
          });
          cleanup = () => media.revert();
        }
      }, rootRef);
      ScrollTrigger.refresh();
      const mediaCleanup = cleanup;
      cleanup = () => {
        mediaCleanup();
        context.revert();
        if (rafId) cancelAnimationFrame(rafId);
        lenis?.destroy();
      };
    })();
    return () => { disposed = true; cleanup(); };
  }, [reduceMotion]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [reduceMotion]);

  const beginExperience = () => {
    setStarted(true);
    scrollTo('universe');
  };


  return (
    <main ref={rootRef} className="experience">
      <div className="film-grain" aria-hidden="true" />
      <div className="site-rail" aria-hidden="true"><span>AN EXPERIENCE MADE WITH LOVE</span><span>22 / 11 / 2026</span></div>
      <header className="site-header">
        <a className="site-brand" href="#invitation" aria-label="Back to beginning" onClick={(event) => { event.preventDefault(); scrollTo('invitation'); }}>
          <TinyFlower className="site-brand__icon" /><span>for shahanas<span className="site-brand__period">.</span></span>
        </a>
        <span className="site-header__edition">A LITTLE UNIVERSE FOR YOU <span className="site-header__star">✦</span> 2026</span>
        <a className="site-header__end" href="#surprise" onClick={(event) => { event.preventDefault(); scrollTo('surprise'); }}>THE SURPRISE <ArrowUpRight size={14} /></a>
      </header>

      <aside className="chapter-nav" aria-label="Story chapters">
        <span className="chapter-nav__label">CHAPTERS</span>
        {sections.map(({ id, label }, index) => (
          <button key={id} type="button" aria-label={`Go to ${label}`} aria-current={active === index ? 'step' : undefined}
            className={`chapter-nav__point ${active === index ? 'is-active' : ''}`} onClick={() => scrollTo(id)}>
            <span className="chapter-nav__bullet" /><span className="chapter-nav__tooltip">{label}</span>
          </button>
        ))}
        <span className="chapter-nav__label">07 / 07</span>
      </aside>

      <section id="invitation" className="section hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__lines" aria-hidden="true" />
        <div className="hero__bloom" aria-hidden="true"><FloralArt variant="rose" /></div>
        <div className="hero__content">
          <span className="overline"><span className="overline__sparkle">✧</span> {birthday.opening.eyebrow}</span>
          <h1 className="hero__title"><span>Some people</span><em>make the world</em><span>feel like home.</span></h1>
          <div className="hero__bottom">
            <p>{birthday.opening.subheading}</p>
            <button className="round-action" type="button" onClick={beginExperience} aria-label="Open your birthday surprise">
              <span>{started ? 'CONTINUE THE JOURNEY' : 'OPEN YOUR SURPRISE'}</span><ArrowDownRight size={24} strokeWidth={1.2} />
            </button>
          </div>
        </div>
        <div className="hero__footer"><span>EST. WITH LOVE, ALWAYS</span><span>SCROLL TO EXPLORE <ArrowDown size={12} /></span></div>
      </section>

      <section id="universe" className="section universe">
        <div className="universe__canvas" aria-hidden="true">{webGL && !reduceMotion ? <CelestialCanvas /> : <div className="cosmos-fallback" />}</div>
        <div className="universe__halo" aria-hidden="true" />
        <div className="universe__frame universe__frame--tl" aria-hidden="true" />
        <div className="universe__frame universe__frame--br" aria-hidden="true" />
        <SectionLabel index={1}>THE CENTER OF MY UNIVERSE</SectionLabel>
        <div className="universe__content">
          <p className="universe__eyebrow" data-reveal>TO THE WOMAN WHO MEANS THE WORLD</p>
          <h2 className="universe__name" data-reveal>{birthday.name}<span>.</span></h2>
          <div className="universe__divider" data-reveal><span /><TinyFlower /><span /></div>
          <p className="universe__message" data-reveal>A name that has always meant <em>home</em> to me.</p>
          <p className="universe__birthday" data-reveal>HAPPY BIRTHDAY, {birthday.relationship.toUpperCase()} ♡</p>
        </div>
        <div className="section-bottom-note">A STORY TOLD IN SEVEN LITTLE CHAPTERS <ArrowDown size={12} /></div>
      </section>

      <section id="beginning" className="section story">
        <SectionLabel index={2} light>BEFORE EVERYTHING</SectionLabel>
        <div className="story__stage">
          <div className="story__sun" aria-hidden="true" />
          <div className="story__ornament" aria-hidden="true">✦</div>
          <div className="story__lines">
            {birthday.beginning.map(({ top, emphasis }, index) => (
              <div className="story__line" key={index}>
                <p>{top}</p><h2>{emphasis}</h2>
              </div>
            ))}
          </div>
          <div className="story__foot"><span>01 — 04</span><span>THE VERY BEGINNING OF MY STORY</span></div>
        </div>
      </section>

      <section id="little-things" className="section things">
        <div className="things__header">
          <SectionLabel index={3} light>THE LITTLE THINGS</SectionLabel>
          <p className="small-serif" data-reveal>It's always been the little things.</p>
          <h2 className="display-title" data-reveal>Love is in the <em>details.</em></h2>
          <p className="things__intro" data-reveal>The quiet moments. The unnoticed sacrifices. The things that make you, you.</p>
        </div>
        <div className="things__cards">
          {birthday.things.map((thing, index) => (
            <article key={thing.number} className={`thing-card thing-card--${thing.kind}`} data-reveal>
              <div className="thing-card__top"><span>THE LITTLE THINGS / {thing.number}</span><span>✳</span></div>
              <div className="thing-card__art" aria-hidden="true">
                {thing.kind === 'heart' ? <Heart size={130} strokeWidth={0.6} /> : thing.kind === 'sun' ? <span className="sunburst">✺</span> : <TinyFlower className="thing-card__flower" />}
              </div>
              <div className="thing-card__text"><span className="thing-card__count">0{index + 1} / 03</span><h3>{thing.title}</h3><p>{thing.detail}</p></div>
            </article>
          ))}
        </div>
        <p className="things__after" data-reveal>I may not say it enough, <em>but I notice more than you know.</em></p>
      </section>

      <section id="memories" className="section memories">
        <SectionLabel index={4} light>A GARDEN OF MEMORIES</SectionLabel>
        <div className="memories__intro" data-reveal>
          <span className="small-serif">The moments worth keeping</span>
          <h2 className="display-title">Some things are <em>felt,</em><br />not photographed.</h2>
          <p>Not every beautiful memory lives in a picture. Some live quietly in the heart, and they all lead back to you.</p>
        </div>
        <div className="memories__gallery">
          {birthday.memories.map((memory, index) => (
            <article className={`memory-card memory-card--${index}`} key={memory.number} data-reveal>
              <div className="memory-card__art"><MemoryIllustration theme={memory.theme} /><span className="memory-card__number">MEMORY / {memory.number}</span></div>
              <div className="memory-card__body"><span>✦</span><h3>{memory.title}</h3><p>{memory.detail}</p></div>
            </article>
          ))}
        </div>
        <p className="memories__endnote" data-reveal>My favorite memories will always have something to do with you. ♡</p>
      </section>

      <section id="letter" className="section letter">
        <SectionLabel index={5} light>WORDS FROM THE HEART</SectionLabel>
        <div className="letter__intro" data-reveal><span className="small-serif">Some things deserve to be said</span><h2 className="display-title">Dear <em>Umma,</em></h2></div>
        <div className="letter__paper" data-reveal>
          <span className="letter__corner letter__corner--one" aria-hidden="true">✧</span>
          <span className="letter__corner letter__corner--two" aria-hidden="true">✧</span>
          <div className="letter__header"><TinyFlower /><span>22 NOVEMBER 2026</span></div>
          <p className="letter__salutation">To the most special woman in my life,</p>
          <h3>My dearest Umma,</h3>
          {birthday.letter.map((paragraph, index) => <p key={index} className={index === 3 ? 'letter__emphasis' : ''}>{paragraph}</p>)}
          <div className="letter__signature"><span>Forever your son,</span><strong>With all my heart <span>♡</span></strong></div>
        </div>
        <p className="letter__postscript" data-reveal>Some letters are written on paper. This one is written with all my love.</p>
      </section>

      <section id="surprise" className={`section surprise ${opened ? 'surprise--opened' : ''}`} ref={finaleRef}>
        <div className="surprise__stars" aria-hidden="true" />
        <SectionLabel index={6}>ONE LAST LITTLE SURPRISE</SectionLabel>
        <div className="surprise__content">
          <p className="surprise__intro" data-reveal>{birthday.finale.first}<br /><em>{birthday.finale.second}</em></p>
          <div className="surprise__flower" aria-label="A rose that blooms for Shahanas">
            {finaleVisible && webGL && !reduceMotion ? <BloomFlower opened={opened} /> : <div className={`flower-fallback ${opened ? 'is-open' : ''}`}><FloralArt variant="rose" /></div>}
            <div className="surprise__flower-glow" aria-hidden="true" />
          </div>
          {!opened ? (
            <button type="button" className="surprise__button" onClick={() => setOpened(true)}>
              <span>A LITTLE GIFT FOR YOU</span><Sparkles size={18} strokeWidth={1.3} />
            </button>
          ) : (
            <div className="surprise__reveal" role="status" aria-live="polite">
              <span className="surprise__date">{birthday.date}</span>
              <h2>Happy Birthday,<br /><em>{birthday.relationship}.</em></h2>
              <p>{birthday.finale.wish}</p>
              <p className="surprise__closing">{birthday.finale.closing}</p>
              <span className="surprise__love">I LOVE YOU, ALWAYS ♡</span>
            </div>
          )}
          {opened && <div className="surprise__confetti" aria-hidden="true">{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ '--i': i, '--x': `${((i * 37) % 101) - 50}vw`, '--d': `${(i * 7) % 20 / 10}s` }} />)}</div>}
        </div>
        <footer className="surprise__footer">
          <span>MADE WITH ALL MY HEART</span><TinyFlower /><button type="button" onClick={() => scrollTo('invitation')}>REPLAY OUR LITTLE STORY <MoveUpRight size={14} /></button>
        </footer>
      </section>
    </main>
  );
}
