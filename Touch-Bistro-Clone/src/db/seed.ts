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
    { categoryId: 1, prepStationId: 1, name: 'Garlic Bread', price: 6.99, imageUrl: '/assets/menu/garlic_bread.png' },
    { categoryId: 1, prepStationId: 1, name: 'Calamari', price: 11.99, imageUrl: '/assets/menu/calamari.png' },
    { categoryId: 1, prepStationId: 1, name: 'Bruschetta', price: 6.99, imageUrl: '/assets/menu/bruschetta.png' },
    { categoryId: 1, prepStationId: 1, name: 'Nachos', price: 13.99, imageUrl: '/assets/menu/nachos.png' },
    { categoryId: 1, prepStationId: 1, name: 'Vegetable Spring Rolls', price: 10.00, imageUrl: '/assets/menu/spring_rolls.png' },

    // Mains (CategoryId: 2) -> Grill (1)
    { categoryId: 2, prepStationId: 1, name: 'Classic Burger + Fries', price: 14.99, imageUrl: '/assets/menu/classic_burger.png' },
    { categoryId: 2, prepStationId: 1, name: 'Vegetarian Burger + Fries', price: 11.99, imageUrl: '/assets/menu/veggie_burger.png' },
    { categoryId: 2, prepStationId: 1, name: 'Margarita Pizza', price: 15.99, imageUrl: '/assets/menu/margarita_pizza.png' },
    { categoryId: 2, prepStationId: 1, name: 'Pepperoni Pizza', price: 16.99, imageUrl: '/assets/menu/pepperoni_pizza.png' },
    { categoryId: 2, prepStationId: 1, name: 'Lasagna', price: 15.99, imageUrl: '/assets/menu/lasagna.png' },
    { categoryId: 2, prepStationId: 1, name: 'Grilled Chicken Sandwich', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 2, prepStationId: 1, name: 'Caesar Salad', price: 9.99, imageUrl: '/assets/menu/caesar_salad.png' },

    // Desserts (CategoryId: 3) -> Expo (2)
    { categoryId: 3, prepStationId: 2, name: 'Cheese Cake', price: 6.99, imageUrl: '/assets/menu/cheesecake.png' },
    { categoryId: 3, prepStationId: 2, name: 'Chocolate Molten Lava Cake', price: 6.99, imageUrl: '/assets/menu/lava_cake.png' },
    { categoryId: 3, prepStationId: 2, name: 'Tiramisu', price: 7.99, imageUrl: '/assets/menu/tiramisu.png' },
    { categoryId: 3, prepStationId: 2, name: 'Apple Crumble', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 3, prepStationId: 2, name: 'Strawberry Sundae', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 3, prepStationId: 2, name: 'Nutella Strawberry Banana Crepe', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 3, prepStationId: 2, name: 'Banana Split', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 3, prepStationId: 2, name: 'Croissant', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' },

    // Hot Drinks (CategoryId: 4) -> Bar (3)
    { categoryId: 4, prepStationId: 3, name: 'Coffee Americano', price: 2.75, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 4, prepStationId: 3, name: 'Cappuccino', price: 3.99, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 4, prepStationId: 3, name: 'Latte', price: 4.25, imageUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 4, prepStationId: 3, name: 'Espresso', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800' },

    // Cold & Soft Drinks (CategoryId: 5) -> Bar (3)
    { categoryId: 5, prepStationId: 3, name: 'Cola', price: 2.99, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 5, prepStationId: 3, name: 'Lemon-Lime Soda', price: 2.99, imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 5, prepStationId: 3, name: 'Iced Tea', price: 3.25, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 5, prepStationId: 3, name: 'Sparkling Water', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1551731589-cee04a53042d?auto=format&fit=crop&q=80&w=800' },

    // Cocktails (CategoryId: 6) -> Bar (3)
    { categoryId: 6, prepStationId: 3, name: 'Margarita', price: 7.99, imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 6, prepStationId: 3, name: 'Bloody Mary', price: 7.99, imageUrl: 'https://images.unsplash.com/photo-1541546339469-be3055b440b2?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 6, prepStationId: 3, name: 'Blue Lagoon', price: 7.99, imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 6, prepStationId: 3, name: 'Mojito', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 6, prepStationId: 3, name: 'Manhattan', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1582812351173-fb66c4293e87?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 6, prepStationId: 3, name: 'Martini', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1575023782549-63c0585bb3c7?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 6, prepStationId: 3, name: 'Singapore Sling', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 6, prepStationId: 3, name: 'Pina Colada', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1585225442642-c412e33bc830?auto=format&fit=crop&q=80&w=800' },

    // Spirits & Beer (CategoryId: 7) -> Bar (3)
    { categoryId: 7, prepStationId: 3, name: 'Vodka', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1550985052-54ac456f7374?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 7, prepStationId: 3, name: 'Gin', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1556855810-7f74511f068a?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 7, prepStationId: 3, name: 'Rum', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 7, prepStationId: 3, name: 'Scotch', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1527281483445-d933b4bb214a?auto=format&fit=crop&q=80&w=800' },
    { categoryId: 7, prepStationId: 3, name: 'Beer (Pint)', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800' },
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
