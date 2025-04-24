# TPN Lease Portal

## Overview
TPN Lease Portal is a React single-page application that lets you tap into the Tao Private Network’s decentralized WireGuard VPN endpoints. Spin up a connection in any country in seconds, download your `.conf` file or scan a QR code on mobile, and monitor endpoint health—all in one slick interface.

## Key Features

- **3D Rotating Globe**  
  Click on any country marker to instantly kick off the lease flow.  
- **Country Dropdown Selector**  
  A simple fallback for users who prefer a traditional list.  
- **Flexible Lease Modal**  
  - Specify lease duration (1–60 minutes)  
  - Auto-download ready-to-use WireGuard `.conf`  
  - QR code generation for mobile clients  
- **Live Monitoring Dashboard**  
  - Polls all validators every 30 s  
  - Bar chart of latency per host  
  - Highlights the best endpoint (lowest ping)  
- **Additional Advanced Features**  
  - **Real-Time Connection Status**: show active lease time remaining and expiration countdown  
  - **Geo-Proximity Suggestions**: recommend nearest healthy validator based on ping  
  - **Auto-Extension Option**: offer to renew lease automatically before expiry  
  - **Multi-Hop Configurations**: build onion-style two-hop tunnels for extra privacy  
  - **Historical Usage Logs**: track past leases, durations, and endpoints  
  - **Push Notifications**: desktop/browser warning 1 minute before lease expires  
  - **Offline Caching**: store country list in IndexedDB so the globe works without network  
  - **Rate-Limit Protection**: debounce user actions & prevent accidental spam  
  - **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen-reader support  
  - **Theming**: light/dark mode toggle, customizable brand colors  


## Technical Details

### Architecture
- **SPA Layer**: React with React Router for `/` (Home) and `/monitor` (Dashboard).  
- **UI & Styling**: Chakra UI for accessible, responsive components and theming.  
- **3D Rendering**: react-three-fiber + drei for high-performance Earth visualization.  
- **Data Visualization**: Recharts bar charts for latency metrics.

### Data Flow
1. **Load Countries**  
   - On mount: `tpnClient.getCountries()` ⇒ fetches `["US","NL","BR",…]` from a random validator.  
2. **Lease Workflow**  
   - User selects a country ⇒ open `LeaseModal`.  
   - On confirm: `tpnClient.createLease(country, minutes)` ⇒ returns JSON `{ peer_config, expires_at }`.  
   - Generate QR (`qrcode.react`) and auto-download the config blob.  
3. **Monitoring**  
   - `tpnClient.getValidatorMetrics()` pings each host in parallel (2000 ms timeout).  
   - Sorts by latency and renders the results every 30 s.

### Component Breakdown
- **`<Globe />`**  
  - Textured sphere + auto-rotation  
  - Clickable country pins via lat/lng→3D coordinate mapping  
- **`<LeaseModal />`**  
  - Chakra Modal + NumberInput for duration  
  - Handles API call, QR generation, and file download  
- **`<Dashboard />`**  
  - Polling logic with `setInterval`  
  - Recharts `<BarChart>` to visualize ms latency  
- **`<Navbar />`**  
  - Responsive top bar with React Router links  
- **Pages**  
  - `Home.jsx`: Globe + dropdown + lease flow  
  - `Monitor.jsx`: Dashboard only  

### State Management
- React hooks (`useState`, `useEffect`, `useDisclosure`) handle component state, modal visibility, and polling lifecycles.
- Debounce & cache country list in component state to prevent redundant network calls.

### API Integration
- **Endpoints (validator port 3000):**  
  - `GET /api/config/countries` → array of country codes  
  - `GET /api/config/new?format=json&geo=<code>&lease_minutes=<n>` → `{ peer_config, expires_at }`  
- **Validator Pool**  
  - `REACT_APP_VALIDATORS`: JSON array of host:port strings  
  - `tpnClient` rotates through them at random or by lowest ping  

### Performance Considerations
- **Globe Rendering**: low-poly sphere + 64×64 texture to balance detail vs. FPS  
- **Data Caching**: memoize country list for session  
- **Polling Interval**: adjustable; default 30 s, configurable via a constant  
- **Lazy Loading**: map country pins only after texture load

### Security Considerations
- **No Auth Required** (alpha release) but endpoints are rate-limited on the network side.  
- **Config Handling**: WireGuard private keys live only in memory/blobs; never stored in localStorage.  
- **CORS & CSP**: enforce strict Content Security Policy in production build.  
- **HTTPS**: recommend deploying behind an HTTPS reverse proxy for secure browser connections.

### Styling & Theming
- **Chakra Provider** wraps the app for theme context.  
- **Custom Theme** (in `theme.js`, if extended) can override colors, fonts, and global styles.  
- **Responsive**: all layouts use Chakra’s `Stack`, `Flex`, and responsive props.

### Testing & CI/CD
- **Unit Tests**: Jest + React Testing Library for components (e.g., modal open/close, API mocks).  
- **E2E Tests**: Cypress to automate the lease flow and dashboard interactions.  
- **Lint & Format**: ESLint + Prettier enforced via GitHub Actions on each PR.  
- **Deployment**: GitHub Pages, Vercel, or Netlify (CI auto-build on `main` pushes).
