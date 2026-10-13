'use client';

import { useState } from 'react';

export default function KatanaArtwork() {
  const [imgSrc, setImgSrc] = useState('/assets/katana.gif');

  return (
    <div className="gif-artwork-layer" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt="Katana Manga Artwork"
        className="gif-artwork-img"
        onError={() => setImgSrc('/assets/katana-manga.png')}
      />
    </div>
  );
}
