import { db } from './index';
import { staff, tables, menuCategories, menuItems, loyaltyAccounts, prepStations } from './schema';

async function seed() {
  console.log('Seeding Database...');

  // 1. Seed Staff
  await db.insert(staff).values([
    { id: 1, name: 'Admin', pin: '1234', role: 'admin' },
    { id: 2, name: 'Server Darko', pin: '1111', role: 'server' },
  ]);

  // 2. Seed Tables
  await db.insert(tables).values([
    { id: 1, name: '201', status: 'open' },
    { id: 2, name: '202', status: 'open' },
    { id: 3, name: '205', status: 'open' },
    { id: 4, name: 'Cash Register', status: 'open' },
  ]);

  // 3. Seed Menu Categories
  await db.insert(menuCategories).values([
    { id: 1, name: 'Food' },
    { id: 2, name: 'Dessert' },
    { id: 3, name: 'Drinks' },
  ]);

  // 4. Seed Prep Stations
  await db.insert(prepStations).values([
    { id: 1, name: 'Grill' },
    { id: 2, name: 'Expo' }
  ]);

  // 5. Seed Menu Items
  await db.insert(menuItems).values([
    { categoryId: 2, prepStationId: 2, name: 'Cheese Cake', price: 6.99, imageColor: '#8a4b62' },
    { categoryId: 2, prepStationId: 2, name: 'Chocolate Molten Lava Cake', price: 6.99, imageColor: '#4f3131' },
    { categoryId: 2, prepStationId: 2, name: 'Tiramisu', price: 7.99, imageColor: '#6a4a3c' },
    { categoryId: 2, prepStationId: 2, name: 'Apple Crumble', price: 5.99, imageColor: '#d4a373' },
    { categoryId: 1, prepStationId: 1, name: 'Nachos', price: 13.99, imageColor: '#e09f3e' },
    { categoryId: 1, prepStationId: 1, name: 'Vegetarian Burger', price: 11.99, imageColor: '#52796f' },
    { categoryId: 1, prepStationId: 1, name: 'Margarita Pizza', price: 15.99, imageColor: '#c1121f' },
    { categoryId: 3, prepStationId: null, name: 'Coffee Americano', price: 2.75, imageColor: '#4a3b32' } // Drinks ignore KDS
  ]);

  // 6. Seed Loyalty
  await db.insert(loyaltyAccounts).values([
    { phone: '15559993434', name: 'Lana Avery', points: 198 },
  ]);

  console.log('Seeding Complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
