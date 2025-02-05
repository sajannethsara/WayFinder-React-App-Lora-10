import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FqYW5uZXRoc2FyYSIsImEiOiJjbTZxNzVtajMxYnF0MnRvN29qamN1MTNrIn0.RZ1ff_8qwDRdypBeJVGsbQ';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Multi-dimensional array of paths
  const paths = [
    [  // Path 1
      [79.898090, 6.927079],
      [79.899500, 6.928000],
      [79.901000, 6.929500]
    ],
    [  // Path 2
      [79.900000, 6.930000],
      [79.902500, 6.931000],
      [79.904315, 6.932900]
    ],
    [  // Path 3
      [79.897000, 6.925000],
      [79.898500, 6.926500],
      [79.899900, 6.928000]
    ]
  ];

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [79.901, 6.927],
      zoom: 13
    });

    map.current.on('load', () => {
      paths.forEach((path, index) => {
        const sourceId = `route-${index}`;
        const layerId = `layer-${index}`;

        // Add source for each path
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: path
            }
          }
        });

        // Add layer for each path with different colors
        map.current.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': getColor(index),  // Use dynamic colors
            'line-width': 4
          }
        });

        // Add markers for start and end points of each path
        new mapboxgl.Marker({ color: 'green' })
          .setLngLat(path[0])
          .setPopup(new mapboxgl.Popup().setHTML(`<h4>Start of Path ${index + 1}</h4>`))
          .addTo(map.current);

        new mapboxgl.Marker({ color: 'red' })
          .setLngLat(path[path.length - 1])
          .setPopup(new mapboxgl.Popup().setHTML(`<h4>End of Path ${index + 1}</h4>`))
          .addTo(map.current);
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  // Function to generate different colors for each path
  const getColor = (index) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];
    return colors[index % colors.length];
  };

  return <div ref={mapContainer} style={{ width: '100%', height: '900px' }} />;
};

export default Map;
