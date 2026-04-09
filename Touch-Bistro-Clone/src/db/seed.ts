import { db } from './index';
import { staff, tables, menuCategories, menuItems, loyaltyAccounts } from './schema';

async function seed() {
  console.log('Seeding Database...');

  // 1. Seed Staff
  await db.insert(staff).values([
    { name: 'Admin', pin: '1234', role: 'admin' },
    { name: 'Server Darko', pin: '1111', role: 'server' },
  ]);

  // 2. Seed Tables
  await db.insert(tables).values([
    { name: '201', status: 'open' },
    { name: '202', status: 'open' },
    { name: '205', status: 'open' },
    { name: 'Cash Register', status: 'open' },
  ]);

  // 3. Seed Menu Categories
  await db.insert(menuCategories).values([
    { id: 1, name: 'Full Menu' },
    { id: 2, name: 'Breakfast' },
    { id: 3, name: 'Lunch' },
    { id: 4, name: 'Dinner' },
  ]);

  // 4. Seed Menu Items
  await db.insert(menuItems).values([
    { categoryId: 1, name: 'Cheese Cake', price: 6.99, imageColor: '#8a4b62' },
    { categoryId: 1, name: 'Chocolate Molten Lava Cake', price: 6.99, imageColor: '#4f3131' },
    { categoryId: 1, name: 'Tiramisu', price: 7.99, imageColor: '#6a4a3c' },
    { categoryId: 1, name: 'Apple Crumble', price: 5.99, imageColor: '#d4a373' },
    { categoryId: 1, name: 'Nachos', price: 13.99, imageColor: '#e09f3e' },
    { categoryId: 1, name: 'Vegetarian Burger', price: 11.99, imageColor: '#52796f' },
    { categoryId: 1, name: 'Margarita Pizza', price: 15.99, imageColor: '#c1121f' },
    { categoryId: 1, name: 'Coffee Americano', price: 2.75, imageColor: '#4a3b32' }
  ]);

  // 5. Seed Loyalty
  await db.insert(loyaltyAccounts).values([
    { phone: '15559993434', name: 'Lana Avery', points: 198 },
  ]);

  console.log('Seeding Complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
