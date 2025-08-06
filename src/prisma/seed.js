const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample institutions
  const institution1 = await prisma.institution.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Universidad de Cádiz',
      address: 'Calle Ancha, 16, 11001 Cádiz, Spain',
      studentEmailSuffix: '@alum.uca.es',
      teacherEmailSuffix: '@uca.es'
    },
  });

  const institution2 = await prisma.institution.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Universidad de Sevilla',
      address: 'Calle San Fernando, 4, 41004 Sevilla, Spain',
      studentEmailSuffix: '@alum.us.es',
      teacherEmailSuffix: '@us.es'
    },
  });

  const institution3 = await prisma.institution.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Tech University',
      address: '123 Tech Street, Silicon Valley, CA',
      studentEmailSuffix: '@student.tech.edu',
      teacherEmailSuffix: '@tech.edu'
    },
  });

  console.log('✅ Institutions created');

  // Create sample challenges
  const challenges = [
    {
      statement: "Write a SQL query to select all employees from the 'employees' table who have a salary greater than 50000.",
      help: "Use the WHERE clause to filter records based on salary condition.",
      solution: "SELECT * FROM employees WHERE salary > 50000;",
      level: 1,
      score: 100,
      score_base: 100,
      score_min: 50,
      institution_id: 1
    },
    {
      statement: "Find the average salary for each department in the 'employees' table. Group the results by department.",
      help: "Use GROUP BY to group results by department and AVG() function for average calculation.",
      solution: "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department;",
      level: 2,
      score: 150,
      score_base: 150,
      score_min: 75,
      institution_id: 1
    },
    {
      statement: "Write a query to find employees who work in departments with more than 5 employees. Use a subquery.",
      help: "First find departments with >5 employees, then select employees from those departments.",
      solution: "SELECT * FROM employees WHERE department IN (SELECT department FROM employees GROUP BY department HAVING COUNT(*) > 5);",
      level: 3,
      score: 200,
      score_base: 200,
      score_min: 100,
      institution_id: 1
    },
    {
      statement: "Create a query that shows the top 3 highest-paid employees from each department using window functions.",
      help: "Use ROW_NUMBER() window function partitioned by department and ordered by salary descending.",
      solution: "SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rn FROM employees) ranked WHERE rn <= 3;",
      level: 4,
      score: 250,
      score_base: 250,
      score_min: 125,
      institution_id: 3
    },
    {
      statement: "Write a complex query to find employees who have the same salary as at least one other employee in a different department.",
      help: "Use self-join to compare employees across different departments.",
      solution: "SELECT DISTINCT e1.* FROM employees e1 JOIN employees e2 ON e1.salary = e2.salary WHERE e1.department != e2.department;",
      level: 5,
      score: 300,
      score_base: 300,
      score_min: 150,
      institution_id: 3
    },
    {
      statement: "Find all customers who have placed orders in the last 30 days and calculate their total order value.",
      help: "Use DATE functions to filter recent orders and SUM() for total calculation.",
      solution: "SELECT customer_id, SUM(order_value) as total_value FROM orders WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) GROUP BY customer_id;",
      level: 2,
      score: 150,
      score_base: 150,
      score_min: 75,
      institution_id: 1
    },
    {
      statement: "Create a query to identify products that have never been ordered by any customer.",
      help: "Use LEFT JOIN and check for NULL values in the orders table.",
      solution: "SELECT p.* FROM products p LEFT JOIN order_items oi ON p.product_id = oi.product_id WHERE oi.product_id IS NULL;",
      level: 3,
      score: 200,
      score_base: 200,
      score_min: 100,
      institution_id: 3
    },
    {
      statement: "Write a query to find the month with the highest total sales for each year in the last 5 years.",
      help: "Use window functions with PARTITION BY year and ORDER BY total_sales DESC.",
      solution: "SELECT * FROM (SELECT YEAR(order_date) as year, MONTH(order_date) as month, SUM(order_value) as total_sales, ROW_NUMBER() OVER (PARTITION BY YEAR(order_date) ORDER BY SUM(order_value) DESC) as rn FROM orders WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR) GROUP BY YEAR(order_date), MONTH(order_date)) ranked WHERE rn = 1;",
      level: 5,
      score: 300,
      score_base: 300,
      score_min: 150,
      institution_id: 3
    }
  ];

  for (const challenge of challenges) {
    await prisma.challenge.create({
      data: challenge,
    });
  }

  console.log('✅ Challenges created');

  // Create sample lessons
  const lessons = [
    {
      title: "Introduction to SQL",
      content: `# Introduction to SQL

## What is SQL?

SQL (Structured Query Language) is a standard language for storing, manipulating, and retrieving data in relational database systems.

## Key Concepts

### 1. Databases
A database is a collection of organized data that can be easily accessed, managed, and updated.

### 2. Tables
Tables are the basic building blocks of a database. They store data in rows and columns.

### 3. Queries
Queries are requests for data from a database. They allow you to:
- Retrieve specific data
- Filter results
- Sort information
- Join multiple tables

## Basic SQL Commands

### SELECT
The SELECT statement is used to retrieve data from a database.

\`\`\`sql
SELECT column1, column2 FROM table_name;
\`\`\`

### WHERE
The WHERE clause is used to filter records.

\`\`\`sql
SELECT * FROM users WHERE age > 18;
\`\`\`

### ORDER BY
The ORDER BY clause is used to sort the result set.

\`\`\`sql
SELECT * FROM products ORDER BY price DESC;
\`\`\`

## Practice Examples

Try these simple queries to get started:

1. Select all users from the users table
2. Find products with price greater than $50
3. Sort employees by salary in descending order

Remember: SQL is not case-sensitive, but it's a good practice to write keywords in uppercase for better readability.`,
      description: "Learn the fundamentals of SQL and basic query syntax",
      order: 1,
      isPublished: true,
      institution_id: 1,
      creator_id: 1
    },
    {
      title: "Advanced SQL Joins",
      content: `# Advanced SQL Joins

## Understanding Joins

Joins are used to combine rows from two or more tables based on a related column between them.

## Types of Joins

### 1. INNER JOIN
Returns records that have matching values in both tables.

\`\`\`sql
SELECT orders.order_id, customers.customer_name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.customer_id;
\`\`\`

### 2. LEFT JOIN
Returns all records from the left table and matching records from the right table.

\`\`\`sql
SELECT customers.customer_name, orders.order_id
FROM customers
LEFT JOIN orders ON customers.customer_id = orders.customer_id;
\`\`\`

### 3. RIGHT JOIN
Returns all records from the right table and matching records from the left table.

\`\`\`sql
SELECT customers.customer_name, orders.order_id
FROM customers
RIGHT JOIN orders ON customers.customer_id = orders.customer_id;
\`\`\`

### 4. FULL OUTER JOIN
Returns all records when there is a match in either left or right table.

\`\`\`sql
SELECT customers.customer_name, orders.order_id
FROM customers
FULL OUTER JOIN orders ON customers.customer_id = orders.customer_id;
\`\`\`

## Complex Join Examples

### Multiple Table Joins
\`\`\`sql
SELECT 
    customers.customer_name,
    products.product_name,
    orders.quantity,
    orders.order_date
FROM orders
JOIN customers ON orders.customer_id = customers.customer_id
JOIN products ON orders.product_id = products.product_id
WHERE orders.order_date >= '2024-01-01';
\`\`\`

### Self Joins
\`\`\`sql
SELECT 
    e1.employee_name AS employee,
    e2.employee_name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.employee_id;
\`\`\`

## Best Practices

1. Always use table aliases for better readability
2. Be explicit about join types
3. Use appropriate indexes for better performance
4. Test your joins with small datasets first`,
      description: "Master different types of SQL joins for complex data relationships",
      order: 2,
      isPublished: true,
      institution_id: 1,
      creator_id: 1
    },
    {
      title: "SQL Aggregation Functions",
      content: `# SQL Aggregation Functions

## What are Aggregation Functions?

Aggregation functions perform calculations on a set of values and return a single value. They are commonly used with the GROUP BY clause.

## Common Aggregation Functions

### 1. COUNT()
Counts the number of rows.

\`\`\`sql
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT department) FROM employees;
\`\`\`

### 2. SUM()
Returns the sum of all values in a column.

\`\`\`sql
SELECT SUM(salary) FROM employees;
SELECT SUM(quantity * price) FROM order_items;
\`\`\`

### 3. AVG()
Returns the average of all values in a column.

\`\`\`sql
SELECT AVG(salary) FROM employees;
SELECT AVG(price) FROM products WHERE category = 'Electronics';
\`\`\`

### 4. MAX() and MIN()
Return the maximum and minimum values respectively.

\`\`\`sql
SELECT MAX(salary) FROM employees;
SELECT MIN(price) FROM products;
\`\`\`

## GROUP BY Clause

The GROUP BY clause groups rows that have the same values in specified columns.

\`\`\`sql
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department;
\`\`\`

## HAVING Clause

The HAVING clause is used to filter groups after the GROUP BY clause.

\`\`\`sql
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;
\`\`\`

## Complex Examples

### Multiple Aggregations
\`\`\`sql
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MAX(price) as max_price,
    MIN(price) as min_price
FROM products
GROUP BY category
ORDER BY avg_price DESC;
\`\`\`

### Conditional Aggregations
\`\`\`sql
SELECT 
    department,
    COUNT(*) as total_employees,
    COUNT(CASE WHEN salary > 50000 THEN 1 END) as high_earners,
    AVG(CASE WHEN gender = 'F' THEN salary END) as avg_female_salary
FROM employees
GROUP BY department;
\`\`\`

## Performance Tips

1. Use indexes on columns used in GROUP BY
2. Be mindful of the order of operations: WHERE → GROUP BY → HAVING → ORDER BY
3. Use appropriate data types for better performance`,
      description: "Learn to use aggregation functions for data analysis and reporting",
      order: 3,
      isPublished: true,
      institution_id: 1,
      creator_id: 1
    }
  ];

  for (const lesson of lessons) {
    await prisma.lesson.create({
      data: lesson,
    });
  }

  console.log('✅ Lessons created');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 