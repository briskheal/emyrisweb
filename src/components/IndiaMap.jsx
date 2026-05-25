import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import './IndiaMap.css';

const getHubIdByName = (name) => {
  const map = {
    'Hyderabad': 'hyderabad',
    'Vadodara': 'vadodara',
    'Bhubaneswar': 'bhubaneswar',
    'Guwahati': 'guwahati',
    'Jaipur': 'jaipur'
  };
  return map[name] || null;
};

const IndiaMap = ({ markets, selectedHubId, onSelectHub }) => {
  const [hoveredMarket, setHoveredMarket] = useState(null);

  return (
    <div className="india-map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1200,
          center: [80, 22] // Center of India
        }}
        width={800}
        height={800}
        style={{ width: "100%", height: "auto", background: "transparent" }}
      >
        <Geographies geography="/india.json">
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="state-geography"
                fill="#cbd5e1"
                stroke="#64748b"
                strokeWidth={1}
                style={{
                  default: { outline: 'none', transition: 'all 0.3s ease' },
                  hover: { fill: '#94a3b8', stroke: '#475569', strokeWidth: 1.5, outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {markets && markets.filter(m => m.status === 'Active').map(market => {
          const hubId = getHubIdByName(market.name);
          const isHub = !!hubId;
          const isSelected = hubId === selectedHubId;
          const isHovered = hoveredMarket === market.id;

          if (isHub) {
            return (
              <Marker 
                key={market.id} 
                coordinates={[parseFloat(market.lng), parseFloat(market.lat)]}
              >
                <g 
                  className={`marker-group hub-marker ${isSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                  onClick={() => onSelectHub && onSelectHub(hubId)}
                  onMouseEnter={() => setHoveredMarket(market.id)}
                  onMouseLeave={() => setHoveredMarket(null)}
                >
                  {/* Pulsing rings using native SVG animate tags to prevent drifting/floating bugs */}
                  <circle r={6} fill={isSelected ? 'var(--secondary)' : 'var(--primary)'} opacity={0.6}>
                    <animate attributeName="r" values="6;20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r={6} fill={isSelected ? 'var(--secondary)' : 'var(--primary)'} opacity={0.4}>
                    <animate attributeName="r" values="6;30" dur="2s" begin="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0" dur="2s" begin="0.8s" repeatCount="indefinite" />
                  </circle>

                  {/* Core beacon dot */}
                  <circle 
                    className="hub-beacon" 
                    r={isSelected ? 7 : 6} 
                    fill={isSelected ? '#fbbf24' : '#1d4ed8'} 
                    stroke="#ffffff" 
                    strokeWidth={1.5} 
                  />
                  
                  {/* Label */}
                  <text
                    className="marker-text hub-text"
                    textAnchor="middle"
                    y={-14}
                  >
                    ★ {market.name}
                  </text>
                </g>
              </Marker>
            );
          } else {
            return (
              <Marker 
                key={market.id} 
                coordinates={[parseFloat(market.lng), parseFloat(market.lat)]}
              >
                <g 
                  className={`marker-group standard-marker ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredMarket(market.id)}
                  onMouseLeave={() => setHoveredMarket(null)}
                >
                  {/* Subtle pulsing background for standard active market presence */}
                  <circle r={4} fill="#1d4ed8" opacity={0.3}>
                    <animate attributeName="r" values="4;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" />
                  </circle>

                  <circle className="standard-dot" r={4} fill="#1d4ed8" stroke="#ffffff" strokeWidth={1} />
                  
                  <text
                    className="marker-text standard-text"
                    textAnchor="middle"
                    y={13}
                  >
                    {market.name}
                  </text>
                </g>
              </Marker>
            );
          }
        })}
      </ComposableMap>

      {/* Modern floating tooltip inside the map container */}
      {hoveredMarket && (
        <div className="map-tooltip glass fade-in">
          {(() => {
            const market = markets.find(m => m.id === hoveredMarket);
            if (!market) return null;
            const hubId = getHubIdByName(market.name);
            return (
              <div>
                <div className="tooltip-title">
                  {hubId ? '🏢 Regional Logistic Hub' : '📍 Active Market'}
                </div>
                <div className="tooltip-name">{market.name}</div>
                <div className="tooltip-status">
                  <span className="status-dot"></span> Operations Active
                </div>
                {hubId && (
                  <div className="tooltip-hint">Click marker to inspect hub details</div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default IndiaMap;
