// @view
import { useEffect, useRef } from 'react';

export default function GoogleMarker({
  map,
  maps,
  title,
  lat,
  lng,
  icon,
  onClick,
  onTop = false,
}) {
  let marker = useRef();

  useEffect(() => {
    marker.current = new maps.api.Marker({
      map,
      title,
      position: {
        lat,
        lng,
      },
      icon,
    });

    if (onTop) {
      marker.current.setZIndex(maps.api.Marker.MAX_ZINDEX + 1);
    }

    if (typeof onClick === 'function') {
      marker.current.addListener('click', onClick);
    }

    // remove the marker from the map when the component unmounts
    return () => {
      marker.current.setMap(null);
    };
  }, []); // eslint-disable-line

  // change icon
  useEffect(() => {
    if (!marker.current) return;
    marker.current.setIcon(icon);
  }, [icon]);

  useEffect(() => {
    if (!marker.current) return;
    marker.current.setPosition({ lat, lng });
  }, [lat, lng]);

  return null;
}
