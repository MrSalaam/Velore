# Veloré - Luxury Perfume E-Commerce Store

<div align="center">

![Veloré Logo](public/favicon.svg)

**A Premium E-Commerce Platform for Luxury Perfumes**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Core Functionalities](#-core-functionalities)
- [State Management](#️-state-management)
- [API Integration](#-api-integration)
- [Styling Architecture](#-styling-architecture)
- [Responsive Design](#-responsive-design)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Veloré** is a sophisticated, full-featured e-commerce platform designed specifically for luxury perfume retailers. Built with modern web technologies, it delivers an exceptional shopping experience with stunning visuals, smooth animations, and intuitive user interactions.

The platform showcases premium fragrances from top brands like **Tom Ford**, **Chanel**, **Dior**, **Versace**, **Gucci**, and more, offering customers a seamless journey from discovery to checkout.

---

## ✨ Key Features

### 🏠 **User Experience**
- **Immersive Hero Section** with video backgrounds and smooth carousel transitions
- **3D Product Showcase** with interactive card stack animations
- **Advanced Search & Filtering** by category, price, brand, rating, and availability
- **Real-time Cart Management** with quantity updates and instant total calculations
- **Wishlist Functionality** for saving favorite products
- **Responsive Design** optimized for mobile, tablet, and desktop devices

### 🛍️ **Shopping Features**
- **Product Details Pages** with image galleries, size selection, and fragrance notes
- **Customer Reviews & Ratings** with verification badges
- **Dynamic Pricing** with discount calculations
- **Stock Availability Tracking** with low-stock warnings
- **Multi-step Checkout Process** with form validation
- **Multiple Payment Options** (Credit Card, PayPal, Apple Pay, Google Pay)

### 👤 **User Account Management**
- **Secure Authentication** with JWT token handling
- **User Dashboard** for order history, addresses, and account settings
- **Profile Management** with avatar upload and personal information updates
- **Address Book** with default shipping address selection
- **Order Tracking** with status updates and delivery information

### 🎨 **Design & Animations**
- **Framer Motion** animations for smooth page transitions
- **Custom 3D Effects** for product showcases
- **Toast Notifications** for user feedback
- **Loading States** and skeleton screens
- **Confetti Effects** on successful orders

---

## 🛠️ Technology Stack

### **Frontend Core**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react) | `^19.0.0` | UI component library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript) | `^5.5.3` | Type-safe JavaScript |
| ![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite) | `^5.4.11` | Build tool & dev server |

### **Routing & Navigation**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React Router](https://img.shields.io/badge/React_Router-7.0-CA4245?logo=react-router) | `^7.0.2` | Client-side routing |

### **Styling & UI**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss) | `^3.4.17` | Utility-first CSS framework |
| ![PostCSS](https://img.shields.io/badge/PostCSS-8.4-DD3A0A?logo=postcss) | `^8.4.49` | CSS transformations |
| ![Autoprefixer](https://img.shields.io/badge/Autoprefixer-10.4-DD3735?logo=autoprefixer) | `^10.4.20` | CSS vendor prefixing |

### **Animation & Effects**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-0055FF?logo=framer) | `^12.23.24` | React animation library |
| React Confetti | `^6.1.0` | Celebration animations |
| Canvas Confetti | `^1.9.2` | Canvas-based confetti effects |

### **Icons & Assets**

| Technology | Version | Purpose |
|------------|---------|---------|
| Lucide React | `^0.294.0` | Modern icon library (500+ icons) |
| React Icons | `^5.5.0` | Popular icon packs |

### **HTTP Client & API**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?logo=axios) | `^1.6.2` | Promise-based HTTP client |

### **State Management**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Zustand](https://img.shields.io/badge/Zustand-4.4-000000) | `^4.4.7` | Lightweight state management |

### **User Feedback**

| Technology | Version | Purpose |
|------------|---------|---------|
| React Hot Toast | `^2.4.1` | Toast notifications |

### **Development Tools**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![ESLint](https://img.shields.io/badge/ESLint-9.17-4B32C3?logo=eslint) | `^9.17.0` | Code linting |
| TypeScript ESLint | `^8.18.2` | TypeScript-specific linting rules |

---

## 📁 Project Structure

```
Velore/
├── public/                      # Static assets
│   ├── favicon.svg
│   ├── images/
│   │   ├── banners/            # Hero section images
│   │   ├── icons/              # Brand icons
│   │   └── products/           # Product images
│   └── videos/                 # Hero carousel videos
│
├── src/
│   ├── components/             # Reusable React components
│   │   ├── cart/              # Cart-related components
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/          # Checkout flow components
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── common/            # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── product/           # Product-related components
│   │       ├── ProductCard.tsx
│   │       ├── ProductGrid.tsx
│   │       ├── ProductDetails.tsx
│   │       ├── ProductGallery.tsx
│   │       ├── ProductFilters.tsx
│   │       └── ProductReviews.tsx
│   │
│   ├── pages/                 # Route-level page components
│   │   ├── Home.tsx          # Homepage with hero & featured products
│   │   ├── Shop.tsx          # Product listing with filters
│   │   ├── ProductPage.tsx   # Individual product details
│   │   ├── Cart.tsx          # Shopping cart page
│   │   ├── Checkout.tsx      # Multi-step checkout
│   │   ├── CheckoutSuccess.tsx
│   │   ├── Login.tsx         # Authentication pages
│   │   ├── Register.tsx
│   │   ├── Account.tsx       # User dashboard
│   │   ├── Orders.tsx        # Order history
│   │   └── NotFound.tsx      # 404 error page
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts       # Authentication logic
│   │   ├── useCart.ts       # Cart management
│   │   ├── useCheckout.ts   # Checkout flow
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── store/               # Zustand state stores
│   │   ├── authStore.ts    # User authentication state
│   │   ├── cartStore.ts    # Shopping cart state
│   │   └── productStore.ts # Product catalog state
│   │
│   ├── services/            # API integration layer
│   │   ├── api/
│   │   │   ├── auth.ts     # Authentication endpoints
│   │   │   ├── products.ts # Product endpoints
│   │   │   ├── orders.ts   # Order endpoints
│   │   │   └── payment.ts  # Payment processing
│   │   ├── axiosInstance.ts # Configured Axios client
│   │   └── config.ts       # API configuration
│   │
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts       # Product, User, Order, Cart types
│   │
│   ├── utils/             # Utility functions
│   │   ├── constants.ts  # App-wide constants
│   │   ├── formatters.ts # Data formatting (currency, dates)
│   │   ├── validators.ts # Form validation
│   │   └── helpers.ts    # Helper functions
│   │
│   ├── styles/           # Global styles
│   │   ├── global.css   # Base styles & Tailwind imports
│   │   └── variables.css # CSS custom properties
│   │
│   ├── App.tsx          # Root application component
│   ├── main.tsx         # Application entry point
│   ├── router.tsx       # Route configuration
│   └── vite-env.d.ts    # Vite type definitions
│
├── index.html           # HTML entry point
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**

### **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/velore.git
cd velore
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GA_TRACKING_ID=your_google_analytics_id
```

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

The application will open at `http://localhost:5173`

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API endpoint | Yes |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key for payments | Yes |
| `VITE_GA_TRACKING_ID` | Google Analytics tracking ID | No |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:5173` |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🎯 Core Functionalities

### **1. Product Management**

- **Product Catalog**: Browse through 200+ luxury perfumes
- **Dynamic Filtering**: Filter by category (Men, Women, Unisex), price range, brand, rating
- **Sorting Options**: Sort by popularity, newest, price (low-high), price (high-low), rating
- **Search Functionality**: Real-time search with debouncing
- **Pagination**: 12 products per page with page navigation

### **2. Shopping Cart System**

- **Add to Cart**: Select product size and quantity before adding
- **Update Quantities**: Increment/decrement with stock validation
- **Remove Items**: Single or bulk removal
- **Persistent Storage**: Cart saved to localStorage
- **Real-time Calculations**: Subtotal, tax, shipping, discounts

### **3. User Authentication**

- **Registration**: Email/password with validation
- **Login**: JWT token-based authentication
- **Session Management**: Auto-logout on token expiration
- **Protected Routes**: Redirect to login for authenticated pages
- **Demo Credentials**: Available for testing

### **4. Checkout Process**

**Multi-step checkout flow:**

1. **Shipping Information**: Name, address, phone validation
2. **Payment Method**: Credit card, PayPal, Apple Pay, Google Pay
3. **Order Review**: Final cart review before submission
4. **Order Confirmation**: Success page with order details and confetti animation

### **5. Product Reviews System**

- **Star Ratings**: 1-5 star rating system
- **Verified Purchase Badges**: For authenticated buyers
- **Review Submission**: Title, comment, rating with validation
- **Helpful Votes**: Upvote helpful reviews
- **Rating Distribution**: Visual breakdown of ratings

---

## 🗄️ State Management

**Veloré** uses **Zustand** for efficient, minimal state management:

### **Stores**

1. **Cart Store** - Cart items, add/remove/update operations, total calculations
2. **Product Store** - Product catalog, filters, sorting, pagination
3. **Auth Store** - User authentication state, JWT token management

**Example:**

```typescript
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  
  addItem: (product, size, quantity) => {
    // Implementation
  },
  
  getTotal: () => {
    return get().items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  },
}));
```

---

## 🌐 API Integration

### **API Configuration**

```typescript
export const apiConfig = {
  endpoints: {
    PRODUCTS: '/products',
    ORDERS: '/orders',
    AUTH: '/auth',
    PAYMENT: '/payment',
  },
  timeout: 30000,
  retry: { maxAttempts: 3, delay: 1000 },
};
```

### **Axios Instance**

```typescript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🎨 Styling Architecture

### **Tailwind CSS Configuration**

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          600: '#7c3aed',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'dancing-script': ['Dancing Script', 'cursive'],
        'libertinus-keyboard': ['Libertinus Keyboard', 'serif'],
      },
    },
  },
};
```

### **Custom Fonts**

```css
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Libertinus+Keyboard&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

---

## 📱 Responsive Design

**Veloré** is fully responsive across all devices:

- **Mobile**: 320px - 767px (Touch-optimized with swipe gestures)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+ (3D animations and hover effects)

**Breakpoint Usage:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Responsive grid layout */}
</div>
```

---

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### **Deployment Platforms**

#### **Vercel** (Recommended)

1. Connect your GitHub repository
2. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variables
4. Deploy

#### **Netlify**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Olayinka Salaam**

- GitHub: [@yourusername](https://github.com/MrSalaam)
- LinkedIn: [Your Profile](https://linkedin.com/in/olayinka-salaam)
- Email: olayinkasalaam.dev@gmail.com

---

## 🙏 Acknowledgments

- **Google Fonts** for typography
- **Lucide Icons** for iconography
- **Tailwind CSS** for the utility-first approach

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by Olayinka Salaam

</div>