// src/types/index.ts

// Product types
export type {
  Product,
  ProductSize,
  FragranceNotes,
  ProductCategory,
  ProductFilters,
  SortOption,
} from './product';

// Cart types
export type {
  CartItem,
  Cart,
  DiscountCode,
  ShippingMethod,
} from './cart';

export { SHIPPING_METHODS } from './cart';

// User types
export type {
  User,
  Address,
  RegisterData,
  LoginData,
  UpdateProfileData,
  ChangePasswordData,
  ResetPasswordData,
} from './user';

// Order types
export type {
  Order,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  CheckoutData,
  OrderSummary,
} from './order';