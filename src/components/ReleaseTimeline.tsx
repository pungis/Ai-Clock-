import { useEffect, useRef } from "react";
import type { ModelRelease } from "../types/release";
import { TimelineItem } from "./TimelineItem";

type ReleaseTimelineProps = {
  releases: ModelRelease[];
};

export function ReleaseTimeline({ releases }: ReleaseTimelineProps) {
  const radioScaleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLOListElement>(null);
  const dragStateRef = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    scrollLeft: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const smoothScrollRef = useRef({
    animationFrameId: 0,
    targetLeft: 0,
    currentLeft: 0,
  });

  useEffect(() => {
    const radioScaleElement = radioScaleRef.current;
    const timeline = timelineRef.current;

    if (!radioScaleElement || !timeline) {
      return;
    }

    const radioScale = radioScaleElement;
    smoothScrollRef.current.targetLeft = timeline.scrollLeft;
    smoothScrollRef.current.currentLeft = timeline.scrollLeft;

    function updateAmbientScale(scrollLeft: number) {
      document.body.style.setProperty(
        "--radio-scroll",
        `${scrollLeft * -0.42}px`,
      );
    }

    function clampScrollLeft(value: number) {
      const timeline = timelineRef.current;

      if (!timeline) {
        return value;
      }

      return Math.max(0, Math.min(value, timeline.scrollWidth - timeline.clientWidth));
    }

    function animateScroll() {
      const timeline = timelineRef.current;
      const smoothScroll = smoothScrollRef.current;

      if (!timeline) {
        smoothScroll.animationFrameId = 0;
        return;
      }

      const distance = smoothScroll.targetLeft - smoothScroll.currentLeft;
      smoothScroll.currentLeft += distance * 0.14;
      timeline.scrollLeft = smoothScroll.currentLeft;
      updateAmbientScale(smoothScroll.currentLeft);

      if (Math.abs(distance) < 0.35) {
        smoothScroll.currentLeft = smoothScroll.targetLeft;
        timeline.scrollLeft = smoothScroll.currentLeft;
        updateAmbientScale(smoothScroll.currentLeft);
        smoothScroll.animationFrameId = 0;
        return;
      }

      smoothScroll.animationFrameId = window.requestAnimationFrame(animateScroll);
    }

    function scrollToTarget(targetLeft: number) {
      const smoothScroll = smoothScrollRef.current;
      smoothScroll.targetLeft = clampScrollLeft(targetLeft);

      if (smoothScroll.animationFrameId === 0) {
        smoothScroll.animationFrameId = window.requestAnimationFrame(animateScroll);
      }
    }

    function handleWheel(event: WheelEvent) {
      const timeline = timelineRef.current;

      if (!timeline) {
        return;
      }

      const scrollAmount =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (scrollAmount === 0) {
        return;
      }

      event.preventDefault();
      scrollToTarget(smoothScrollRef.current.targetLeft + scrollAmount * 1.25);
    }

    function handlePointerDown(event: PointerEvent) {
      const timeline = timelineRef.current;

      if (!timeline) {
        return;
      }

      if (!timeline.contains(event.target as Node)) {
        return;
      }

      dragStateRef.current = {
        isDragging: true,
        hasMoved: false,
        startX: event.clientX,
        scrollLeft: timeline.scrollLeft,
        lastX: event.clientX,
        lastTime: performance.now(),
        velocity: 0,
      };

      const smoothScroll = smoothScrollRef.current;
      if (smoothScroll.animationFrameId !== 0) {
        window.cancelAnimationFrame(smoothScroll.animationFrameId);
        smoothScroll.animationFrameId = 0;
      }
      smoothScroll.targetLeft = timeline.scrollLeft;
      smoothScroll.currentLeft = timeline.scrollLeft;

      document.body.classList.add("is-tuning");
      radioScale.classList.add("radio-scale--dragging");
      timeline.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      const timeline = timelineRef.current;
      const dragState = dragStateRef.current;

      if (!timeline || !dragState.isDragging) {
        return;
      }

      const dragDistance = event.clientX - dragState.startX;
      const now = performance.now();
      const deltaX = event.clientX - dragState.lastX;
      const deltaTime = Math.max(1, now - dragState.lastTime);

      dragState.hasMoved = dragState.hasMoved || Math.abs(dragDistance) > 4;
      dragState.velocity = deltaX / deltaTime;
      dragState.lastX = event.clientX;
      dragState.lastTime = now;

      if (dragState.hasMoved) {
        event.preventDefault();
      }

      const nextScrollLeft = clampScrollLeft(dragState.scrollLeft - dragDistance);
      timeline.scrollLeft = nextScrollLeft;
      updateAmbientScale(nextScrollLeft);
      smoothScrollRef.current.currentLeft = nextScrollLeft;
      smoothScrollRef.current.targetLeft = nextScrollLeft;
    }

    function stopDragging(event: PointerEvent) {
      const timeline = timelineRef.current;
      const dragState = dragStateRef.current;

      dragStateRef.current.isDragging = false;
      document.body.classList.remove("is-tuning");
      radioScale.classList.remove("radio-scale--dragging");
      timeline?.releasePointerCapture(event.pointerId);

      if (timeline && dragState.hasMoved) {
        scrollToTarget(timeline.scrollLeft - dragState.velocity * 620);
      }
    }

    updateAmbientScale(timeline.scrollLeft);

    timeline.addEventListener("wheel", handleWheel, { passive: false });
    timeline.addEventListener("pointerdown", handlePointerDown);
    timeline.addEventListener("pointermove", handlePointerMove);
    timeline.addEventListener("pointerup", stopDragging);
    timeline.addEventListener("pointercancel", stopDragging);

    return () => {
      timeline.removeEventListener("wheel", handleWheel);
      timeline.removeEventListener("pointerdown", handlePointerDown);
      timeline.removeEventListener("pointermove", handlePointerMove);
      timeline.removeEventListener("pointerup", stopDragging);
      timeline.removeEventListener("pointercancel", stopDragging);
      document.body.classList.remove("is-tuning");

      if (smoothScrollRef.current.animationFrameId !== 0) {
        window.cancelAnimationFrame(smoothScrollRef.current.animationFrameId);
      }
    };
  }, []);

  return (
    <section className="release-timeline" aria-labelledby="timeline-title">
      <div className="section-heading">
        <p className="eyebrow">Model archive</p>
        <h2 id="timeline-title">Release Timeline</h2>
      </div>
      <div className="radio-scale" role="presentation" ref={radioScaleRef}>
        <ol className="timeline-list" ref={timelineRef}>
          {releases.map((release) => (
            <TimelineItem key={release.id} release={release} />
          ))}
        </ol>
      </div>
    </section>
  );
}
