Self-host the map libraries by placing these 3 files here:
  d3.min.js                -> https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js
  topojson-client.min.js   -> https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js
  countries-110m.json      -> https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
The business pages load these from /vendor first and fall back to the CDN automatically,
so as soon as the files are here the map is fully self-hosted. Until then it uses the CDN (lazy-loaded).
