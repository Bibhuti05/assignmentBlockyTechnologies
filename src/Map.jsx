import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import {
  TileLayer,
  MapContainer,
  LayersControl,
  Marker,
  Popup,
} from 'react-leaflet';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Base map tile:
const maps = {
  base: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};

const Map = () => {
  // Save map instance to state here:
  const [map, setMap] = useState(null);
  // Save routing machine instance to state here:
  const [routingMachine, setRoutingMachine] = useState(null);

  // Start-End point for the routing machine
  const [start, setStart] = useState([23.205504, 77.426037]);
  const [end, setEnd] = useState([23.200882, 77.422068]);
  const [rp, setRp] = useState([]);
  const [car, setCar] = useState([23.201771, 77.425272]);
  const svgIcon = L.divIcon({
    html: `
    <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 31.445 31.445" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M7.592,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.768,0,3.203-1.434,3.203-3.204 S9.36,16.86,7.592,16.86z M7.592,21.032c-0.532,0-0.968-0.434-0.968-0.967s0.436-0.967,0.968-0.967 c0.531,0,0.966,0.434,0.966,0.967S8.124,21.032,7.592,21.032z"></path> <path d="M30.915,17.439l-0.524-4.262c-0.103-0.818-0.818-1.418-1.643-1.373L27.6,11.868l-3.564-3.211 c-0.344-0.309-0.787-0.479-1.249-0.479l-7.241-0.001c-1.625,0-3.201,0.555-4.468,1.573l-4.04,3.246l-5.433,1.358 c-0.698,0.174-1.188,0.802-1.188,1.521v1.566C0.187,17.44,0,17.626,0,17.856v2.071c0,0.295,0.239,0.534,0.534,0.534h3.067 c-0.013-0.133-0.04-0.26-0.04-0.396c0-2.227,1.804-4.029,4.03-4.029s4.029,1.802,4.029,4.029c0,0.137-0.028,0.264-0.041,0.396 h8.493c-0.012-0.133-0.039-0.26-0.039-0.396c0-2.227,1.804-4.029,4.029-4.029c2.227,0,4.028,1.802,4.028,4.029 c0,0.137-0.026,0.264-0.04,0.396h2.861c0.295,0,0.533-0.239,0.533-0.534v-1.953C31.449,17.68,31.21,17.439,30.915,17.439z M20.168,12.202l-10.102,0.511L12,11.158c1.051-0.845,2.357-1.305,3.706-1.305h4.462V12.202z M21.846,12.117V9.854h0.657 c0.228,0,0.447,0.084,0.616,0.237l2.062,1.856L21.846,12.117z"></path> <path d="M24.064,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.769,0,3.203-1.434,3.203-3.204 S25.833,16.86,24.064,16.86z M24.064,21.032c-0.533,0-0.967-0.434-0.967-0.967s0.434-0.967,0.967-0.967 c0.531,0,0.967,0.434,0.967,0.967S24.596,21.032,24.064,21.032z"></path> </g> </g> </g></svg>`,
    className: 'svg-icon',
    iconSize: [10, 10],
    iconAnchor: [30, 40],
  });

  // Routing machine ref
  const RoutingMachineRef = useRef(null);

  // Create the routing-machine instance:
  useEffect(() => {
    if (!map) return;
    if (map) {
      RoutingMachineRef.current = L.Routing.control({
        position: 'topleft',
        lineOptions: {
          styles: [
            {
              color: '#757de8',
            },
          ],
        },
        waypoints: [start, end],
      }).on('routesfound', function (e) {
        const routes = e.routes;
        const route = routes[0];
        const coordinates = route.coordinates;

        // Convert coordinates to an array of points
        const points = coordinates.map((coord) => [coord.lat, coord.lng]);
        setRp(points);
        console.log(rp);
      });
      setRoutingMachine(RoutingMachineRef.current);
    }
  }, [map]);

  // Set waypoints when start and end points are updated:
  useEffect(() => {
    if (routingMachine) {
      routingMachine.addTo(map);
      routingMachine.setWaypoints([start, end]);
    }
  }, [routingMachine, start, end]);

  // Get the intermediate points of the route
  const getIntermediatePoints = () => {
    if (rp.lenght !== 0) {
      rp.forEach((item, index) => {
        setTimeout(() => {
          console.log(item);
          setCar(item);
        }, 500 * (index + 1));
      });
    }
  };

  function handleClick() {}

  // Get the intermediate points of the route

  return (
    <>
      <button
        onClick={getIntermediatePoints}
        style={{ padding: '10px', margin: '10px' }}
      >
        Get Intermediate Points
      </button>
      <MapContainer
        center={car}
        zoom={3}
        zoomControl={true}
        style={{ height: '90vh', width: '100%', padding: 0 }}
        // Set the map instance to state when ready:
        whenCreated={(map) => setMap(map)}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Map">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url={maps.base}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Marker position={car} icon={svgIcon}>
          <Popup>{car}</Popup>
        </Marker>
      </MapContainer>
    </>
  );
};
export default Map;
