'use strict';

const express = require('express');
const seeder = require('./seed');
const { Pool } = require('pg');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'actifai',
  password: 'pass',
  port: 5432,
});

const BASE_QUERY =  `
  SUM(sales.amount) AS total_revenue,
  AVG(sales.amount) AS average_revenue,
  COUNT(sales.id) AS sales_count
  FROM sales
  JOIN users ON sales.user_id = users.id
  LEFT JOIN user_groups ON users.id = user_groups.user_id
  LEFT JOIN groups ON user_groups.group_id = groups.id`;

async function start() {
  // Seed the database
  await seeder.seedDatabase();

  // App
  const app = express();

  // Health check
  app.get('/health', (req, res) => {
    res.send('Hello World');
  });

  // Write your endpoints here
  // Sales data by user for a month endpoint
  app.get('/user_sales', async (req, res) => {
    try {
      const { month, user_id, group_id } = req.query;
      if (!month) {
        return res.status(400).json({ error: 'Month parameter is required (YYYY-MM)' });
      }

      let select = "SELECT users.id as user_id, array_agg(DISTINCT groups.id) as group_ids, users.name as user_name," 
      let where = " WHERE DATE_TRUNC('month', sales.date) = $1"
      let query = select + BASE_QUERY + where

      const params = [month + '-01'];
      if (user_id) {
        query += ' AND users.id = $2';
        params.push(user_id);
      } else if (group_id) {
        query += ' AND groups.id = $2';
        params.push(group_id);
      }
      
      query += ' GROUP BY users.id, users.name ORDER BY total_revenue DESC';
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user sales data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Sales data by group for a month endpoint
  app.get('/group_sales', async (req, res) => {
    try {
      const { month, user_id, group_id } = req.query;
      if (!month) {
        return res.status(400).json({ error: 'Month parameter is required (YYYY-MM)' });
      }

      let select = "SELECT groups.id as group_id, array_agg(DISTINCT users.id) as user_ids, string_agg(DISTINCT users.name, ', ') as user_names,"
      let where = " WHERE DATE_TRUNC('month', sales.date) = $1"
      let query = select + BASE_QUERY + where

      const params = [month + '-01'];
      if (group_id) {
        query += ' AND groups.id = $2';
        params.push(group_id);
      }
      
      query += ' GROUP BY groups.id ORDER BY total_revenue DESC';
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching group sales data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Sales data by user for a date range endpoint
  app.get('/user_sales_range', async (req, res) => {
    try {
      const { start, end, user_id, group_id } = req.query;
      if (!start || !end) {
        return res.status(400).json({ error: 'Start and End parameter are required (YYYY-MM-DD)' });
      }

      let select = "SELECT users.id as user_id, array_agg(DISTINCT groups.id) as group_ids, users.name as user_name," 
      let where = " WHERE sales.date >= $1 and sales.date < $2"
      let query = select + BASE_QUERY + where

      const params = [start, end];
      if (user_id) {
        query += ' AND users.id = $3';
        params.push(user_id);
      } else if (group_id) {
        query += ' AND groups.id = $3';
        params.push(group_id);
      }
      
      query += ' GROUP BY users.id, users.name ORDER BY total_revenue DESC';
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user sales data for date range:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.listen(PORT, HOST);
  console.log(`Server is running on http://${HOST}:${PORT}`);
}

start();
