module.exports = {
  sectors: ['residential', 'commercial', 'industrial', 'agriculture', 'ev'],
  systemTypes: [
    'solar-pv',
    'bess',
    'solar-bess',
    'ev-charging',
    'electrical-engineering',
    'architecture-building-design',
    'civil-structural-engineering',
  ],
  capacityUnits: ['kW', 'MW', 'kWh', 'MWh'],
  // Rough bounding box around Pakistan. Catches swapped or mistyped coordinates.
  pakistanBounds: { minLat: 23.5, maxLat: 37.2, minLng: 60.8, maxLng: 77.9 },
  // Slugs that would clash with fixed routes under /api/projects.
  reservedSlugs: ['map', 'admin'],
};