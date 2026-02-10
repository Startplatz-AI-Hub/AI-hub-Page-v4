import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { tokens } from '../styles/tokens';

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryMuted});
  z-index: ${tokens.zIndex.toast};
  transition: width 60ms linear;
  will-change: width;
  pointer-events: none;
`;

export default function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <Bar style={{ width: `${width}%` }} aria-hidden="true" />;
}
