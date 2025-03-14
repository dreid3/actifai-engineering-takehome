# Actifai Engineering Takehome

## Introduction

You are an Actifai backend engineer managing a database of our users - who are call center agents - and the sales that
the users place using our application.

The database has 4 tables:

- `users`: who are the users (name, role)
- `groups`: groups of users
- `user_groups`: which users belong to which groups
- `sales`: who made a sale, for how much, and when was it made

The front-end team has decided to build an analytics and reporting dashboard to display information about performance
to our users. They are interested in tracking which users and groups are performing well (in terms of their sales). The
primary metric they have specified as a requirement is average revenue and total revenue by user and group, for a given
month.

Your job is to build the API that will deliver data to this dashboard. In addition to the stated requirements above, we
would like to see you think about what additional data/metrics would be useful to add.

At a minimum, write one endpoint that returns time series data for user sales i.e. a list of rows, where each row
corresponds to a time window and information about sales. When you design the endpoint, think  about what query
parameters and options you want to support, to allow flexibility for the front-end team.

## Codebase

This repository contains a bare-bones Node/Express server, which is defined in `server.js`. This file is where you will
define your endpoints.

## Getting started

1. Install Docker (if you don't already have it)
2. Run `npm i` to install dependencies
3. Run `docker-compose up` to compile and run the images.
4. You now have a database and server running on your machine. You can test it by navigating to `http://localhost:3000/health` in
your browser. You should see a "Hello World" message.


## Help

If you have any questions, feel free to reach out to your interview scheduler for clarification!


## API Endpoints  

### **1. User Sales**  
**Endpoint:** `GET /user_sales`  

**Description:**  
Retrieves sales data per user for a given month, including total sales, average sales, and the number of sales.  

**Query Parameters:**  
- `month` (string, required) – The month in `YYYY-MM` format.  
- `user_id` (integer, optional) – Filter by a specific user.  
- `group_id` (integer, optional) – Filter by a specific group.  

**Examples:**  

```
/user_sales?month=2021-01 
/user_sales?month=2021-01&user_id=1 
/user_sales?month=2021-01&group_id=1
```

### **2. Group Sales**  
**Endpoint:** `GET /group_sales`  

**Description:**  
Retrieves sales data per group for a given month, including total sales, average sales, and the number of sales.  

**Query Parameters:**  
- `month` (string, required) – The month in `YYYY-MM` format.  
- `group_id` (integer, optional) – Filter by a specific group.  

**Examples:**  

```
/group_sales?month=2021-01 
/group_sales?month=2021-01&group_id=1
```

### **3. User Sales (Date Range)**  
**Endpoint:** `GET /user_sales_range`  

**Description:**  
Retrieves sales data per user for a given date range, including total sales, average sales, and the number of sales.  

**Query Parameters:**  
- `start` (string, required) – Start date in `YYYY-MM-DD` format.  
- `end` (string, required) – End date in `YYYY-MM-DD` format.  
- `user_id` (integer, optional) – Filter by a specific user.  
- `group_id` (integer, optional) – Filter by a specific group.  

**Examples:**  

```
/user_sales_range?start=2021-01-01&end=2021-01-31 
/user_sales_range?start=2021-01-01&end=2021-01-31&user_id=1 
/user_sales_range?start=2021-01-01&end=2021-01-31&group_id=1
```