import Me from './Me.view.js';
import React from 'react';
import Masonry from 'react-masonry-css';
import './Me.view.css';

export default function() {
  return (
    <Masonry
      breakpointCols={3}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      <Me />
    </Masonry>
  );
}
