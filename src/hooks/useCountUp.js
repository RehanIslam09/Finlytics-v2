/* ============================================
   FILE: src/hooks/useCountUp.js
   ============================================ */

import { useEffect, useState } from 'react';

export default function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const percentage = Math.min(progress / duration, 1);
      const current = Math.floor(percentage * target);

      setValue(current);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}
