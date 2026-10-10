export const CATEGORIES = ['All', 'Starters', 'Main Course', 'Fast Food', 'Beverages', 'Desserts', 'Combo Meals'];

export const menuItems = [
  { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 280, desc: 'Cottage cheese marinated in spices, grilled in tandoor', rating: 4.8, reviews: 234, available: true, popular: true, image: '🧀', prepTime: 15, calories: 320 },
  { id: 2, name: 'Chicken Wings', category: 'Starters', price: 320, desc: 'Crispy fried chicken wings with signature hot sauce', rating: 4.7, reviews: 189, available: true, popular: true, image: '🍗', prepTime: 18, calories: 450 },
  { id: 3, name: 'Veg Spring Rolls', category: 'Starters', price: 180, desc: 'Crispy rolls stuffed with fresh vegetables', rating: 4.5, reviews: 156, available: true, popular: false, image: '🥢', prepTime: 12, calories: 210 },
  { id: 4, name: 'Mushroom Soup', category: 'Starters', price: 150, desc: 'Creamy mushroom soup with herbs and cream', rating: 4.6, reviews: 112, available: true, popular: false, image: '🍲', prepTime: 10, calories: 180 },
  { id: 5, name: 'Butter Chicken', category: 'Main Course', price: 380, desc: 'Tender chicken in rich tomato-cream sauce', rating: 4.9, reviews: 456, available: true, popular: true, image: '🍛', prepTime: 25, calories: 520 },
  { id: 6, name: 'Dal Makhani', category: 'Main Course', price: 240, desc: 'Slow-cooked black lentils in buttery tomato gravy', rating: 4.7, reviews: 312, available: true, popular: true, image: '🫘', prepTime: 30, calories: 380 },
  { id: 7, name: 'Mutton Biryani', category: 'Main Course', price: 480, desc: 'Aromatic basmati rice with tender mutton pieces', rating: 4.8, reviews: 389, available: true, popular: true, image: '🍚', prepTime: 40, calories: 680 },
  { id: 8, name: 'Palak Paneer', category: 'Main Course', price: 260, desc: 'Fresh cottage cheese in smooth spinach gravy', rating: 4.6, reviews: 278, available: true, popular: false, image: '🥬', prepTime: 22, calories: 340 },
  { id: 9, name: 'Grilled Fish', category: 'Main Course', price: 420, desc: 'Fresh fish grilled with lemon herb marinade', rating: 4.7, reviews: 198, available: false, popular: false, image: '🐟', prepTime: 28, calories: 290 },
  { id: 10, name: 'Veg Burger', category: 'Fast Food', price: 160, desc: 'Crispy veggie patty with fresh lettuce and sauce', rating: 4.4, reviews: 234, available: true, popular: false, image: '🍔', prepTime: 10, calories: 420 },
  { id: 11, name: 'Chicken Burger', category: 'Fast Food', price: 220, desc: 'Juicy grilled chicken fillet with special sauce', rating: 4.6, reviews: 312, available: true, popular: true, image: '🍔', prepTime: 12, calories: 540 },
  { id: 12, name: 'French Fries', category: 'Fast Food', price: 120, desc: 'Golden crispy fries seasoned with herbs', rating: 4.5, reviews: 567, available: true, popular: true, image: '🍟', prepTime: 8, calories: 380 },
  { id: 13, name: 'Pizza Margherita', category: 'Fast Food', price: 340, desc: 'Classic pizza with tomato sauce and mozzarella', rating: 4.8, reviews: 445, available: true, popular: true, image: '🍕', prepTime: 20, calories: 640 },
  { id: 14, name: 'Mango Lassi', category: 'Beverages', price: 90, desc: 'Chilled yogurt drink blended with fresh mango', rating: 4.8, reviews: 389, available: true, popular: true, image: '🥭', prepTime: 5, calories: 210 },
  { id: 15, name: 'Cold Coffee', category: 'Beverages', price: 120, desc: 'Chilled coffee with ice cream and chocolate', rating: 4.7, reviews: 312, available: true, popular: true, image: '☕', prepTime: 5, calories: 280 },
  { id: 16, name: 'Fresh Lime Soda', category: 'Beverages', price: 70, desc: 'Refreshing lime soda with mint', rating: 4.5, reviews: 234, available: true, popular: false, image: '🍋', prepTime: 3, calories: 80 },
  { id: 17, name: 'Masala Chai', category: 'Beverages', price: 50, desc: 'Traditional spiced Indian tea', rating: 4.9, reviews: 678, available: true, popular: true, image: '🍵', prepTime: 5, calories: 120 },
  { id: 18, name: 'Gulab Jamun', category: 'Desserts', price: 120, desc: 'Soft milk-solid balls soaked in rose syrup', rating: 4.9, reviews: 456, available: true, popular: true, image: '🍮', prepTime: 8, calories: 340 },
  { id: 19, name: 'Chocolate Brownie', category: 'Desserts', price: 180, desc: 'Warm fudgy brownie with vanilla ice cream', rating: 4.8, reviews: 312, available: true, popular: true, image: '🍫', prepTime: 5, calories: 420 },
  { id: 20, name: 'Kulfi', category: 'Desserts', price: 100, desc: 'Traditional Indian ice cream with pistachios', rating: 4.7, reviews: 234, available: true, popular: false, image: '🍦', prepTime: 3, calories: 280 },
  { id: 21, name: 'Family Combo', category: 'Combo Meals', price: 899, desc: 'Butter chicken + Biryani + 4 naans + 2 drinks + dessert', rating: 4.9, reviews: 189, available: true, popular: true, image: '🎁', prepTime: 45, calories: 2200 },
  { id: 22, name: 'Couple Special', category: 'Combo Meals', price: 599, desc: '2 main course + 2 drinks + 1 dessert', rating: 4.8, reviews: 145, available: true, popular: true, image: '💑', prepTime: 35, calories: 1400 },
  { id: 23, name: 'Lunch Box', category: 'Combo Meals', price: 220, desc: 'Dal + Sabji + Rice + Roti + Salad', rating: 4.6, reviews: 267, available: true, popular: false, image: '🥡', prepTime: 20, calories: 680 },
];

export const tables = [
  { id: 1, number: 'T1', capacity: 2, status: 'available', section: 'Indoor', floor: 'Ground' },
  { id: 2, number: 'T2', capacity: 2, status: 'occupied', section: 'Indoor', floor: 'Ground' },
  { id: 3, number: 'T3', capacity: 4, status: 'reserved', section: 'Indoor', floor: 'Ground' },
  { id: 4, number: 'T4', capacity: 4, status: 'available', section: 'Indoor', floor: 'Ground' },
  { id: 5, number: 'T5', capacity: 6, status: 'occupied', section: 'Indoor', floor: 'Ground' },
  { id: 6, number: 'T6', capacity: 6, status: 'available', section: 'Indoor', floor: 'First' },
  { id: 7, number: 'T7', capacity: 8, status: 'reserved', section: 'Indoor', floor: 'First' },
  { id: 8, number: 'T8', capacity: 8, status: 'available', section: 'Indoor', floor: 'First' },
  { id: 9, number: 'O1', capacity: 4, status: 'available', section: 'Outdoor', floor: 'Terrace' },
  { id: 10, number: 'O2', capacity: 4, status: 'occupied', section: 'Outdoor', floor: 'Terrace' },
  { id: 11, number: 'O3', capacity: 2, status: 'available', section: 'Outdoor', floor: 'Terrace' },
  { id: 12, number: 'P1', capacity: 10, status: 'available', section: 'Private', floor: 'First' },
  { id: 13, number: 'P2', capacity: 12, status: 'reserved', section: 'Private', floor: 'First' },
];

export const orders = [
  { id: 'ORD001', customer: 'Rahul Sharma', table: 'T5', items: [{ name: 'Butter Chicken', qty: 2, price: 380 }, { name: 'Naan', qty: 4, price: 40 }, { name: 'Mango Lassi', qty: 2, price: 90 }], status: 'preparing', time: '12:35 PM', total: 1020, type: 'dine-in', paymentStatus: 'pending', date: '2025-06-12' },
  { id: 'ORD002', customer: 'Priya Patel', table: 'T2', items: [{ name: 'Paneer Tikka', qty: 1, price: 280 }, { name: 'Dal Makhani', qty: 1, price: 240 }, { name: 'Masala Chai', qty: 2, price: 50 }], status: 'ready', time: '12:20 PM', total: 620, type: 'dine-in', paymentStatus: 'pending', date: '2025-06-12' },
  { id: 'ORD003', customer: 'Amit Verma', table: null, items: [{ name: 'Chicken Burger', qty: 2, price: 220 }, { name: 'French Fries', qty: 2, price: 120 }, { name: 'Cold Coffee', qty: 2, price: 120 }], status: 'new', time: '12:45 PM', total: 920, type: 'delivery', paymentStatus: 'paid', date: '2025-06-12', address: '123 MG Road, Bangalore' },
  { id: 'ORD004', customer: 'Sneha Singh', table: 'T10', items: [{ name: 'Family Combo', qty: 1, price: 899 }, { name: 'Gulab Jamun', qty: 4, price: 120 }], status: 'completed', time: '11:30 AM', total: 1379, type: 'dine-in', paymentStatus: 'paid', date: '2025-06-12' },
  { id: 'ORD005', customer: 'Vikram Gupta', table: null, items: [{ name: 'Mutton Biryani', qty: 2, price: 480 }, { name: 'Fresh Lime Soda', qty: 2, price: 70 }], status: 'completed', time: '11:15 AM', total: 1100, type: 'takeaway', paymentStatus: 'paid', date: '2025-06-12' },
  { id: 'ORD006', customer: 'Anjali Mehta', table: null, items: [{ name: 'Pizza Margherita', qty: 1, price: 340 }, { name: 'Cold Coffee', qty: 1, price: 120 }], status: 'cancelled', time: '12:00 PM', total: 460, type: 'delivery', paymentStatus: 'refunded', date: '2025-06-12' },
  { id: 'ORD007', customer: 'Rohan Joshi', table: 'T3', items: [{ name: 'Veg Spring Rolls', qty: 2, price: 180 }, { name: 'Palak Paneer', qty: 1, price: 260 }, { name: 'Chocolate Brownie', qty: 1, price: 180 }], status: 'preparing', time: '12:50 PM', total: 800, type: 'dine-in', paymentStatus: 'pending', date: '2025-06-12' },
];

export const reservations = [
  { id: 'RES001', customer: 'Kavya Nair', date: '2025-06-12', time: '7:00 PM', guests: 4, table: 'T7', status: 'confirmed', special: 'Birthday celebration', phone: '+91 9876543210' },
  { id: 'RES002', customer: 'Dev Kumar', date: '2025-06-12', time: '8:00 PM', guests: 2, table: 'T3', status: 'confirmed', special: 'Anniversary dinner', phone: '+91 9765432109' },
  { id: 'RES003', customer: 'Meera Iyer', date: '2025-06-13', time: '1:00 PM', guests: 6, table: 'P1', status: 'pending', special: 'Business lunch', phone: '+91 9654321098' },
  { id: 'RES004', customer: 'Arjun Reddy', date: '2025-06-13', time: '7:30 PM', guests: 8, table: 'P2', status: 'confirmed', special: 'Family gathering', phone: '+91 9543210987' },
  { id: 'RES005', customer: 'Divya Shah', date: '2025-06-14', time: '8:30 PM', guests: 2, table: 'O2', status: 'cancelled', special: '', phone: '+91 9432109876' },
  { id: 'RES006', customer: 'Karan Malhotra', date: '2025-06-15', time: '12:30 PM', guests: 4, table: 'T4', status: 'pending', special: 'Window seat preferred', phone: '+91 9321098765' },
];

export const inventory = [
  { id: 1, name: 'Chicken Breast', category: 'Protein', quantity: 15, unit: 'kg', minStock: 10, supplier: 'Fresh Farms Co', costPerUnit: 280, lastUpdated: '2025-06-12', status: 'ok' },
  { id: 2, name: 'Basmati Rice', category: 'Grains', quantity: 45, unit: 'kg', minStock: 20, supplier: 'Royal Grains', costPerUnit: 85, lastUpdated: '2025-06-11', status: 'ok' },
  { id: 3, name: 'Paneer', category: 'Dairy', quantity: 8, unit: 'kg', minStock: 10, supplier: 'Local Dairy', costPerUnit: 320, lastUpdated: '2025-06-12', status: 'low' },
  { id: 4, name: 'Tomatoes', category: 'Vegetables', quantity: 12, unit: 'kg', minStock: 15, supplier: 'Green Farm', costPerUnit: 40, lastUpdated: '2025-06-12', status: 'low' },
  { id: 5, name: 'Onions', category: 'Vegetables', quantity: 25, unit: 'kg', minStock: 10, supplier: 'Green Farm', costPerUnit: 30, lastUpdated: '2025-06-11', status: 'ok' },
  { id: 6, name: 'Cooking Oil', category: 'Oils', quantity: 20, unit: 'L', minStock: 10, supplier: 'Best Oil Co', costPerUnit: 145, lastUpdated: '2025-06-10', status: 'ok' },
  { id: 7, name: 'Flour (Maida)', category: 'Grains', quantity: 18, unit: 'kg', minStock: 20, supplier: 'Royal Grains', costPerUnit: 45, lastUpdated: '2025-06-11', status: 'low' },
  { id: 8, name: 'Butter', category: 'Dairy', quantity: 5, unit: 'kg', minStock: 8, supplier: 'Local Dairy', costPerUnit: 480, lastUpdated: '2025-06-12', status: 'low' },
  { id: 9, name: 'Spice Mix', category: 'Spices', quantity: 3, unit: 'kg', minStock: 2, supplier: 'Spice House', costPerUnit: 350, lastUpdated: '2025-06-10', status: 'ok' },
  { id: 10, name: 'Mango Pulp', category: 'Fruits', quantity: 10, unit: 'L', minStock: 5, supplier: 'Fresh Farms Co', costPerUnit: 95, lastUpdated: '2025-06-11', status: 'ok' },
  { id: 11, name: 'Milk', category: 'Dairy', quantity: 30, unit: 'L', minStock: 20, supplier: 'Local Dairy', costPerUnit: 60, lastUpdated: '2025-06-12', status: 'ok' },
  { id: 12, name: 'Potatoes', category: 'Vegetables', quantity: 20, unit: 'kg', minStock: 15, supplier: 'Green Farm', costPerUnit: 25, lastUpdated: '2025-06-11', status: 'ok' },
];

export const staff = [
  { id: 1, name: 'Rajesh Kumar', role: 'Head Chef', email: 'rajesh@foodflow.com', phone: '+91 9876543210', salary: 45000, shift: 'Morning', joinDate: '2023-01-15', status: 'active', avatar: 'RK' },
  { id: 2, name: 'Priya Sharma', role: 'Manager', email: 'priya@foodflow.com', phone: '+91 9765432109', salary: 38000, shift: 'Morning', joinDate: '2022-08-20', status: 'active', avatar: 'PS' },
  { id: 3, name: 'Mohan Patel', role: 'Waiter', email: 'mohan@foodflow.com', phone: '+91 9654321098', salary: 18000, shift: 'Evening', joinDate: '2023-06-10', status: 'active', avatar: 'MP' },
  { id: 4, name: 'Sneha Iyer', role: 'Cashier', email: 'sneha@foodflow.com', phone: '+91 9543210987', salary: 20000, shift: 'Morning', joinDate: '2023-03-05', status: 'active', avatar: 'SI' },
  { id: 5, name: 'Vikram Singh', role: 'Chef', email: 'vikram@foodflow.com', phone: '+91 9432109876', salary: 32000, shift: 'Evening', joinDate: '2022-11-12', status: 'active', avatar: 'VS' },
  { id: 6, name: 'Anita Verma', role: 'Waiter', email: 'anita@foodflow.com', phone: '+91 9321098765', salary: 17000, shift: 'Morning', joinDate: '2024-01-08', status: 'active', avatar: 'AV' },
  { id: 7, name: 'Suresh Rao', role: 'Delivery', email: 'suresh@foodflow.com', phone: '+91 9210987654', salary: 15000, shift: 'Evening', joinDate: '2023-09-20', status: 'inactive', avatar: 'SR' },
];

export const customers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '+91 9876543210', orders: 24, totalSpent: 18450, loyaltyPoints: 924, joinDate: '2024-01-15', lastVisit: '2025-06-12', status: 'Regular', avatar: 'RS' },
  { id: 2, name: 'Priya Patel', email: 'priya@gmail.com', phone: '+91 9765432109', orders: 18, totalSpent: 13200, loyaltyPoints: 660, joinDate: '2024-02-20', lastVisit: '2025-06-11', status: 'VIP', avatar: 'PP' },
  { id: 3, name: 'Amit Verma', email: 'amit@gmail.com', phone: '+91 9654321098', orders: 8, totalSpent: 5600, loyaltyPoints: 280, joinDate: '2024-05-10', lastVisit: '2025-06-10', status: 'Regular', avatar: 'AV' },
  { id: 4, name: 'Sneha Singh', email: 'sneha@gmail.com', phone: '+91 9543210987', orders: 45, totalSpent: 38900, loyaltyPoints: 1945, joinDate: '2023-08-05', lastVisit: '2025-06-12', status: 'Premium', avatar: 'SS' },
  { id: 5, name: 'Kavya Nair', email: 'kavya@gmail.com', phone: '+91 9432109876', orders: 12, totalSpent: 9800, loyaltyPoints: 490, joinDate: '2024-03-18', lastVisit: '2025-06-08', status: 'Regular', avatar: 'KN' },
];

export const promos = [
  { id: 1, code: 'WELCOME20', discount: 20, type: 'percent', minOrder: 300, expires: '2025-07-31', status: 'active', usages: 145 },
  { id: 2, code: 'FLAT100', discount: 100, type: 'flat', minOrder: 500, expires: '2025-06-30', status: 'active', usages: 89 },
  { id: 3, code: 'WEEKEND15', discount: 15, type: 'percent', minOrder: 400, expires: '2025-08-31', status: 'active', usages: 67 },
  { id: 4, code: 'FIRST50', discount: 50, type: 'flat', minOrder: 200, expires: '2025-06-15', status: 'expiring', usages: 234 },
];

export const reviews = [
  { id: 1, customer: 'Rahul S.', rating: 5, text: 'Absolutely loved the Butter Chicken! Best I\'ve had in Bangalore. Service was also exceptional.', date: '2025-06-10', dish: 'Butter Chicken', avatar: 'RS' },
  { id: 2, customer: 'Priya P.', rating: 5, text: 'The ambiance is fantastic and the food quality is top-notch. Our go-to place for family dinners!', date: '2025-06-09', dish: 'Family Combo', avatar: 'PP' },
  { id: 3, customer: 'Amit V.', rating: 4, text: 'Good food and quick delivery. The pizza could have been a bit crispier but overall great experience.', date: '2025-06-08', dish: 'Pizza Margherita', avatar: 'AV' },
  { id: 4, customer: 'Sneha S.', rating: 5, text: 'Staff is very friendly and attentive. The Mutton Biryani is to die for! Will definitely be back.', date: '2025-06-07', dish: 'Mutton Biryani', avatar: 'SS' },
  { id: 5, customer: 'Kavya N.', rating: 4, text: 'Lovely outdoor seating area. Great for a romantic dinner. The desserts were outstanding!', date: '2025-06-06', dish: 'Gulab Jamun', avatar: 'KN' },
];

export const salesData = [
  { day: 'Mon', sales: 12450, orders: 34 },
  { day: 'Tue', sales: 15320, orders: 42 },
  { day: 'Wed', sales: 11200, orders: 31 },
  { day: 'Thu', sales: 18900, orders: 51 },
  { day: 'Fri', sales: 24600, orders: 68 },
  { day: 'Sat', sales: 31200, orders: 87 },
  { day: 'Sun', sales: 28900, orders: 79 },
];

export const monthlyRevenue = [
  { month: 'Jan', revenue: 285000, orders: 892 },
  { month: 'Feb', revenue: 312000, orders: 978 },
  { month: 'Mar', revenue: 298000, orders: 934 },
  { month: 'Apr', revenue: 345000, orders: 1080 },
  { month: 'May', revenue: 378000, orders: 1184 },
  { month: 'Jun', revenue: 392000, orders: 1228 },
];

export const popularDishes = [
  { name: 'Butter Chicken', orders: 456, revenue: 173280, trend: '+12%' },
  { name: 'Mutton Biryani', orders: 389, revenue: 186720, trend: '+8%' },
  { name: 'Masala Chai', orders: 678, revenue: 33900, trend: '+22%' },
  { name: 'Pizza Margherita', orders: 445, revenue: 151300, trend: '+15%' },
  { name: 'Gulab Jamun', orders: 456, revenue: 54720, trend: '+18%' },
];

export const notifications = [
  { id: 1, type: 'order', title: 'New Order Received', message: 'Order #ORD008 received from Ravi Kumar — ₹1,240', time: '2 min ago', read: false },
  { id: 2, type: 'reservation', title: 'New Reservation', message: 'Table T6 reserved by Ananya Iyer for 7:30 PM tonight', time: '15 min ago', read: false },
  { id: 3, type: 'inventory', title: 'Low Stock Alert', message: 'Paneer stock is critically low (8kg remaining)', time: '30 min ago', read: false },
  { id: 4, type: 'promo', title: 'Promotion Expiring', message: 'FIRST50 promo code expires in 3 days', time: '1 hour ago', read: true },
  { id: 5, type: 'order', title: 'Order Completed', message: 'Order #ORD004 has been completed and paid', time: '1 hour ago', read: true },
  { id: 6, type: 'inventory', title: 'Low Stock Alert', message: 'Butter stock is low (5kg remaining)', time: '2 hours ago', read: true },
];

export const USERS = [
  { id: 1, name: 'Admin User', email: 'admin@foodflow.com', password: 'admin123', role: 'admin', avatar: 'AU' },
  { id: 2, name: 'Priya Sharma', email: 'staff@foodflow.com', password: 'staff123', role: 'staff', avatar: 'PS' },
  { id: 3, name: 'Rahul Customer', email: 'customer@foodflow.com', password: 'customer123', role: 'customer', avatar: 'RC' },
];

export const deliveries = [
  { id: 'DEL001', orderId: 'ORD003', customer: 'Amit Verma', address: '123 MG Road, Bangalore', driver: 'Suresh Rao', status: 'out-for-delivery', estimatedTime: '20 min', distance: '3.2 km', phone: '+91 9321098765' },
  { id: 'DEL002', orderId: 'ORD006', customer: 'Anjali Mehta', address: '45 Koramangala, Bangalore', driver: 'Pending', status: 'cancelled', estimatedTime: '-', distance: '5.1 km', phone: '+91 9210987654' },
];
