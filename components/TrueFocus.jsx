'use client';

// From React Bits (TrueFocus, JS + CSS). Adapted: span wrappers instead of divs so it is valid inside <h2>,
// CSS transitions instead of the motion library, and no cycling or blur when the visitor prefers reduced motion.
import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import './TrueFocus.css';

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const FRAME_GAP = 10;
const SMOOTH_CSS = 'cubic-bezier(0.65, 0, 0.35, 1)';
const SPRING_CSS = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const REDUCE_MOTION = '(prefers-reduced-motion: reduce)';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const subscribeReduceMotion = onChange => {
  const query = window.matchMedia(REDUCE_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduceMotion, () => window.matchMedia(REDUCE_MOTION).matches, () => false);

const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  focusStyle = 'brackets',
  order = 'sequential',
  easing = 'smooth',
  blurAmount = 5,
  focusScale = 1,
  borderColor = 'green',
  highlightColor = undefined, // explicit default so TypeScript treats the prop as optional
  glowColor = 'transparent',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  cornerSize = 16,
  borderWidth = 3,
  unfocusedOpacity = 1
}) => {
  const words = sentence.split(separator).filter(word => word.trim() !== '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusRect, setFocusRect] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : animationDuration;
  const blur = reduceMotion ? 0 : blurAmount;
  const activeIndex = words.length ? currentIndex % words.length : -1;
  const ease = easing === 'spring' && !reduceMotion ? SPRING_CSS : SMOOTH_CSS;

  // Puts a frame piece on its box; the CSS transition does the sliding between words.
  const place = ({ x, y, width, height }) => ({
    transform: `translate(${x}px, ${y}px)`,
    width,
    height,
    transition: `transform ${duration}s ${ease}, width ${duration}s ${ease}, height ${duration}s ${ease}`
  });

  useEffect(() => {
    if (manualMode || reduceMotion || words.length < 2) return;
    const interval = setInterval(
      () => {
        const roll = Math.random();
        setCurrentIndex(prev => {
          const current = prev % words.length;
          if (order !== 'random') return (current + 1) % words.length;
          const next = Math.floor(roll * (words.length - 1));
          return next >= current ? next + 1 : next;
        });
      },
      (animationDuration + pauseBetweenAnimations) * 1000
    );
    return () => clearInterval(interval);
  }, [manualMode, reduceMotion, animationDuration, pauseBetweenAnimations, words.length, order]);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const word = wordRefs.current[activeIndex];
    if (!container || !word) return;

    const measure = () => {
      const next = { x: word.offsetLeft, y: word.offsetTop, width: word.offsetWidth, height: word.offsetHeight };
      setFocusRect(prev =>
        prev && prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height
          ? prev
          : next
      );
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    wordRefs.current.forEach(node => node && observer.observe(node));
    return () => observer.disconnect();
  }, [activeIndex, sentence, separator]);

  const frame = focusRect && {
    x: focusRect.x - (focusRect.width * (focusScale - 1)) / 2,
    y: focusRect.y - (focusRect.height * (focusScale - 1)) / 2,
    width: focusRect.width * focusScale,
    height: focusRect.height * focusScale
  };

  const corners = frame && {
    'top-left': { x: frame.x - FRAME_GAP, y: frame.y - FRAME_GAP },
    'top-right': { x: frame.x + frame.width + FRAME_GAP - cornerSize, y: frame.y - FRAME_GAP },
    'bottom-left': { x: frame.x - FRAME_GAP, y: frame.y + frame.height + FRAME_GAP - cornerSize },
    'bottom-right': {
      x: frame.x + frame.width + FRAME_GAP - cornerSize,
      y: frame.y + frame.height + FRAME_GAP - cornerSize
    }
  };

  const shapes = frame && {
    box: {
      x: frame.x - FRAME_GAP,
      y: frame.y - FRAME_GAP,
      width: frame.width + FRAME_GAP * 2,
      height: frame.height + FRAME_GAP * 2
    },
    underline: {
      x: frame.x,
      y: frame.y + frame.height + FRAME_GAP * 0.4,
      width: frame.width,
      height: borderWidth
    },
    highlight: {
      x: frame.x - frame.height * 0.14,
      y: frame.y + frame.height * 0.04,
      width: frame.width + frame.height * 0.28,
      height: frame.height * 0.92
    }
  };

  const frameStyle = {
    '--border-color': borderColor,
    '--highlight-color': `color-mix(in srgb, ${highlightColor ?? borderColor} 30%, transparent)`,
    '--glow-color': glowColor,
    '--corner-size': `${cornerSize}px`,
    '--border-width': `${borderWidth}px`
  };

  return (
    <span className="focus-container" ref={containerRef} style={frameStyle}>
      {focusStyle === 'highlight' && shapes && (
        <span className="focus-highlight" aria-hidden="true" style={place(shapes.highlight)} />
      )}

      {words.map((word, index) => {
        const isActive = index === activeIndex;
        // The space keeps words apart in the HTML for crawlers that do not run CSS; flexbox does not render it.
        return (
          <Fragment key={index}>
          {index > 0 && ' '}
          <span
            ref={el => {
              wordRefs.current[index] = el;
            }}
            className={`focus-word ${isActive && !manualMode ? 'active' : ''}`}
            style={{
              filter: `blur(${isActive ? 0 : blur}px)`,
              opacity: isActive ? 1 : unfocusedOpacity,
              transform: focusScale !== 1 ? `scale(${isActive ? focusScale : 1})` : undefined,
              transition: `filter ${duration}s ease, opacity ${duration}s ease, transform ${duration}s ${ease}`
            }}
            onMouseEnter={() => {
              if (manualMode) setCurrentIndex(index);
            }}
          >
            {word}
          </span>
          </Fragment>
        );
      })}

      {shapes && corners && focusStyle !== 'highlight' && (
        <span className="focus-frame" aria-hidden="true">
          {focusStyle === 'box' && <span className="focus-box" style={place(shapes.box)} />}
          {focusStyle === 'underline' && <span className="focus-underline" style={place(shapes.underline)} />}
          {focusStyle !== 'box' &&
            focusStyle !== 'underline' &&
            CORNERS.map(corner => <span key={corner} className={`corner ${corner}`} style={place(corners[corner])} />)}
        </span>
      )}
    </span>
  );
};

export default TrueFocus;
