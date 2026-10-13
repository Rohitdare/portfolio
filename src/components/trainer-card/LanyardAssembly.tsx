import { forwardRef } from 'react';

const LanyardAssembly = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div id="lanyard-assembly" ref={ref} className="lanyard-assembly badge-entering">
      {/* Crimson Woven Nylon Ribbon */}
      <div className="lanyard-strap">
        <div className="lanyard-texture" />
        <div className="lanyard-seam" />
      </div>
      {/* Heavy Gunmetal Clasp Assembly */}
      <div className="lanyard-clasp">
        <div className="clasp-rivet" />
        <div className="clasp-rivet" />
      </div>
      {/* Swivel Ring */}
      <div className="swivel-ring" />
      {/* Hook Clasp Tongue Entering Card Slot */}
      <div className="hook-tongue">
        <div className="hook-slot-line" />
      </div>
    </div>
  );
});

LanyardAssembly.displayName = 'LanyardAssembly';

export default LanyardAssembly;
