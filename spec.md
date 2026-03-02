# Project Specification: E-commerce Admin Panel (Customized from TailAdmin)

## 1. Project Context
- **Base Source**: TailAdmin (React + Tailwind CSS).
- **Goal**: Refactor and customize the existing dashboard into a comprehensive E-commerce Management System.
- **Theme**: Professional, Clean, and Data-driven.

## 2. Visual Identity & UI Customization
- **Primary Color**: Indigo (#4F46E5) or Emerald (#10B981) for a modern retail feel.
- **Components**: 
  - Use `Lucide-react` for consistent, thin-stroke icons.
  - Implement rounded corners (`rounded-sm` or `rounded-md`) for a sharp, enterprise look.
  - Sticky Sidebar and Header (standard TailAdmin) but with refined padding.

## 3. Core E-commerce Modules (The "Must-Haves")

### A. Dashboard Overview (Statistics)
- **Key Metrics Cards**: Total Revenue, Total Orders, Average Order Value (AOV), and New Customers.
- **Charts**: 
  - Revenue Trend (Area Chart - ApexCharts).
  - Sales by Category (Donut Chart).
  - Top Selling Products (Simple List with progress bars).

### B. Product Management
- **Product List Table**: Image, Product Name, SKU, Category, Price, Stock Status (In Stock/Out of Stock/Low Stock), and Actions.
- **Add/Edit Product Form**: Multi-step or grouped sections (General Info, Media Upload, Pricing, Inventory, SEO).

### C. Order Management
- **Order Status Workflow**: Pending, Processing, Shipped, Delivered, Cancelled.
- **Order Details View**: Customer info, Shipping address, Itemized list, Payment status, and Timeline tracking.

### D. Customer Management
- List of customers with total spent, order history, and contact details.

## 4. Technical Refactoring Requirements
- **Structure**: Maintain TailAdmin's folder structure (`src/components`, `src/pages`, `src/layout`).
- **Props & State**: Use React functional components. Prepare for API integration by using clean `useEffect` and `useState` hooks for mock data.
- **Tailwind Strategy**: Use `@apply` for repetitive UI patterns to keep the JSX clean.
- **Responsiveness**: Ensure the product tables and forms are mobile-friendly (horizontal scroll for tables).

## 5. Specific Tasks for Claude
1. **Refactor the Sidebar**: Replace generic links with "Products", "Orders", "Customers", "Marketing", and "Analytics".
2. **Create E-commerce Tables**: Build a reusable "DataTable" component with search, filter, and pagination.
3. **Status Badges**: Create a standard Badge component for "Paid", "Pending", "Success" using Tailwind colors.
4. **Mock Data**: Generate realistic JSON objects for products and orders.