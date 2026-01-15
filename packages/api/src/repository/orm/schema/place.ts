import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const place = sqliteTable('place', {
    id: text('id').primaryKey(),
    raceType: text('race_type').notNull(),
    dateTime: text('date_time').notNull(),
    locationName: text('location_name').notNull(),
    createdAt: text('created_at'),
    updatedAt: text('updated_at'),
});
