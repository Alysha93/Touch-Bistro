import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const prepStations = sqliteTable('prep_stations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const staff = sqliteTable('staff', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  pin: text('pin').notNull().unique(),
  role: text('role').notNull(),
});

export const tables = sqliteTable('tables', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  status: text('status').notNull().default('open'), // 'open', 'seated', 'paid'
});

export const menuCategories = sqliteTable('menu_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const menuItems = sqliteTable('menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categoryId: integer('category_id').references(() => menuCategories.id).notNull(),
  prepStationId: integer('prep_station_id').references(() => prepStations.id),
  name: text('name').notNull(),
  price: real('price').notNull(),
  imageColor: text('image_color'),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tableId: integer('table_id').references(() => tables.id),
  staffId: integer('staff_id').references(() => staff.id),
  status: text('status').notNull().default('open'),
  total: real('total').default(0),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  menuItemId: integer('menu_item_id').references(() => menuItems.id).notNull(),
  seatNumber: integer('seat_number').notNull().default(1),
  qty: integer('qty').notNull().default(1),
  unitPrice: real('unit_price').notNull(),
  prepStatus: text('prep_status').notNull().default('pending'), // 'pending', 'ready'
});

export const kdsTickets = sqliteTable('kds_tickets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  stationId: integer('station_id').references(() => prepStations.id).notNull(),
  status: text('status').notNull().default('new'), // 'new', 'in_progress', 'ready'
  createdAt: integer('created_at').notNull(), // standard unix timestamp
  completedAt: integer('completed_at'),
});

export const loyaltyAccounts = sqliteTable('loyalty_accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull(),
  points: integer('points').notNull().default(0),
});
