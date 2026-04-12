import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { sql } from 'drizzle-orm';
import Link from 'next/link';
import AdminCharts from './AdminCharts';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const allOrders = await db.select().from(orders).all();
  const allOrderItems = await db.select().from(orderItems).all();

  const totalRevenue = allOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalTips = allOrders.reduce((acc, o) => acc + o.tipAmount, 0);
  const totalTickets = allOrders.length;
  const avgTicket = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  // Aggregate item sales
  const itemCounts: Record<string, number> = {};
  for (const item of allOrderItems) {
     // Join manually since we just dumped all rows for simplicity
     const dbItem = await db.query.menuItems.findFirst({ where: (mi, { eq }) => eq(mi.id, item.menuItemId) });
     const name = dbItem?.name || `Item #${item.menuItemId}`;
     itemCounts[name] = (itemCounts[name] || 0) + item.qty;
  }
  const topItems = Object.entries(itemCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
  const orderTimeline = allOrders.slice(-20).map(o => ({
    name: `#${o.id}`,
    total: o.total || 0
  }));

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 gap-6 bg-[#f8fafc] text-black">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold text-gray-800">Management Dashboard</h1>
        <Link href="/pos/admin/menu" className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          Menu Configuration &rarr;
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 font-semibold mb-2">Gross Revenue</h3>
           <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 font-semibold mb-2">Collected Tips</h3>
           <p className="text-3xl font-bold text-green-600">${totalTips.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 font-semibold mb-2">Total Tickets</h3>
           <p className="text-3xl font-bold text-gray-900">{totalTickets}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 font-semibold mb-2">Avg. Ticket Size</h3>
           <p className="text-3xl font-bold text-blue-600">${avgTicket.toFixed(2)}</p>
        </div>
      </div>

      <AdminCharts topItems={topItems} orderTimeline={orderTimeline} />

      <div className="flex gap-6 mt-4">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Top Selling Items</h3>
           <div className="flex flex-col gap-3">
              {topItems.map(([name, qty], i) => (
                <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                   <div className="flex items-center gap-3">
                     <span className="text-gray-400 font-bold w-6">{i+1}.</span>
                     <span className="font-semibold text-gray-800">{name}</span>
                   </div>
                   <span className="text-gray-600 font-bold">{qty} sold</span>
                </div>
              ))}
              {topItems.length === 0 && <p className="text-gray-500">No items sold yet.</p>}
           </div>
        </div>

        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
           <div className="flex flex-col gap-3">
              {allOrders.reverse().slice(0, 5).map(o => (
                 <div key={o.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="font-bold">Order #{o.id}</span>
                      <span className="text-gray-400 text-sm ml-2">({o.source.toUpperCase()})</span>
                    </div>
                    <div className="font-semibold text-gray-800">
                      ${o.total?.toFixed(2)}
                      {o.status === 'paid' && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded tracking-wide">PAID</span>}
                    </div>
                 </div>
              ))}
              {allOrders.length === 0 && <p className="text-gray-500">No recent transactions.</p>}
           </div>
        </div>
      </div>

    </div>
  );
}
