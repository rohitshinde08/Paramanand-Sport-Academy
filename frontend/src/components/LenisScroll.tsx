import React from 'react';
import Lenis from '@studio-freight/react-lenis';

interface LenisScrollProps {
  children: React.ReactNode;
}

const LenisScroll: React.FC<LenisScrollProps> = ({ children }) => {
  return (
    <Lenis root options={{ lerp: 0.05, duration: 1.5 }}>
      {children}
    </Lenis>
  );
};

export default LenisScroll;
