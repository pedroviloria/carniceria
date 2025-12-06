# CLAUDE.md - Carnicería POS System

## Project Overview

**Carnicería** is a web-based Point-of-Sale (POS) system designed for butcher shops. It's a single-page application that handles product management, sales transactions with weight-based pricing, invoice generation, and sales reporting.

### Tech Stack
- **Frontend**: Pure HTML5, JavaScript (ES6+), CSS
- **Styling**: TailwindCSS (via CDN)
- **Data Storage**: Browser localStorage
- **Language**: Spanish (UI and comments)
- **No Build Process**: Runs directly in browser, no compilation required

## Repository Structure

```
carniceria/
├── index.html          # Complete application (all-in-one file)
├── README.md          # Basic project description
└── CLAUDE.md          # This file
```

### Single-File Architecture

This is a **monolithic single-file application**. All HTML, CSS, and JavaScript code is contained within `index.html`. This design choice prioritizes:
- Simplicity and portability
- Easy deployment (just open in browser)
- No build tooling required
- Self-contained functionality

## Core Features

### 1. Authentication System
- **Admin User**: `admin` / `admin123`
  - Full access to product management
  - Sales history and analytics
  - Scale configuration
- **Vendor User**: `vendedor` / `vendedor123`
  - Limited to sales operations only

Location in code: `login()` function (lines 552-568)

### 2. Product Management (Admin Only)
- Add/delete products
- Set price per kilogram
- Categorize products (Res, Cerdo, Pollo, Cordero, Otros)
- Persistent storage via localStorage

Location in code: `addProduct()` and `deleteProduct()` functions (lines 890-956)

### 3. Weight Scale Integration
Two modes:
- **Automatic Mode**: Simulated weight readings (for demo/development)
- **Manual Mode**: Manual weight entry

Location in code: `setWeightMode()` and `startAutoWeightSimulation()` (lines 681-709)

**Important**: Real serial scale integration requires backend implementation. Current version uses simulated weights.

### 4. Sales Process
1. Select product from catalog
2. Weigh product (auto or manual)
3. Add to cart
4. Process checkout
5. Generate invoice

Location in code: Sales flow spans lines 729-888

### 5. Invoice System
- Auto-incrementing invoice numbers
- Printable invoices
- Detailed line items with weights and subtotals
- Stored in sales history

Location in code: `showInvoice()` function (lines 829-876)

### 6. Sales Analytics & Reporting
- Daily sales totals
- Historical sales data
- Filtering by date range and user
- CSV export functionality
- Printable reports

Location in code: Analytics section (lines 978-1144)

## Data Persistence

### localStorage Keys

| Key | Description | Data Type |
|-----|-------------|-----------|
| `carniceria_products` | Product catalog | Array of product objects |
| `carniceria_scaleConfig` | Scale settings | Configuration object |
| `carniceria_invoiceCounter` | Next invoice number | Integer |
| `carniceria_salesHistory` | All transactions | Array of sale objects |

### Data Models

**Product Object**:
```javascript
{
  id: Number,           // Timestamp-based unique ID
  name: String,         // Product name
  price: Number,        // Price per kilogram
  category: String      // Product category
}
```

**Cart Item**:
```javascript
{
  product: Product,     // Product object
  weight: Number,       // Weight in kg
  subtotal: Number      // Calculated price
}
```

**Sale Object**:
```javascript
{
  invoiceNumber: String,  // Zero-padded 6-digit number
  date: String,          // ISO 8601 timestamp
  user: String,          // User who made the sale
  items: Array,          // Cart items
  total: Number          // Total sale amount
}
```

## Development Guidelines

### Code Style & Conventions

1. **Language**: Spanish for UI text, function names use English
2. **Currency**: Colombian Peso (COP) format - `$X.XX`
3. **Weight Units**: Kilograms (kg) with 2 decimal precision
4. **Date Format**: Colombian locale (`es-CO`)

### Making Changes

#### Adding New Features

Since this is a single-file app, all changes go in `index.html`. Structure your additions:

1. **HTML**: Add markup in appropriate section (sales, admin, modals)
2. **CSS**: Add styles in `<style>` tag (lines 8-20) or use Tailwind classes
3. **JavaScript**: Add functions in the `<script>` section (lines 483-1148)

#### Modifying Existing Features

**Before editing**, understand the data flow:
```
User Action → Event Handler → State Update → localStorage → UI Update
```

Key state variables (lines 484-495):
- `currentUser` - Logged in user name
- `userRole` - 'admin' or 'vendedor'
- `products` - Product catalog array
- `cart` - Current shopping cart
- `salesHistory` - All sales records

#### Testing Changes

1. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge)
2. Use browser DevTools to:
   - Check console for errors
   - Inspect localStorage data
   - Test responsive design
3. Test both user roles:
   - Admin features
   - Vendor (limited) features
4. Clear localStorage to test fresh install: `localStorage.clear()`

### Common Tasks

#### Adding a New Product Category

1. Update category dropdown in admin section (line 188-194)
2. No backend changes needed - categories are stored with products

#### Modifying Weight Simulation

Edit `startAutoWeightSimulation()` function (lines 702-709):
```javascript
const weight = (Math.random() * 3 + 0.1).toFixed(2); // Adjust range here
```

#### Changing Default Products

Edit `loadDefaultProducts()` function (lines 541-550)

#### Customizing Invoice Format

Modify invoice modal HTML (lines 356-417) and `showInvoice()` function

## Deployment

### Local Development
Simply open `index.html` in a web browser. No server required.

### Production Deployment

**Option 1: Static Hosting**
- Upload `index.html` to any static host (GitHub Pages, Netlify, Vercel, etc.)
- No build step needed

**Option 2: Web Server**
- Place in web server document root
- Works with Apache, Nginx, or any HTTP server

**Important**: For real scale integration, you'll need:
1. Backend server with serial port access
2. WebSocket or API to communicate weights
3. Modified JavaScript to connect to backend

## Known Limitations & Future Enhancements

### Current Limitations

1. **No Backend**: All data stored in browser localStorage
   - Data not shared between devices
   - Data lost if browser cache cleared
   - No multi-user concurrent access

2. **Simulated Scale**: Weight readings are random for demo purposes
   - Real scale requires backend integration

3. **No Authentication Security**: Credentials hardcoded in JavaScript
   - Fine for demo, unsuitable for production

4. **Limited Reporting**: Basic CSV export only
   - No advanced analytics or charts

### Suggested Enhancements

1. **Backend Integration**
   - Database for persistent storage
   - Real-time scale communication
   - Multi-device sync
   - Secure authentication

2. **Enhanced Features**
   - Inventory tracking
   - Customer management
   - Receipt printing
   - Barcode scanning
   - Multiple payment methods

3. **Improved UX**
   - Charts and visualizations
   - Advanced filtering and search
   - Bulk operations
   - Product images

## Git Workflow

### Branching Strategy

This repository uses feature branches prefixed with `claude/`:
- Main development branch: `claude/claude-md-mitqkux3zvzxu2dc-013NXkynK857BBpDperMXfCr`
- All changes should be committed to this branch

### Commit Guidelines

**Commit Message Format**:
```
<type>: <description>

[optional body]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: UI/styling changes
- `docs`: Documentation updates

**Examples**:
```
feat: Add customer receipt email functionality
fix: Correct weight rounding in cart calculations
refactor: Extract invoice generation to separate function
style: Improve mobile responsive layout
docs: Update CLAUDE.md with deployment instructions
```

### Making Commits

Always:
1. Test changes in browser first
2. Clear localStorage and test fresh state
3. Write clear commit messages
4. Push to the designated branch

## Debugging Tips

### Common Issues

**Issue**: Cart not updating
- **Check**: Browser console for JavaScript errors
- **Fix**: Verify `updateCart()` is being called

**Issue**: Data lost on refresh
- **Check**: localStorage in DevTools → Application tab
- **Fix**: Verify `saveData()` is called after changes

**Issue**: Invoice not printing
- **Check**: Print preview for CSS issues
- **Fix**: Verify `.print-area` and `.no-print` classes

**Issue**: Scale readings frozen
- **Check**: `autoWeightInterval` is running
- **Fix**: Refresh page to restart simulation

### Browser Console Commands

Useful for debugging:
```javascript
// View all products
JSON.parse(localStorage.getItem('carniceria_products'))

// View sales history
JSON.parse(localStorage.getItem('carniceria_salesHistory'))

// Reset invoice counter
localStorage.setItem('carniceria_invoiceCounter', '1')

// Clear all data
localStorage.clear()

// Check current cart state
cart

// Check logged in user
currentUser
```

## Security Considerations

**Warning**: This application is designed for learning/demo purposes.

### Security Issues

1. **Client-Side Storage**: All data visible in browser
2. **Hardcoded Credentials**: Login credentials in source code
3. **No Input Validation**: XSS vulnerabilities possible
4. **No Access Control**: Role checks only in UI, not enforced

### For Production Use

Implement:
1. Server-side authentication and authorization
2. Input sanitization and validation
3. HTTPS encryption
4. Secure session management
5. Database with proper access controls
6. Input validation on all user data

## AI Assistant Guidelines

### When Working on This Codebase

1. **Always read `index.html` completely** before making changes
2. **Test changes** by opening in browser - this is critical
3. **Preserve Spanish UI text** - don't translate to English
4. **Maintain single-file architecture** - don't split into multiple files without explicit request
5. **Keep it simple** - resist urge to over-engineer
6. **Document changes** - update this file if architecture changes

### Typical User Requests

**"Add a new feature"**
→ Add to appropriate section in `index.html`
→ Update localStorage schema if needed
→ Test in browser before committing

**"Fix a bug"**
→ Reproduce in browser first
→ Use console.log for debugging
→ Test fix thoroughly
→ Consider edge cases

**"Improve styling"**
→ Use Tailwind classes where possible
→ Add custom CSS to `<style>` tag only if necessary
→ Test responsive design (mobile/tablet/desktop)

**"Export data functionality"**
→ Use Blob API for file downloads (see `exportSales()` example)
→ Format data appropriately (CSV, JSON, etc.)

### Best Practices

1. **Before editing**: Read the relevant function and understand data flow
2. **After editing**: Test in browser with both user roles
3. **Always preserve**: Existing functionality unless explicitly removing
4. **Commit frequently**: Small, logical commits are better
5. **Update docs**: If adding features, update this CLAUDE.md

## Quick Reference

### Function Map

**Authentication**:
- `login()` - Handle user login
- `logout()` - Handle logout
- `showMainApp()` - Display main interface

**Product Management**:
- `loadDefaultProducts()` - Initialize default catalog
- `addProduct()` - Add new product (admin)
- `deleteProduct()` - Remove product (admin)
- `loadProductsToSales()` - Display in sales view
- `loadProductsToAdmin()` - Display in admin view

**Sales Operations**:
- `selectProduct()` - Choose product to weigh
- `addToCart()` - Add weighted item to cart
- `removeFromCart()` - Remove cart item
- `clearCart()` - Empty cart
- `updateCart()` - Refresh cart display
- `processCheckout()` - Begin checkout process

**Invoicing**:
- `showInvoice()` - Generate and display invoice
- `printInvoice()` - Print invoice
- `closeInvoice()` - Close invoice and clear cart

**Scale**:
- `setWeightMode()` - Toggle auto/manual mode
- `startAutoWeightSimulation()` - Run simulated scale

**Analytics**:
- `updateStats()` - Refresh statistics dashboard
- `filterSales()` - Apply date/user filters
- `loadSalesHistory()` - Display sales table
- `exportSales()` - Generate CSV export
- `printSalesReport()` - Print sales report

**Data Persistence**:
- `loadData()` - Load from localStorage
- `saveData()` - Save to localStorage

**Navigation**:
- `showTab()` - Switch between sales/admin
- `showAdminTab()` - Switch admin subsections

---

**Last Updated**: 2025-12-06
**Version**: 1.0.0
**Maintained by**: AI Assistants and Contributors
