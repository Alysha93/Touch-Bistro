import { db } from './index';
import { staff, tables, menuCategories, menuItems, loyaltyAccounts, prepStations, orders, orderItems, kdsTickets, timeclocks, reservations, menuModifiers } from './schema';

async function seed() {
  console.log('Seeding Database...');

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
  await db.insert(staff).values([
    { id: 1, name: 'Admin',       pin: '1234', role: 'admin',   hourlyRate: 35.0 },
    { id: 2, name: 'Server Darko',pin: '1111', role: 'server',  hourlyRate: 18.0 },
    { id: 3, name: 'Chef Gordon', pin: '8888', role: 'kitchen', hourlyRate: 45.0 },
  ]);

  console.log('Inserting Tables...');
  await db.insert(tables).values([
    { id: 1, name: '201',           status: 'open' },
    { id: 2, name: '202',           status: 'open' },
    { id: 3, name: '205',           status: 'open' },
    { id: 4, name: 'Cash Register', status: 'open' },
  ]);

  console.log('Inserting Categories...');
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
  await db.insert(prepStations).values([
    { id: 1, name: 'Grill' },
    { id: 2, name: 'Expo' },
    { id: 3, name: 'Bar' },
  ]);

  console.log('Inserting Menu Items...');
  await db.insert(menuItems).values([
    // --- Starters ---
    { id: 1,  categoryId: 1, prepStationId: 1, name: 'Garlic Bread',            price: 6.99,  imageUrl: '/assets/menu/garlic_bread.png', allergenInfo: 'Dairy, Gluten' },
    { id: 2,  categoryId: 1, prepStationId: 1, name: 'Calamari',                price: 11.99, imageUrl: '/assets/menu/calamari.png', allergenInfo: 'Shellfish' },
    { id: 3,  categoryId: 1, prepStationId: 1, name: 'Bruschetta',              price: 6.99,  imageUrl: '/assets/menu/bruschetta.png', allergenInfo: 'Gluten' },
    { id: 4,  categoryId: 1, prepStationId: 1, name: 'Nachos',                  price: 13.99, imageUrl: '/assets/menu/nachos.png', allergenInfo: 'Dairy' },
    { id: 5,  categoryId: 1, prepStationId: 1, name: 'Vegetable Spring Rolls',  price: 10.00, imageUrl: '/assets/menu/spring_rolls.png', allergenInfo: 'Soy' },
    { id: 14, categoryId: 1, prepStationId: 1, name: 'Caesar Salad',            price: 12.99, imageUrl: '/assets/menu/caesar_salad.png', allergenInfo: 'Dairy, Eggs' },

    // --- Mains ---
    { id: 6,  categoryId: 2, prepStationId: 1, name: 'Classic Burger + Fries',    price: 17.99, imageUrl: '/assets/menu/classic_burger.png', allergenInfo: 'Gluten, Dairy' },
    { id: 7,  categoryId: 2, prepStationId: 1, name: 'Vegetarian Burger + Fries', price: 16.99, imageUrl: '/assets/menu/veggie_burger.png', allergenInfo: 'Gluten, Soy' },
    { id: 8,  categoryId: 2, prepStationId: 1, name: 'Margarita Pizza',           price: 15.99, imageUrl: '/assets/menu/margarita_pizza.png', allergenInfo: 'Gluten, Dairy' },
    { id: 9,  categoryId: 2, prepStationId: 1, name: 'Pepperoni Pizza',           price: 18.99, imageUrl: '/assets/menu/pepperoni_pizza.png', allergenInfo: 'Gluten, Dairy' },
    { id: 10, categoryId: 2, prepStationId: 1, name: 'Lasagna',                   price: 16.99, imageUrl: '/assets/menu/lasagna.png', allergenInfo: 'Gluten, Dairy' },
    { id: 15, categoryId: 2, prepStationId: 1, name: 'Grilled Salmon',            price: 24.99, imageUrl: '/assets/menu/grilled_salmon.png', allergenInfo: 'Fish' },
    { id: 16, categoryId: 2, prepStationId: 1, name: 'Ribeye Steak',              price: 32.99, imageUrl: '/assets/menu/ribeye_steak.png', allergenInfo: 'None' },

    // --- Desserts ---
    { id: 11, categoryId: 3, prepStationId: 2, name: 'Cheese Cake',                price: 8.99, imageUrl: '/assets/menu/cheesecake.png', allergenInfo: 'Dairy, Eggs' },
    { id: 12, categoryId: 3, prepStationId: 2, name: 'Chocolate Molten Lava Cake', price: 9.99, imageUrl: '/assets/menu/lava_cake.png', allergenInfo: 'Dairy, Eggs' },
    { id: 13, categoryId: 3, prepStationId: 2, name: 'Tiramisu',                   price: 8.99, imageUrl: '/assets/menu/tiramisu.png', allergenInfo: 'Dairy, Caffeine' },
    { id: 17, categoryId: 3, prepStationId: 2, name: 'Apple Crumble',              price: 7.99, imageUrl: '/assets/menu/apple_crumble.png', allergenInfo: 'Gluten' },

    // --- Hot Drinks ---
    { id: 18, categoryId: 4, prepStationId: 3, name: 'Espresso',             price: 3.50, imageUrl: '/assets/menu/espresso.png', allergenInfo: 'Caffeine' },
    { id: 19, categoryId: 4, prepStationId: 3, name: 'Cappuccino',           price: 4.50, imageUrl: '/assets/menu/cappuccino.png', allergenInfo: 'Dairy, Caffeine' },
    { id: 20, categoryId: 4, prepStationId: 3, name: 'Caffé Latte',         price: 4.50, imageUrl: '/assets/menu/latte.png', allergenInfo: 'Dairy, Caffeine' },
    { id: 21, categoryId: 4, prepStationId: 3, name: 'Americano',            price: 3.99, imageUrl: '/assets/menu/americano.png', allergenInfo: 'Caffeine' },
    { id: 22, categoryId: 4, prepStationId: 3, name: 'Herbal Tea Selection', price: 3.50, imageUrl: '/assets/menu/herbal_tea.png', allergenInfo: 'None' },

    // --- Cold & Soft Drinks ---
    { id: 23, categoryId: 5, prepStationId: 3, name: 'Classic Coca-Cola',       price: 2.99, imageUrl: '/assets/menu/coca_cola.png', allergenInfo: 'Sugar' },
    { id: 24, categoryId: 5, prepStationId: 3, name: 'Sprite',                  price: 2.99, imageUrl: '/assets/menu/sprite.png', allergenInfo: 'Sugar' },
    { id: 25, categoryId: 5, prepStationId: 3, name: 'Homemade Lemonade',       price: 4.50, imageUrl: '/assets/menu/lemonade.png', allergenInfo: 'Citrus' },
    { id: 26, categoryId: 5, prepStationId: 3, name: 'Peach Iced Tea',          price: 3.99, imageUrl: '/assets/menu/iced_tea.png', allergenInfo: 'Sugar' },
    { id: 27, categoryId: 5, prepStationId: 3, name: 'Sparkling Mineral Water', price: 3.50, imageUrl: '/assets/menu/mineral_water.png', allergenInfo: 'None' },

    // --- Cocktails ---
    { id: 28, categoryId: 6, prepStationId: 3, name: 'Classic Mojito',     price: 12.00, imageUrl: '/assets/menu/mojito.png', allergenInfo: 'Alcohol' },
    { id: 29, categoryId: 6, prepStationId: 3, name: 'Espresso Martini',   price: 14.00, imageUrl: '/assets/menu/espresso_martini.png', allergenInfo: 'Alcohol, Caffeine' },
    { id: 30, categoryId: 6, prepStationId: 3, name: 'Old Fashioned',      price: 13.00, imageUrl: '/assets/menu/old_fashioned.png', allergenInfo: 'Alcohol' },
    { id: 31, categoryId: 6, prepStationId: 3, name: 'Signature Margarita',price: 12.50, imageUrl: '/assets/menu/signature_margarita.png', allergenInfo: 'Alcohol' },

    // --- Spirits & Beer ---
    { id: 32, categoryId: 7, prepStationId: 3, name: 'Craft Draft Beer',      price: 7.50,  imageUrl: 'https://images.unsplash.com/photo-1541014529323-288277207604?q=80&w=800&auto=format&fit=crop', allergenInfo: 'Alcohol, Gluten' },
    { id: 33, categoryId: 7, prepStationId: 3, name: 'Cabernet Sauvignon',    price: 11.00, imageUrl: 'https://images.unsplash.com/photo-1553135049-2f10705a6206?q=80&w=800&auto=format&fit=crop', allergenInfo: 'Alcohol' },
    { id: 34, categoryId: 7, prepStationId: 3, name: 'Chardonnay',            price: 10.50, imageUrl: 'https://images.unsplash.com/photo-1563260797-cb5cd70254c8?q=80&w=800&auto=format&fit=crop', allergenInfo: 'Alcohol' },
    { id: 35, categoryId: 7, prepStationId: 3, name: 'Single Malt Whiskey',   price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1582819509237-753c90ef4036?q=80&w=800&auto=format&fit=crop', allergenInfo: 'Alcohol' },

  ]);

  console.log('Inserting Sample Analytics Data...');
  const now = Date.now();
  await db.insert(timeclocks).values([
    { staffId: 1, clockIn: now - 36000000, clockOut: now - 18000000 },
    { staffId: 2, clockIn: now - 28800000 },
    { staffId: 3, clockIn: now - 32400000, clockOut: now - 3600000 },
  ]);

  await db.insert(orders).values([
    { id: 1, tableId: 1, staffId: 2, status: 'paid', total: 45.97 },
    { id: 2, tableId: 2, staffId: 2, status: 'paid', total: 32.50 },
  ]);

  await db.insert(orderItems).values([
    { orderId: 1, menuItemId: 6,  name: 'Classic Burger + Fries',      qty: 2, unitPrice: 14.99 },
    { orderId: 1, menuItemId: 1,  name: 'Garlic Bread',                qty: 1, unitPrice: 6.99 },
    { orderId: 2, menuItemId: 8,  name: 'Margarita Pizza',             qty: 1, unitPrice: 15.99 },
    { orderId: 2, menuItemId: 12, name: 'Chocolate Molten Lava Cake',  qty: 1, unitPrice: 6.99 },
  ]);

  console.log('Seeding Complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
