import { useEffect, useId, useState, type RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  active?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

interface BeamGeometry {
  pathD: string;
  svgWidth: number;
  svgHeight: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function AnimatedBeam({
  className = '',
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  active = true,
  pathColor = '#1E293B',
  pathWidth = 1.5,
  pathOpacity = 0.75,
  gradientStartColor = '#00A896',
  gradientStopColor = '#FF6B00',
  delay = 0,
  duration = 2.4,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const rawId = useId();
  const gradientId = `pk-beam-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const shouldReduceMotion = useReducedMotion();

  const [geometry, setGeometry] = useState<BeamGeometry>({
    pathD: '',
    svgWidth: 0,
    svgHeight: 0,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  useEffect(() => {
    const updatePath = () => {
      const container = containerRef.current;
      const fromEl = fromRef.current;
      const toEl = toRef.current;
      if (!container || !fromEl || !toEl) return;

      const containerRect = container.getBoundingClientRect();
      const rectA = fromEl.getBoundingClientRect();
      const rectB = toEl.getBoundingClientRect();

      const svgWidth = containerRect.width;
      const svgHeight = containerRect.height;

      const startX =
        rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
      const startY =
        rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
      const endX =
        rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
      const endY =
        rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

      const midX = (startX + endX) / 2;
      const controlY = (startY + endY) / 2 - curvature;
      const pathD = `M ${startX},${startY} Q ${midX},${controlY} ${endX},${endY}`;

      setGeometry({
        pathD,
        svgWidth,
        svgHeight,
        startX,
        startY,
        endX,
        endY,
      });
    };

    const rafId = window.requestAnimationFrame(updatePath);
    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (fromRef.current) {
      resizeObserver.observe(fromRef.current);
    }
    if (toRef.current) {
      resizeObserver.observe(toRef.current);
    }
    window.addEventListener('resize', updatePath);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePath);
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  if (!geometry.pathD || geometry.svgWidth === 0 || geometry.svgHeight === 0) {
    return null;
  }

  const originX = reverse ? geometry.endX : geometry.startX;
  const originY = reverse ? geometry.endY : geometry.startY;
  const targetX = reverse ? geometry.startX : geometry.endX;
  const targetY = reverse ? geometry.startY : geometry.endY;

  const dx = targetX - originX;
  const dy = targetY - originY;

  return (
    <svg
      fill="none"
      width={geometry.svgWidth}
      height={geometry.svgHeight}
      viewBox={`0 0 ${geometry.svgWidth} ${geometry.svgHeight}`}
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 left-0 transform-gpu ${className}`}
    >
      <path
        d={geometry.pathD}
        stroke={active ? gradientStartColor : pathColor}
        strokeWidth={active ? pathWidth + 0.25 : pathWidth}
        strokeOpacity={active ? 0.35 : pathOpacity}
        strokeLinecap="round"
      />

      {active && !shouldReduceMotion && (
        <path
          d={geometry.pathD}
          stroke={`url(#${gradientId})`}
          strokeWidth={pathWidth + 0.75}
          strokeLinecap="round"
        />
      )}

      {active && shouldReduceMotion && (
        <path
          d={geometry.pathD}
          stroke={gradientStartColor}
          strokeWidth={pathWidth + 0.5}
          strokeOpacity={0.9}
          strokeLinecap="round"
        />
      )}

      <defs>
        <motion.linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: originX,
            y1: originY,
            x2: originX - dx * 0.35,
            y2: originY - dy * 0.35,
          }}
          animate={{
            x1: [originX, targetX + dx * 0.35],
            y1: [originY, targetY + dy * 0.35],
            x2: [originX - dx * 0.35, targetX],
            y2: [originY - dy * 0.35, targetY],
          }}
          transition={{
            delay,
            duration,
            repeat: Infinity,
            repeatDelay: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="20%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="65%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
