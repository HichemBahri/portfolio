"use client";

import React, { useEffect, useRef } from "react";

export function AsciiDonut() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pretag = preRef.current;
    if (!pretag) return;

    const R1 = 1;
    const R2 = 2;
    const K2 = 5;
    const K1 = 150;

    let animationFrameId: number;

    const render = () => {
      const b: (string | number)[] = [];
      const z: number[] = [];

      const A = Date.now() * 0.0005;
      const B = Date.now() * 0.0003;

      const cA = Math.cos(A),
        sA = Math.sin(A),
        cB = Math.cos(B),
        sB = Math.sin(B);

      for (let k = 0; k < 1760; k++) {
        b[k] = k % 80 == 79 ? "\n" : " ";
        z[k] = 0;
      }

      for (let j = 0; j < 6.28; j += 0.07) {
        // j <=> theta
        const ct = Math.cos(j),
          st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          // i <=> phi
          const sp = Math.sin(i),
            cp = Math.cos(i);
          const h = ct + R2;
          const D = 1 / (sp * h * sA + st * cA + K2);
          const t = sp * h * cA - st * sA;

          const x = 0 | (40 + 30 * D * (cp * h * cB - t * sB));
          const y = 0 | (12 + 15 * D * (cp * h * sB + t * cB));
          const o = x + 80 * y;
          const N =
            0 |
            (8 *
              ((st * sA - sp * ct * cA) * cB -
                sp * ct * sA -
                st * cA -
                cp * ct * sB));
          if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]!) {
            z[o] = D;
            b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0] ?? " ";
          }
        }
      }
      pretag.innerHTML = b.join("");
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <pre ref={preRef} className="text-xs leading-tight text-white"></pre>;
}
