#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.log('Please create a .env file with your database connection string:');
  console.log('DATABASE_URL=postgresql://username:password@hostname:port/database_name');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up NASA Biology Research Database...');
    
    // Read and execute schema
    const schemaPath = join(__dirname, '../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating database schema...');
    await sql(schema);
    
    console.log('✅ Database schema created successfully!');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit http://localhost:4000');
    console.log('3. Click "Load Sample Data" to populate the database');
    console.log('');
    console.log('📊 Database tables created:');
    console.log('  • publications - Research publications and metadata');
    console.log('  • research_themes - Research theme categories');
    console.log('  • publication_themes - Many-to-many relationship');
    console.log('  • insights - AI-generated research insights');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();

