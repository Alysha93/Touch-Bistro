import { getReservations, createReservation, assignTable, notifyGuest, completeReservation } from './actions';
import { db } from '@/db';
import { tables } from '@/db/schema';

export default async function ReservationsPage() {
  const waitlist = await getReservations();
  const allTables = await db.select().from(tables).all();

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 gap-6">
      <div className="flex space-between items-center w-full">
        <h1 className="text-2xl font-bold">Waitlist & Reservations</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', height: '100%', minHeight: 0 }}>
        
        {/* ADD TO WAITLIST */}
        <div className="surface p-4 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4">Add Guest</h2>
          <form action={createReservation} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Guest Name</label>
              <input type="text" name="name" required className="w-full p-3 rounded bg-[var(--bg-app)] border border-[var(--border-color)]" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
              <input type="tel" name="phone" required className="w-full p-3 rounded bg-[var(--bg-app)] border border-[var(--border-color)]" placeholder="555-0199" />
            </div>
             <div>
              <label className="text-sm text-gray-500 mb-1 block">Party Size</label>
              <select name="partySize" className="w-full p-3 rounded bg-[var(--bg-app)] border border-[var(--border-color)]">
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Guests</option>)}
              </select>
            </div>
            <button type="submit" className="mt-4 p-3 rounded font-bold text-white bg-[var(--primary)] text-lg">
              Add to Waitlist
            </button>
          </form>
        </div>

        {/* ACTIVE WAITLIST */}
        <div className="col-span-2 surface p-4 flex flex-col h-full overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Current Queue</h2>
          {waitlist.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">Waitlist is empty.</div>
          ) : (
             <div className="flex flex-col gap-3">
               {waitlist.map(({ reservation, tableName }) => (
                 <div key={reservation.id} className="p-4 rounded border border-[var(--border-color)] bg-[var(--bg-app)] flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold">{reservation.name} <span className="text-sm text-gray-400 ml-2 font-normal">({reservation.partySize} Guests)</span></div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                      {tableName && <div className="text-sm font-semibold text-yellow-600 mt-1">Reserved Table: {tableName}</div>}
                    </div>

                    <div className="flex gap-2">
                       {/* Dropdown to assign a table */}
                       <form action={async (formData) => {
                          'use server'
                          const tblId = formData.get('tableId') as string;
                          await assignTable(reservation.id, tblId ? parseInt(tblId) : null);
                       }} className="flex items-center gap-1">
                          <select name="tableId" className="p-2 rounded border border-[var(--border-color)] bg-white text-sm" defaultValue={reservation.tableId?.toString() || ""}>
                            <option value="">Assign Table...</option>
                            {allTables.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                          <button type="submit" className="p-2 bg-gray-200 rounded text-sm font-semibold">OK</button>
                       </form>

                       {/* Notify Guest simulated SMS */}
                       <form action={async () => {
                         'use server'
                         await notifyGuest(reservation.id, reservation.phone, reservation.name);
                       }}>
                         <button className={`p-2 rounded border font-semibold text-sm ${reservation.notified ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                           {reservation.notified ? '✓ Pinged' : 'Ping Guest'}
                         </button>
                       </form>
                       
                       {/* Seat Guest (Complete) */}
                       <form action={async () => {
                         'use server';
                         await completeReservation(reservation.id, reservation.tableId);
                       }}>
                         <button className="p-2 rounded bg-blue-600 text-white font-semibold text-sm">
                           Seat Table
                         </button>
                       </form>
                    </div>
                 </div>
               ))}
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
