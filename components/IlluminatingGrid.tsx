"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const GRID_SIZE = 25; // Number of circles in one dimension (e.g., 25x25 grid)
const CIRCLE_RADIUS = 5; // Radius of each circle in pixels
const ILLUMINATION_DISTANCE = 150; // Max distance for illumination effect

export default function IlluminatingGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Type this as an array of potentially null elements
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  const circlePositions = useRef<{ x: number; y: number }[]>([]);

  const updateCircleStyles = useCallback(() => {
    if (!containerRef.current) return;

    circleRefs.current.forEach((circleRef, index) => {
      if (circleRef) { // Check if the ref exists
        let circleX = circlePositions.current[index]?.x;
        let circleY = circlePositions.current[index]?.y;

        if (circleX === undefined || circleY === undefined) {
          const rect = circleRef.getBoundingClientRect();
          circleX = rect.left + rect.width / 2;
          circleY = rect.top + rect.height / 2;
          circlePositions.current[index] = { x: circleX, y: circleY };
        }

        const distance = Math.sqrt(
          Math.pow(mousePosition.x - circleX, 2) +
          Math.pow(mousePosition.y - circleY, 2)
        );

        if (distance < ILLUMINATION_DISTANCE) {
          const intensity = 1 - distance / ILLUMINATION_DISTANCE;
          const brightness = Math.min(intensity * 0.7, 0.7);
          circleRef.style.backgroundColor = `rgba(255, 255, 255, ${brightness})`;
        } else {
          circleRef.style.backgroundColor = 'rgba(0,0,0,0)';
        }
      }
    });
  }, [mousePosition]);

  useEffect(() => {
    updateCircleStyles();
  }, [mousePosition, updateCircleStyles]);

  useEffect(() => {
    const handleResize = () => {
      circlePositions.current = [];
      updateCircleStyles();
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCircleStyles]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: -1000, y: -1000 });
  }, []);

  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      circles.push(
        <div
          key={i}
          // THE FIX IS HERE: Use curly braces {} for the ref callback
          ref={(el) => {
            circleRefs.current[i] = el;
          }}
          className="w-1 h-1 rounded-full bg-transparent transition-colors duration-200 ease-out"
          style={{ width: `${CIRCLE_RADIUS * 2}px`, height: `${CIRCLE_RADIUS * 2}px` }}
        />
      );
    }
    return circles;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-black z-[-1] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        gap: '0px'
      }}
    >
      {renderCircles()}
    </div>
  );
}