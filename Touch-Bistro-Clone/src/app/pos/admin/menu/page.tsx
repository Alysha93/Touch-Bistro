import { db } from '@/db';
import { menuItems, menuCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { toggleMenuItemAvailability } from './actions';

export default async function AdminMenuPage() {
  const categories = await db.select().from(menuCategories).all();
  const items = await db.select().from(menuItems).all();

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 gap-6 bg-[#f8fafc]" style={{ color: 'black' }}>
      <div className="flex space-between items-center w-full mb-4">
        <h1 className="text-2xl font-bold" style={{ color: 'black' }}>Menu Management Backend</h1>
        <p className="text-gray-500">Toggle items on or off ("86ing")</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {categories.map(cat => {
          const catItems = items.filter(i => i.categoryId === cat.id);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.id} className="mb-8">
              <h2 className="text-xl font-bold mb-4 capitalize">{cat.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {catItems.map(item => (
                  <div key={item.id} className="p-4 border rounded surface flex justify-between items-center gap-4">
                    <div>
                      <div className="font-bold text-lg">{item.name}</div>
                      <div className="text-gray-500">${item.price.toFixed(2)}</div>
                      {!item.isAvailable && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-bold uppercase tracking-wider mt-2 inline-block">86'd (Sold Out)</span>}
                    </div>
                    <form action={async () => {
                      'use server'
                      await toggleMenuItemAvailability(item.id, item.isAvailable);
                    }}>
                      <button className={`px-4 py-2 rounded font-bold text-white transition-opacity ${item.isAvailable ? 'bg-green-600' : 'bg-red-600'}`}>
                        {item.isAvailable ? 'Available' : 'Set Available'}
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
