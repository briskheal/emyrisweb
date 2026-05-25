import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import './IndiaMap.css';

const IndiaMap = ({ markets }) => {
  return (
    <div className="india-map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [82.8, 22.5] // Center of India
        }}
        width={800}
        height={800}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography="/india.json">
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#e2e8f0', outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {markets && markets.filter(m => m.status === 'Active').map(market => (
          <Marker key={market.id} coordinates={[parseFloat(market.lng), parseFloat(market.lat)]}>
            <g className="marker-group">
              <foreignObject x="-20" y="-60" width="60" height="70">
                <div className="flag-container">
                  <div className="flag-pole"></div>
                  <div className="flag-fabric">Emyris</div>
                </div>
              </foreignObject>
              <circle className="marker-base" r={4} fill="#1d4ed8" />
              <text
                className="marker-text"
                textAnchor="middle"
                y={18}
              >
                {market.name}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default IndiaMap;
