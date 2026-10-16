'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  Circle,
  ClipboardCheck,
  CloudCog,
  Command,
  Crosshair,
  Gauge,
  Grid3X3,
  Layers3,
  MapPin,
  Menu,
  PackageCheck,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Snowflake,
  Thermometer,
  Truck,
  Warehouse,
  X,
} from 'lucide-react'

type Facility = {
  code: string
  name: string
  region: string
  status: 'ONLINE' | 'WATCH' | 'OFFLINE'
  cold: string
  occupancy: number
  inbound: number
  outbound: number
  gates: number
}

type Dock = {
  id: string
  carrier: string
  direction: 'INBOUND' | 'OUTBOUND'
  eta: string
  temp: string
  status: 'CLEARED' | 'IN REVIEW' | 'DOCKED' | 'HOLD'
  pallets: number
}

const facilities: Facility[] = [
  { code: 'ATL-01', name: 'ATLANTA NORTH', region: 'SOUTHEAST', status: 'ONLINE', cold: '-18.4°C', occupancy: 82, inbound: 14, outbound: 22, gates: 8 },
  { code: 'RNO-04', name: 'RENO WEST', region: 'MOUNTAIN', status: 'WATCH', cold: '-20.1°C', occupancy: 67, inbound: 9, outbound: 16, gates: 6 },
  { code: 'JOL-02', name: 'JOLIET CENTRAL', region: 'MIDWEST', status: 'ONLINE', cold: '-17.9°C', occupancy: 74, inbound: 18, outbound: 20, gates: 10 },
  { code: 'EWR-07', name: 'NEWARK EAST', region: 'NORTHEAST', status: 'ONLINE', cold: '-19.2°C', occupancy: 91, inbound: 11, outbound: 27, gates: 8 },
]

const docks: Dock[] = [
  { id: 'DK-081', carrier: 'Polar Freight / PF-442', direction: 'INBOUND', eta: '04:20', temp: '-21.0°C', status: 'CLEARED', pallets: 26 },
  { id: 'DK-094', carrier: 'Northstar Logistics / NS-119', direction: 'OUTBOUND', eta: '04:35', temp: '-18.3°C', status: 'DOCKED', pallets: 18 },
  { id: 'DK-103', carrier: 'Arctic Haulage / AH-208', direction: 'INBOUND', eta: '05:05', temp: '-19.7°C', status: 'IN REVIEW', pallets: 32 },
  { id: 'DK-117', carrier: 'Meridian Cold / MC-802', direction: 'OUTBOUND', eta: '05:30', temp: '-17.5°C', status: 'HOLD', pallets: 12 },
  { id: 'DK-122', carrier: 'Polar Freight / PF-449', direction: 'INBOUND', eta: '05:45', temp: '-20.4°C', status: 'CLEARED', pallets: 21 },
]

const navItems = [
  { label: 'Command overview', icon: Command },
  { label: 'Dock router', icon: Grid3X3, active: true },
  { label: 'Inventory control', icon: Boxes },
  { label: 'Cold-chain telemetry', icon: Thermometer },
  { label: 'Compliance ledger', icon: ClipboardCheck },
]

function StatusMark({ status }: { status: Facility['status'] }) {
  return <span className={`status-mark status-${status.toLowerCase()}`}><Circle className="size-2.5 fill-current" />{status}</span>
}

export default function Page() {
  const [activeFacility, setActiveFacility] = useState('ATL-01')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showAlerts, setShowAlerts] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedDock, setSelectedDock] = useState<string | null>('DK-094')

  const filteredDocks = useMemo(() => docks.filter((dock) => `${dock.id} ${dock.carrier}`.toLowerCase().includes(query.toLowerCase())), [query])
  const active = facilities.find((facility) => facility.code === activeFacility) ?? facilities[0]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e8e5dc] selection:bg-[#d8aa45] selection:text-[#0a0a0a]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col border-x border-[#2a2419] bg-[#0e0e0d]">
        <header className="flex min-h-16 items-center justify-between border-b border-[#3b301d] bg-[#11110f] px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <button className="icon-button lg:hidden" aria-label="Open navigation"><Menu /></button>
            <div className="brand-seal"><Snowflake className="size-5" /></div>
            <div>
              <p className="eyebrow">SIS / LOGISTICS OPERATIONS</p>
              <h1 className="font-display text-sm font-semibold tracking-[0.18em] text-[#f5ecd8] sm:text-base">SOVEREIGN COLD-CHAIN DOCK ROUTER</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 border border-[#30291b] bg-[#0b0b0a] px-3 py-2 font-mono text-[10px] text-[#a39a87] sm:flex"><Radio className="size-3 text-[#c89c3c]" /> LINK: STABLE <span className="ml-2 text-[#6f6b61]">04:12:39 UTC</span></div>
            <button className="icon-button relative" aria-label="Notifications" onClick={() => setShowAlerts(!showAlerts)}><Bell /><span className="notification-dot" /></button>
            <div className="avatar">DA</div>
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden w-64 shrink-0 border-r border-[#2d271c] bg-[#11110f] p-4 lg:block">
            <div className="mb-8 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#726b5e]"><Crosshair className="size-3.5 text-[#c89c3c]" /> Operations console</div>
            <nav className="flex flex-col gap-1">
              {navItems.map(({ label, icon: Icon, active: isActive }) => <button key={label} className={`nav-item ${isActive ? 'nav-item-active' : ''}`}><Icon className="size-4" />{label}{isActive && <ArrowUpRight className="ml-auto size-3" />}</button>)}
            </nav>
            <div className="mt-10 border-t border-[#2d271c] pt-6">
              <p className="eyebrow px-3">System integrity</p>
              <div className="mt-4 flex items-center gap-3 px-3"><ShieldCheck className="size-5 text-[#c89c3c]" /><div><p className="font-mono text-xs text-[#ddd3bf]">98.7%</p><p className="text-[10px] text-[#746d60]">ledger confidence</p></div></div>
              <div className="integrity-bar mt-4"><span /></div>
            </div>
            <div className="mt-auto pt-20"><div className="border border-[#382d1b] bg-[#16130d] p-3"><p className="eyebrow text-[#b88b32]">Routing protocol</p><p className="mt-2 font-mono text-[11px] leading-relaxed text-[#9c907b]">AUTONOMOUS PRIORITY<br /><span className="text-[#d0a348]">COLD-CHAIN / P1</span></p></div></div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="border-b border-[#2d271c] px-5 py-6 sm:px-8">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div><p className="eyebrow mb-2">CONTROL PLANE / ACTIVE ROUTE</p><h2 className="font-display text-2xl font-medium tracking-tight text-[#f1e9d8] sm:text-3xl">Facility command overview</h2><p className="mt-2 max-w-2xl text-sm text-[#888174]">Real-time dock allocation and temperature assurance across the sovereign network.</p></div>
                <div className="flex items-center gap-2"><button className="outline-button"><RefreshCw className="size-3.5" /> Sync network</button><button className="gold-button"><ArrowDownToLine className="size-3.5" /> Export manifest</button></div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden border border-[#342b1b] bg-[#342b1b] sm:grid-cols-4">
                {[['ACTIVE FACILITIES', '04', 'NETWORK / NOMINAL'], ['TOTAL DOCKS', '32', '+ 06 IN QUEUE'], ['COLD-CHAIN VARIANCE', '0.3°C', 'WITHIN SPEC'], ['ROUTE CONFIDENCE', '98.7%', 'LEDGER VERIFIED']].map(([label, value, note]) => <div key={label} className="metric-cell"><p className="eyebrow">{label}</p><p className="mt-2 font-mono text-xl text-[#e2b653]">{value}</p><p className="mt-1 text-[9px] tracking-[0.14em] text-[#6f695c]">{note}</p></div>)}
              </div>
            </div>

            <div className="px-5 py-6 sm:px-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">01 / MULTI-FACILITY TRACKING</p><h3 className="section-title">Network facilities</h3></div><div className="flex items-center gap-2"><div className="flex border border-[#3b301d] bg-[#12110e] p-0.5"><button className={`view-button ${view === 'grid' ? 'view-selected' : ''}`} onClick={() => setView('grid')} aria-label="Grid view"><Grid3X3 className="size-3.5" /></button><button className={`view-button ${view === 'list' ? 'view-selected' : ''}`} onClick={() => setView('list')} aria-label="List view"><Layers3 className="size-3.5" /></button></div><button className="outline-button"><MapPin className="size-3.5" /> Map view</button></div></div>
              <div className={view === 'grid' ? 'grid gap-3 md:grid-cols-2 xl:grid-cols-4' : 'flex flex-col gap-2'}>{facilities.map((facility) => <button key={facility.code} onClick={() => setActiveFacility(facility.code)} className={`facility-card text-left ${activeFacility === facility.code ? 'facility-active' : ''}`}><div className="flex items-start justify-between"><div><p className="font-mono text-[11px] text-[#d7a943]">{facility.code}</p><h4 className="mt-1 font-display text-sm tracking-[0.08em] text-[#eee5d2]">{facility.name}</h4><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#716b60]">{facility.region}</p></div><StatusMark status={facility.status} /></div><div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#2e281d] pt-3"><div><p className="eyebrow">Temp core</p><p className="mt-1 font-mono text-sm text-[#e6b753]">{facility.cold}</p></div><div><p className="eyebrow">Occupancy</p><p className="mt-1 font-mono text-sm text-[#e6b753]">{facility.occupancy}%</p></div></div><div className="mt-3 h-1 bg-[#252118]"><span className="block h-full bg-[#b9892e]" style={{ width: `${facility.occupancy}%` }} /></div><div className="mt-4 flex items-center justify-between font-mono text-[10px] text-[#777063]"><span>IN {facility.inbound.toString().padStart(2, '0')}</span><span>OUT {facility.outbound.toString().padStart(2, '0')}</span><span>GATES {facility.gates}</span></div></button>)}</div>

              <div className="mt-10"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">02 / DOCK ASSIGNMENT MATRIX</p><h3 className="section-title">{active.name} <span className="font-mono text-sm text-[#716b60]">/ {active.code}</span></h3></div><div className="search-box"><Search className="size-3.5" /><input aria-label="Search dock manifest" placeholder="Search manifest" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div><div className="overflow-x-auto border border-[#342b1b]"><table className="w-full min-w-[700px] text-left"><thead><tr><th>Dock ID</th><th>Carrier / movement</th><th>Window</th><th>Temp assurance</th><th>Status</th><th className="text-right">Pallets</th></tr></thead><tbody>{filteredDocks.map((dock) => <tr key={dock.id} onClick={() => setSelectedDock(dock.id)} className={`cursor-pointer ${selectedDock === dock.id ? 'row-selected' : ''}`}><td><span className="font-mono text-xs text-[#dfaE4a]">{dock.id}</span>{selectedDock === dock.id && <Check className="ml-2 inline size-3 text-[#dbae50]" />}</td><td><div className="flex items-center gap-2"><span className={`direction-icon ${dock.direction === 'INBOUND' ? 'text-[#d3a443]' : 'text-[#9faaa1]'}`}>{dock.direction === 'INBOUND' ? <ArrowDownToLine className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}</span><span className="text-xs text-[#c5bdad]">{dock.carrier}</span></div></td><td className="font-mono text-xs text-[#968b77]">{dock.eta} UTC</td><td className="font-mono text-xs text-[#d4a746]"><Thermometer className="mr-1 inline size-3" />{dock.temp}</td><td><span className={`table-status status-${dock.status.toLowerCase().replace(' ', '-')}`}>{dock.status}</span></td><td className="text-right font-mono text-xs text-[#c0b6a4]">{dock.pallets.toString().padStart(2, '0')}</td></tr>)}</tbody></table></div></div>

              <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="signal-panel"><div className="flex items-center justify-between"><div><p className="eyebrow text-[#ba8e36]">Live telemetry</p><h3 className="mt-1 font-display text-sm tracking-[0.08em] text-[#e9dfca]">Cold-chain signal integrity</h3></div><Activity className="size-4 text-[#d1a344]" /></div><div className="mt-5 flex h-16 items-end gap-1">{[32, 48, 40, 58, 52, 68, 62, 76, 71, 82, 74, 88, 80, 92, 84, 90, 86, 94, 88, 96, 92, 98, 94, 100].map((height, index) => <span key={index} className="signal-bar" style={{ height: `${height}%` }} />)}</div><div className="mt-3 flex justify-between font-mono text-[9px] text-[#716a5d]"><span>-60 MIN</span><span>NOMINAL BAND / ±0.5°C</span><span>NOW</span></div></div>
                <div className="signal-panel"><div className="flex items-center gap-3"><Gauge className="size-5 text-[#d2a13e]" /><div><p className="eyebrow">Selected route</p><p className="font-mono text-sm text-[#e4b452]">{selectedDock ?? 'NONE'} <span className="text-[#766d5d]">/ PRIORITY 01</span></p></div></div><div className="mt-5 grid grid-cols-2 gap-4"><div><p className="eyebrow">SLA window</p><p className="mt-1 font-mono text-xs text-[#d8d0bf]">00:23:41</p></div><div><p className="eyebrow">Exception count</p><p className="mt-1 font-mono text-xs text-[#d8a83f]">00 / CLEAR</p></div></div></div>
              </div>
            </div>
          </section>
        </div>
        <footer className="flex flex-col justify-between gap-2 border-t border-[#3b301d] bg-[#11110f] px-5 py-4 text-[9px] uppercase tracking-[0.16em] text-[#746d5f] sm:flex-row sm:px-8"><span className="flex items-center gap-2"><ShieldCheck className="size-3 text-[#c99b3b]" /> Fully certified by Serpent Intelligence Systems</span><span className="flex items-center gap-2"><CloudCog className="size-3 text-[#c99b3b]" /> Domenick Arlon Hall corporate ledger / <span className="text-[#b08a3c]">DAL-8841-CC</span></span></footer>
      </div>
      {showAlerts && <div className="fixed bottom-5 right-5 hidden w-72 border border-[#5b451d] bg-[#17140e] p-4 shadow-2xl sm:block"><div className="flex items-center justify-between"><p className="eyebrow text-[#d0a140]">System notice</p><button onClick={() => setShowAlerts(false)} aria-label="Dismiss notice"><X className="size-3.5 text-[#8c806b]" /></button></div><p className="mt-2 text-xs leading-relaxed text-[#c1b6a2]">Network routing remains nominal. RNO-04 requires temperature watch review.</p><button className="mt-3 flex items-center gap-1 font-mono text-[10px] text-[#d9a943]">Review exception <ChevronDown className="size-3" /></button></div>}
    </main>
  )
}
