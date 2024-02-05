//import React, { useRef, useEffect } from 'react';
 
import './Map.css';

//app id=  GFid5mTtzIs2Pw3Vc5As
// api key   Yi4mEcQdVrHUljXoeTXlQa4Z8EDNpKZQMhCEq-BikHo
/*
import React, { useEffect, useRef } from 'react';

const MapComponent = ({ apiKey, zoom, center }) => {
  const mapRef = useRef(null);
  useEffect(() => {
    let map;

    const loadScript = (url, callback) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onload = callback;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (map) {
        map.dispose();
      }
      const platform = new window.H.service.Platform({
        'apikey': apiKey
      });

      const maptypes = platform.createDefaultLayers();
      map = new window.H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
          zoom: zoom || 12,
          center: center || { lng: -73.9878584, lat: 40.7484405 }
        });

      // Manually create UI components
      const ui = new window.H.ui.UI(map, maptypes);
      
      const zoomControl = new window.H.ui.ZoomControl({ 'zoomSpeed': 0.5 });
      ui.addControl('zoom', zoomControl);

      const marker = new window.H.map.Marker(center);
      map.addObject(marker);

      mapRef.current = map; // Save map reference to the useRef
    };

    loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js', () => {
      loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js', () => {
        loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js', () => {
          loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js', initializeMap);
        });
      });
    });

    return () => {
      if (map) {
        map.dispose();
      }
    };
  }, [apiKey, zoom, center]);



  return <div style={{ width: '640px', height: '480px' }} id="mapContainer"></div>;
};

export default MapComponent;

*/


import React, { useState, useEffect } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay.js';
import { fromLonLat } from 'ol/proj.js';
import { Tile as TileLayer } from 'ol/layer.js';
import OSM from 'ol/source/OSM.js';
import axios from 'axios';

const MapComponent = ({ center }) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);
  const [pointerOverlay, setPointerOverlay] = useState(null);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleGeocode = async () => {
    try {
      const response = await axios.get('https://trueway-geocoding.p.rapidapi.com/Geocode', {
        params: {
          address: address,
        },
        headers: {
          'x-rapidapi-key': 'YOUR_API_KEY', // Replace 'YOUR_API_KEY' with your actual API key
          'x-rapidapi-host': 'trueway-geocoding.p.rapidapi.com',
        },
      });

      const location = response.data.results[0].location;
      setCoordinates({ latitude: location.lat, longitude: location.lng });
      setError('');

      if (map) {
        // Center the map to the geocoded location
        map.getView().setCenter(fromLonLat([location.lng, location.lat]));
        map.getView().setZoom(10);
      }
    } catch (error) {
      setError('Error geocoding address. Please try again.');
      setCoordinates(null);
    }
  };

  useEffect(() => {
    // Initialize the map when the component mounts
    const mapInstance = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]), // Default center at San Francisco
        zoom: 18, // Default zoom level
      }),
    });
    setMap(mapInstance);

        // Add a pointer overlay at the center of the map
        const pointerElement = document.createElement('div');
        pointerElement.className = 'pointer';
        const pointerOverlayInstance = new Overlay({
          element: pointerElement,
          position: fromLonLat([center.lng, center.lat]),
          positioning: 'center-center',
          stopEvent: false,
        });
        mapInstance.addOverlay(pointerOverlayInstance);
        setPointerOverlay(pointerOverlayInstance);

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      if (mapInstance) {
        mapInstance.setTarget(null);
      }
    };
  }, [center]); // Empty dependency array ensures this effect runs only once on mount

  return (
    
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      
  );
};

export default MapComponent;

