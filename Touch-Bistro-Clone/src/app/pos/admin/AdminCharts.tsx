'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0d9488', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#10b981'];

export default function AdminCharts({ topItems, orderTimeline }: any) {
  // topItems is [name, qty]
  const pieData = topItems.map(([name, qty]: any) => ({ name, value: qty }));

  return (
    <div className="flex gap-6 mt-4 w-full h-[350px]">
       {/* BAR CHART */}
       <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Flow</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={orderTimeline} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                 <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                 <YAxis fontSize={12} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                 <Bar dataKey="total" fill="#0d9488" radius={[4,4,0,0]} />
               </BarChart>
            </ResponsiveContainer>
          </div>
       </div>

       {/* PIE CHART */}
       <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sales Mix (Top 5)</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry: any, index: number) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
}
