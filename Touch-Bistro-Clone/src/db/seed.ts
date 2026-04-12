import { db } from './index';
import { staff, tables, menuCategories, menuItems, loyaltyAccounts, prepStations, orders, orderItems, kdsTickets, timeclocks, reservations, menuModifiers } from './schema';

async function seed() {
  console.log('Seeding Database...');

  // Clean up existing data to avoid duplicates if run multiple times
  await db.delete(orderItems);
  await db.delete(kdsTickets);
  await db.delete(orders);
  await db.delete(menuModifiers);
  await db.delete(menuItems);
  await db.delete(menuCategories);
  await db.delete(prepStations);
  await db.delete(timeclocks);
  await db.delete(reservations);
  await db.delete(tables);
  await db.delete(staff);
  await db.delete(loyaltyAccounts);

  console.log('Inserting Staff...');
  // 1. Seed Staff
  await db.insert(staff).values([
    { id: 1, name: 'Admin', pin: '1234', role: 'admin' },
    { id: 2, name: 'Server Darko', pin: '1111', role: 'server' },
  ]);

  console.log('Inserting Tables...');
  // 2. Seed Tables
  await db.insert(tables).values([
    { id: 1, name: '201', status: 'open' },
    { id: 2, name: '202', status: 'open' },
    { id: 3, name: '205', status: 'open' },
    { id: 4, name: 'Cash Register', status: 'open' },
  ]);

  console.log('Inserting Categories...');
  // 3. Seed Menu Categories
  await db.insert(menuCategories).values([
    { id: 1, name: 'Starters' },
    { id: 2, name: 'Mains' },
    { id: 3, name: 'Desserts' },
    { id: 4, name: 'Hot Drinks' },
    { id: 5, name: 'Cold & Soft Drinks' },
    { id: 6, name: 'Cocktails' },
    { id: 7, name: 'Spirits & Beer' },
  ]);

  console.log('Inserting Prep Stations...');
  // 4. Seed Prep Stations
  await db.insert(prepStations).values([
    { id: 1, name: 'Grill' },
    { id: 2, name: 'Expo' },
    { id: 3, name: 'Bar' },
  ]);

  console.log('Inserting Menu Items...');
  // 5. Seed Menu Items
  await db.insert(menuItems).values([
    // Starters (CategoryId: 1) -> Grill (1)
    { categoryId: 1, prepStationId: 1, name: 'Garlic Bread', price: 6.99, imageColor: '#d4a373' },
    { categoryId: 1, prepStationId: 1, name: 'Calamari', price: 11.99, imageColor: '#f4a261' },
    { categoryId: 1, prepStationId: 1, name: 'Bruschetta', price: 6.99, imageColor: '#bc4749' },
    { categoryId: 1, prepStationId: 1, name: 'Nachos', price: 13.99, imageColor: '#e09f3e' },
    { categoryId: 1, prepStationId: 1, name: 'Vegetable Spring Rolls', price: 10.00, imageColor: '#52796f' },

    // Mains (CategoryId: 2) -> Grill (1)
    { categoryId: 2, prepStationId: 1, name: 'Classic Burger + Fries', price: 14.99, imageColor: '#8b5a2b' },
    { categoryId: 2, prepStationId: 1, name: 'Vegetarian Burger + Fries', price: 11.99, imageColor: '#52796f' },
    { categoryId: 2, prepStationId: 1, name: 'Margarita Pizza', price: 15.99, imageColor: '#c1121f' },
    { categoryId: 2, prepStationId: 1, name: 'Pepperoni Pizza', price: 16.99, imageColor: '#c1121f' },
    { categoryId: 2, prepStationId: 1, name: 'Lasagna', price: 15.99, imageColor: '#bc4749' },
    { categoryId: 2, prepStationId: 1, name: 'Grilled Chicken Sandwich', price: 12.99, imageColor: '#e9c46a' },
    { categoryId: 2, prepStationId: 1, name: 'Caesar Salad', price: 9.99, imageColor: '#2a9d8f' },

    // Desserts (CategoryId: 3) -> Expo (2)
    { categoryId: 3, prepStationId: 2, name: 'Cheese Cake', price: 6.99, imageColor: '#8a4b62' },
    { categoryId: 3, prepStationId: 2, name: 'Chocolate Molten Lava Cake', price: 6.99, imageColor: '#4f3131' },
    { categoryId: 3, prepStationId: 2, name: 'Tiramisu', price: 7.99, imageColor: '#6a4a3c' },
    { categoryId: 3, prepStationId: 2, name: 'Apple Crumble', price: 5.99, imageColor: '#d4a373' },
    { categoryId: 3, prepStationId: 2, name: 'Strawberry Sundae', price: 4.99, imageColor: '#d90429' },
    { categoryId: 3, prepStationId: 2, name: 'Nutella Strawberry Banana Crepe', price: 6.99, imageColor: '#4f3131' },
    { categoryId: 3, prepStationId: 2, name: 'Banana Split', price: 5.99, imageColor: '#fee440' },
    { categoryId: 3, prepStationId: 2, name: 'Croissant', price: 2.50, imageColor: '#d4a373' },

    // Hot Drinks (CategoryId: 4) -> Bar (3)
    { categoryId: 4, prepStationId: 3, name: 'Coffee Americano', price: 2.75, imageColor: '#4a3b32' },
    { categoryId: 4, prepStationId: 3, name: 'Cappuccino', price: 3.99, imageColor: '#a98467' },
    { categoryId: 4, prepStationId: 3, name: 'Latte', price: 4.25, imageColor: '#adc178' },
    { categoryId: 4, prepStationId: 3, name: 'Espresso', price: 2.50, imageColor: '#281e19' },

    // Cold & Soft Drinks (CategoryId: 5) -> Bar (3)
    { categoryId: 5, prepStationId: 3, name: 'Cola', price: 2.99, imageColor: '#000000' },
    { categoryId: 5, prepStationId: 3, name: 'Lemon-Lime Soda', price: 2.99, imageColor: '#38b000' },
    { categoryId: 5, prepStationId: 3, name: 'Iced Tea', price: 3.25, imageColor: '#b08968' },
    { categoryId: 5, prepStationId: 3, name: 'Sparkling Water', price: 2.50, imageColor: '#48cae4' },

    // Cocktails (CategoryId: 6) -> Bar (3)
    { categoryId: 6, prepStationId: 3, name: 'Margarita', price: 7.99, imageColor: '#a7c957' },
    { categoryId: 6, prepStationId: 3, name: 'Bloody Mary', price: 7.99, imageColor: '#d90429' },
    { categoryId: 6, prepStationId: 3, name: 'Blue Lagoon', price: 7.99, imageColor: '#00b4d8' },
    { categoryId: 6, prepStationId: 3, name: 'Mojito', price: 6.99, imageColor: '#38b000' },
    { categoryId: 6, prepStationId: 3, name: 'Manhattan', price: 5.99, imageColor: '#bc4749' },
    { categoryId: 6, prepStationId: 3, name: 'Martini', price: 6.99, imageColor: '#edf2f4' },
    { categoryId: 6, prepStationId: 3, name: 'Singapore Sling', price: 6.99, imageColor: '#e5989b' },
    { categoryId: 6, prepStationId: 3, name: 'Pina Colada', price: 6.99, imageColor: '#fdf0d5' },

    // Spirits & Beer (CategoryId: 7) -> Bar (3)
    { categoryId: 7, prepStationId: 3, name: 'Vodka', price: 6.99, imageColor: '#e0e1dd' },
    { categoryId: 7, prepStationId: 3, name: 'Gin', price: 4.99, imageColor: '#caf0f8' },
    { categoryId: 7, prepStationId: 3, name: 'Rum', price: 4.99, imageColor: '#9c6644' },
    { categoryId: 7, prepStationId: 3, name: 'Scotch', price: 6.99, imageColor: '#b08968' },
    { categoryId: 7, prepStationId: 3, name: 'Beer (Pint)', price: 4.99, imageColor: '#f4a261' },
  ]);

  console.log('Inserting Loyalty Accounts...');
  // 6. Seed Loyalty
  await db.insert(loyaltyAccounts).values([
    { phone: '15559993434', name: 'Lana Avery', points: 198 },
  ]);

  console.log('Inserting Modifiers...');
  // 7. Seed Modifiers
  const allItems = await db.select().from(menuItems);
  const modifiersToInsert = [];
  
  for (const item of allItems) {
    if (item.categoryId === 1 || item.categoryId === 2) {
      modifiersToInsert.push({ menuItemId: item.id, name: 'Add Cheese', price: 1.00 });
      modifiersToInsert.push({ menuItemId: item.id, name: 'Gluten Free Options', price: 2.00 });
    }
    if (item.categoryId === 4 || item.categoryId === 5 || item.categoryId === 6) {
      modifiersToInsert.push({ menuItemId: item.id, name: 'No Ice', price: 0 });
      modifiersToInsert.push({ menuItemId: item.id, name: 'Light Ice', price: 0 });
      modifiersToInsert.push({ menuItemId: item.id, name: 'Extra Shot', price: 1.50 });
    }
  }
  
  if (modifiersToInsert.length > 0) {
    await db.insert(menuModifiers).values(modifiersToInsert);
  }

  console.log('Seeding Complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
