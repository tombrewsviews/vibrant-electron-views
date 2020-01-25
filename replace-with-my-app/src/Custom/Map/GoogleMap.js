// @view
import React, { useEffect, useRef, useState } from 'react';
import GoogleMarker from './GoogleMarker.js';
import useGoogleMapsApi from 'utils/useGoogleMapsApi';

let Map = props => {
  let [zoom, setZoom] = useState(props.zoom);
  let container = useRef();
  let [map, setMap] = useState(null);
  let maps = useGoogleMapsApi({ key: process.env.REACT_APP_GOOGLE_MAPS_KEY });

  useEffect(() => {
    if (!maps.isReady || map) return;
    setMap(
      new maps.api.Map(container.current, {
        center: props.center,
        zoom,
        // see https://developers.google.com/maps/documentation/javascript/controls
        // for the rest of the controls
        disableDefaultUI: true,
        zoomControl: props.zoomControl,
      })
    );
  }, [maps.isReady]); // eslint-disable-line
  // we are not adding the suggested 'maps.api.Map' to the above line as it breaks the effect
  // if we also have 'maps.isReady' as a dependency, which is more important to the actual function

  useEffect(() => {
    let isCenterValid =
      props.center &&
      typeof props.center.lat === 'number' &&
      typeof props.center.lng === 'number';

    if (!map || !isCenterValid) return;
    // only pan to the new centre if it's outside of the
    // visible bounds
    let bounds = map.getBounds();
    if (bounds && bounds.contains(props.center)) return;
    //zoom in
    map.panTo(props.center);
  }, [map, props.center]);

  useEffect(() => {
    if (!map) return;

    map.setZoom(zoom);
  }, [map, zoom]);

  useEffect(() => {
    if (props.userLocation) {
      setZoom(10);
    }
  }, [props.userLocation]);

  let createIcon = ({ id }) => {
    let isActive =
      props.highlightedLocation === id || props.hoveredMarker === id;

    return {
      path: `M3.72,0A3.66,3.66,0,0,0,.06,3.68c0,1.76,2.78,7,3.49,8.29a.19.19,0,0,0,.33,0c.71-1.3,3.5-6.53,3.5-8.29A3.66,3.66,0,0,0,3.72,0Z`,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: isActive ? '#21D98F' : '#F78270',
      anchor: new maps.api.Point(6.4, 10),
      scale: isActive ? 3 : 2.5,
      fillColor: isActive ? '#009659' : '#ED371A',
    };
  };
  // TODO should the user location have a different marker?
  return (
    <>
      <div
        ref={container}
        id={'locations-map'}
        style={{ height: props.height, width: '100%', maxWidth: props.width }}
      />
      {map && props.userLocation && (
        <GoogleMarker
          icon={{
            path: 'M5,.27A4.73,4.73,0,1,0,9.73,5,4.73,4.73,0,0,0,5,.27Z',
            fillColor: '#2B7ABE',
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: '#A7CBEB',
            anchor: new maps.api.Point(5.6, 5),
            scale: 2,
          }}
          lat={props.userLocation.lat}
          lng={props.userLocation.lng}
          map={map}
          maps={maps}
          title="User Location"
          onTop
        />
      )}
      {map &&
        props.markers.map(item => (
          <GoogleMarker
            {...item}
            map={map}
            maps={maps}
            icon={createIcon(item)}
            onClick={() => props.setHighlightedLocation(item.id)}
            title={item.text}
            key={item.id}
          />
        ))}
    </>
  );
};
Map.defaultProps = {
  markers: [],
  center: {
    lat: 34.7465,
    lng: -92.2896,
  },
  zoom: 6,
  width: '100%',
  height: '100%',
  zoomControl: true,
};

export default Map;
