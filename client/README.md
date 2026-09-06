Implementation Plan
Implementation Plan: Shop.co MERN E-Commerce Frontend & Integration
Rebuild and complete the Shop.co e-commerce frontend in React using Redux Toolkit, React Router DOM, SCSS (with variables, mixins, and a px-to-rem converter function), and React Toastify. The design adheres strictly to the provided Figma mockups and frontend-ref reference code, connecting to the existing Express/MongoDB backend with clean, human-readable code (basic/mid student level, no comments in code).

User Review Required
IMPORTANT

Code Style: Code will be written in simple, readable, student-level React/Redux without comments in source code, avoiding over-engineered abstractions.
Authentication: Utilizes HTTP-only cookies and token handling with Axios withCredentials: true. User and admin role separation is enforced via ProtectedRoute and AdminRoute.
Styling: SCSS structured with abstracts/ (_variables.scss, _functions.scss for px-to-rem, _mixins.scss), base/ (typography with Satoshi and Integral CF fonts, reset, global), components/, and pages/.
Proposed Changes
1. Dependencies & Assets Setup
Install required packages in client: react-router-dom, @reduxjs/toolkit, react-redux, sass, react-toastify, axios.
Copy font files (Satoshi, Integral CF) and asset icons/images from frontend ref/assets and frontend ref/css/fonts into client/public/.
2. SCSS Architecture
Create modular SCSS matching frontend-ref and Figma:

client/src/scss/abstracts/_variables.scss: Colors, fonts, radius, shadows.
client/src/scss/abstracts/_functions.scss: rem($px) conversion function.
client/src/scss/abstracts/_mixins.scss: flex-center, button, card, breakpoint mixins (mobile, tablet, desktop).
client/src/scss/base/_reset.scss, _typography.scss, _global.scss.
client/src/scss/layout/_header.scss, _footer.scss, _admin.scss.
client/src/scss/pages/_home.scss, _products.scss, _productDetail.scss, _cart.scss, _login.scss, _signup.scss, _profile.scss, _orders.scss, _categories.scss, _admin.scss.
client/src/scss/main.scss: Root stylesheet.
3. API Services (client/src/services/)
Plain Axios calls without overly complex abstractions:

api.js: Base Axios instance (baseURL: "http://localhost:5000/api/v1/shopco", withCredentials: true).
authService.js: signup, login, logout, getMe, updateProfile.
productService.js: getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductQuantity.
categoryService.js: getCategories, getCategoryById, createCategory, updateCategory, deleteCategory.
cartService.js: getCart, addToCart, updateCartQuantity, removeCartItem, clearCart.
orderService.js: checkout, getMyOrders, getOrderById, getAllOrdersAdmin, getOrderByIdAdmin, updateOrderStatusAdmin.
couponService.js: validateCoupon, getAllCoupons, createCoupon, deleteCoupon.
reviewService.js: getProductReviews, createReview, updateReview, deleteReview.
adminService.js: getDashboardStats, getAllUsers, updateUserRole.
4. Redux Store & Slices (client/src/store/)
store.js: Redux store configuration.
slices/authSlice.js: User state, login, signup, logout, session check.
slices/productSlice.js: Product list, details, search/filters, pagination.
slices/categorySlice.js: Categories list.
slices/cartSlice.js: Cart items, count, coupon discount, subtotal, total.
slices/orderSlice.js: User orders and current order.
slices/adminSlice.js: Dashboard statistics, admin product/category/order/user data.
5. Reusable Components (client/src/components/)
Navbar.jsx: Top notification bar, logo, nav links, debounced search bar, cart icon with badge, user profile dropdown/login button, mobile hamburger drawer.
Footer.jsx: Newsletter subscription card, company links, social icons, payment provider badges.
ProductCard.jsx: React.memo optimized card with image, title, star rating, current price, original price, discount badge.
StarRating.jsx: Render stars and numeric rating (X/5).
Pagination.jsx: Responsive pagination controls (Previous, page numbers, Next).
FilterSidebar.jsx: Filter by category, price range slider/inputs, availability, dress styles, and mobile modal drawer.
Loader.jsx: Clean loading spinner.
ProtectedRoute.jsx: Route guard checking authentication.
AdminRoute.jsx: Route guard checking admin role (user?.role === "admin").
6. Customer Pages (client/src/pages/)
Home.jsx: Hero section, brand logo strip, New Arrivals grid, Top Selling grid, Browse by Dress Style, Testimonials slider, Newsletter.
Categories.jsx: Visual categories grid with click-to-filter navigation to /products?category=....
Products.jsx: Product catalog with debounced search, category filter, price filter, sorting, pagination, and out-of-stock badge.
ProductDetails.jsx: Thumbnail gallery, product info, star ratings, color/size selector, quantity adjuster, stock status ("OUT OF STOCK" indicator), Add to Cart button, Customer Reviews section with add review dialog.
Cart.jsx: Cart items list with image, title, price, size, color, quantity stepper, remove button, coupon promo code input, order summary, checkout action.
CheckoutModal.jsx: Shipping address collection, total summary confirmation, and order creation.
Login.jsx: Split layout matching frontend-ref, email/password login, error feedback, redirect.
Signup.jsx: Matching login theme, user registration form.
Profile.jsx: User profile view and update form (name, email, phone, address).
Orders.jsx: User's order history table/cards with status badges.
OrderDetails.jsx: Comprehensive order receipt with items purchased, prices, and shipping details.
7. Admin Section (client/src/pages/admin/ - Lazy Loaded)
AdminLayout.jsx: Admin sidebar with navigation links, admin header, and content outlet.
AdminDashboard.jsx: Metrics cards (total products, categories, users, orders, out-of-stock, low-stock <= 5).
AdminProducts.jsx: Products table with search, stock indicators, delete, stock update, add/edit links.
AdminProductAdd.jsx: Add product form with FormData image upload and category assignment.
AdminProductEdit.jsx: Edit product details and images.
AdminCategories.jsx: Category list and add/edit category modal.
AdminOrders.jsx: Order management with status update dropdown (Pending, Processing, Shipped, Delivered).
AdminOrderDetails.jsx: Admin view of order items and buyer information.
AdminUsers.jsx: User list with role dropdown (user / admin).
Verification Plan
Automated / Build Verification
Run npm install in client to ensure all dependencies resolve without conflicts.
Run npm run build in client to verify Vite builds successfully with zero JSX/SCSS syntax errors.
End-to-End Workflow Verification
Server health: Start server on port 5000 and verify MongoDB connection.
Customer Flow:
Register a new customer (/signup) -> verify redirection.
Login (/login) -> verify auth state and navbar user menu.
Browse Home (/) -> inspect New Arrivals and Top Selling.
View Categories (/categories) -> click category -> navigate to /products?category=....
Search with debounce -> verify products update without page reload.
Filter by price and availability -> verify query params and pagination.
View Product Details (/products/:id) -> adjust quantity -> Add to Cart.
Open Cart (/cart) -> verify subtotal, apply coupon (WELCOME10), click checkout.
Confirm order -> redirected to Orders (/orders) -> open Order Details (/orders/:id).
Profile (/profile) -> update user details and verify saved state.
Admin Flow:
Login with admin credentials -> access /admin.
Verify dashboard counters (products, categories, users, orders, low-stock <= 5).
Test Add Product with image upload (/admin/products/add).
Test Edit Product and quantity update.
Test Categories management (/admin/categories).
Test Order Status update (/admin/orders).
Test User role update (/admin/users).
Verify that non-admin accounts are blocked from accessing /admin.






1. MY PROJECT STRUCTURE AND REFERENCES
I will provide a folder called:

frontend-ref

Inside this folder there will be old frontend code written using:

HTML
SCSS
JavaScript

The reference folder contains pages such as:

Home
Cart
Product Details
Login
and other existing pages

I will also provide Figma designs/documents for some customer-facing pages.

You MUST inspect these references before creating the React pages.

Use the references as follows:

Figma
   ↓
Primary design reference when available

frontend-ref HTML/SCSS/JS
   ↓
Secondary design and functionality reference

Do not create a completely different design if the Figma or existing frontend reference already provides the design.

2. HOW TO USE THE frontend-ref FOLDER
The frontend-ref folder is NOT the final React application.

It is a reference for converting the old frontend into React.

For example, if you find:

frontend-ref/
    home/
        index.html
        style.scss
        script.js

understand how that page works and recreate it as React components.

Do NOT simply paste the HTML into one giant React component.

Instead:

convert HTML structure into React JSX
reuse/adapt the SCSS
convert vanilla JavaScript interactions into React state/hooks
connect the page to Redux/API where required
keep the same visual appearance as much as reasonably possible
Use the existing frontend reference for:

colors
fonts
spacing
layout
product cards
navbar
footer
buttons
forms
images
responsive behavior
interactions
Do not blindly copy old JavaScript.

React should control the UI.

3. FIGMA
I will provide Figma documents/designs.

Use the Figma designs for the pages where they are available.

Match the design as closely as possible:

layout
colors
typography
spacing
buttons
cards
product grids
forms
images
borders
shadows
responsive behavior
If there is a conflict:

Figma > frontend-ref > your own design decision

For pages without Figma, use the existing frontend-ref design where available.

4. ADMIN DESIGN
There is no Figma design for the admin panel.

Therefore, create the admin panel yourself based on the assignment requirements.

Keep it simple.

Do not create an advanced enterprise dashboard.

Use a straightforward structure such as:

Admin Layout
    Sidebar
    Header
    Main Content

Admin pages should visually fit the customer website but can have their own clean dashboard style.

5. TECHNOLOGY
Use:

React.js
React Router DOM
Redux Toolkit
React Redux
SCSS
React Toastify
Axios or the existing API client
Use createAsyncThunk for asynchronous Redux operations.

Do not use TypeScript.

Do not introduce unnecessary libraries.

Do not use advanced React architecture.

Do not use advanced state management.

Keep everything simple and readable.

6. ROUTING
Use React Router DOM.

Use the path format for routes.

For example:

<Route path="/" element={<Home />} />
<Route path="/products" element={<Products />} />
<Route path="/products/:id" element={<ProductDetails />} />
<Route path="/cart" element={<Cart />} />
<Route path="/login" element={<Login />} />

Do not create unnecessary complicated route configuration.

Use:

ProtectedRoute

for authenticated pages.

Use:

AdminRoute

for admin-only pages.

Normal users must not be able to access admin pages.

7. CUSTOMER ROUTES
Create these routes:

/
 /categories
 /products
 /products/:id
 /cart
 /login
 /signup
 /profile
 /orders
 /orders/:id

Use the actual existing project structure if it already has routes.

8. ADMIN ROUTES
Create:

/admin
/admin/products
/admin/products/add
/admin/products/edit/:id
/admin/categories
/admin/orders
/admin/orders/:id
/admin/users

These routes must be protected by AdminRoute.

Only users with:

role === "admin"

can access them.

9. CUSTOMER PAGES
Build the following:

Home
Categories
Product Listing
Product Details
Cart
Login
Signup
Profile
Orders
Order Details
The following pages already have references in frontend-ref:

Home
Cart
Product Details
Login
other available reference pages
Reuse their design and functionality.

For pages that don't have references, create them based on the assignment requirements and keep the design consistent.

10. HOME PAGE
Inspect the existing Home page inside frontend-ref.

Convert it to React.

Preserve the existing design.

Connect products/categories to the backend where required.

Do not unnecessarily redesign it.

11. CATEGORIES PAGE
Create:

/categories

Load categories from the backend.

Display categories in a clean UI.

When a user selects a category, navigate to the product listing with that category selected.

Example:

/products?category=123

Use the actual category ID/API format from the backend.

Handle:

loading
errors
empty categories
12. PRODUCT LISTING
Create:

/products

Products must come from the backend.

Implement:

search
category filter
price range
availability
sorting
pagination
Search should:

support partial text
be case-insensitive through the backend
use debounce
avoid an API request for every keystroke
Do not download the entire product database and filter it in React.

Send filters to the backend.

For example:

/products?search=phone&category=123&minPrice=100&maxPrice=1000&sort=price_asc&page=1

Use the actual backend API format after inspecting the backend.

When search/filter changes:

page = 1

Pagination must work with search/filter/sort.

13. PRODUCT DETAILS
Inspect the existing Product Details implementation inside:

frontend-ref

Rebuild it as React.

Display:

images
name
description
price
category
quantity/stock
status
quantity selector
Add to Cart
reviews if supported
If quantity is zero:

OUT OF STOCK

Disable Add to Cart.

Do not allow the frontend to select more quantity than available.

Backend inventory validation remains the final authority.

14. CART
Inspect the existing Cart page in:

frontend-ref

Convert it to React.

Users should be able to:

add products
increase quantity
decrease quantity
remove product
clear cart
apply coupon
see subtotal
see discount
see final total
checkout
Use the backend cart APIs.

Do not trust frontend totals for checkout.

The backend calculates the actual order total.

Use React Toastify for success/error messages.

15. LOGIN
Use the existing Login design from:

frontend-ref

Connect it to the backend.

Implement:

email
password
login
error handling
loading state
success toast
redirect after login
Use the backend authentication system.

If authentication uses HTTP-only cookies, configure Axios/API requests appropriately.

Do not unnecessarily store sensitive authentication data in localStorage.

16. SIGNUP
Create Signup page.

Use the same visual style as Login.

Fields should follow the backend user schema.

At minimum:

name
email
password
Handle:

validation
loading
API errors
success
redirect/login behavior
Normal users should be created with the normal user role.

The frontend must never allow a normal user to choose:

role = admin

17. PROFILE
Create:

/profile

Display data from backend:

name
email
phone
address
profile image
account information
order information
Allow users to update appropriate profile fields.

Do not allow a normal user to change their role.

If the backend supports profile image upload, use it.

18. ORDERS
Create:

/orders

Display the logged-in user's orders.

Show:

order date
status
products
quantities
total
A normal user must only see their own orders.

Click an order to open:

/orders/:id

19. ORDER DETAILS
Display:

order ID
order date
status
products
quantity
price at purchase
subtotal
discount
total
shipping information
Do not recalculate historical order prices on the frontend.

Use the backend response.

20. REVIEWS
If the backend has review APIs, implement reviews.

Users should be able to:

view reviews
add review
update their review
delete their review
Use simple UI.

Use Toastify for messages.

21. ADMIN DASHBOARD
Create:

/admin

Show:

total products
total categories
total users
total orders
out-of-stock products
low-stock products
Use simple statistic cards.

Low stock threshold:

quantity <= 5

22. ADMIN PRODUCTS
Create:

/admin/products

Admin can:

view products
search products
add products
edit products
delete products
update quantity
assign category
upload images
Create simple forms.

Use Multer if the backend already supports image upload.

Use:

FormData

when uploading files.

Do not introduce Cloudinary or another image service.

23. ADMIN CATEGORIES
Create:

/admin/categories

Admin can:

view categories
add category
edit category
delete category
Keep the UI simple.

24. ADMIN ORDERS
Create:

/admin/orders

Admin can:

view all orders
view order details
update order status
Use a responsive table.

25. ADMIN USERS
If the backend supports user management, create:

/admin/users

Admin can:

view users
update user role
Roles are only:

user
admin

Never display passwords.

Normal users cannot access this page.

26. API SERVICES
ALL API calls should be placed inside service files.

Do not put Axios calls directly inside components.

Use a simple structure such as:

services/
    product.js
    category.js
    cart.js
    order.js
    user.js
    review.js
    admin.js

Follow my existing project structure if one already exists.

Keep service functions very simple.

Example:

export const getProducts = async (params) => {
    const response = await api.get("/products", { params });
    return response.data;
};

Another example:

export const getProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

Do not create unnecessary API abstraction layers.

Use actual backend endpoints after inspecting my backend.

27. REDUX
Use Redux Toolkit.

Use Redux for shared application data such as:

user/auth
products where needed
categories where needed
cart
orders
admin data where appropriate

Do NOT put every piece of state into Redux.

Keep simple UI state local:

modal
dropdown
input
filter UI
form state

unless there is a good reason to use Redux.

28. REDUX SLICES
A simple structure is preferred:

store/
    store.js

    slices/
        userSlice.js
        productSlice.js
        categorySlice.js
        cartSlice.js
        orderSlice.js
        reviewSlice.js
        adminSlice.js

If the project already has a Redux structure, use and improve it rather than creating another one.

29. CREATE ASYNC THUNK
Use createAsyncThunk for API calls that belong in Redux.

Keep it simple.

Example:

export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async (params, thunkAPI) => {
        try {
            return await getProducts(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);

Do not create complicated Redux abstractions.

30. AUTH STATE
After login:

save the user information in Redux
keep the user authenticated after refresh using the backend authentication mechanism
fetch current user/profile when the application starts if required
logout should clear user state
Use protected routes.

31. TOASTIFY
Use React Toastify.

Use it for:

login success/failure
signup success/failure
logout
product added to cart
cart update
product deleted
category created/updated/deleted
profile updated
checkout
review actions
admin actions
Do not use:

alert()

32. LOADING STATES
Implement simple loading states for API calls.

Examples:

product loading
category loading
cart loading
order loading
profile loading
admin loading
Do not build a complicated loading framework.

33. ERROR STATES
Handle:

API errors
invalid product
invalid category
login failure
signup failure
empty products
empty categories
empty cart
out of stock
checkout failure
unauthorized access
forbidden admin access
Do not leave pages blank when an API fails.

34. RESPONSIVE DESIGN
The entire frontend must work on:

desktop
laptop
tablet
mobile
Pay special attention to:

navbar
product grid
filters
forms
cart
profile
orders
admin dashboard
admin sidebar
admin tables
Do not create unnecessary horizontal scrolling.

Use SCSS media queries.

35. SCSS
Use SCSS for styling.

Keep SCSS organized.

Do not create one massive stylesheet.

Reuse existing SCSS from frontend-ref where it makes sense.

Create separate styles for pages/components where appropriate.

Use:

variables
nesting
media queries
reusable classes
but keep everything simple.

36. COMPONENTS
Create reusable components only where they actually make sense.

For example:

components/
    Navbar
    Footer
    ProductCard
    ProductGrid
    SearchBar
    Filter
    Pagination
    Loader
    ProtectedRoute
    AdminRoute
    Modal

Do not create hundreds of tiny components.

Do not create huge monolithic components either.

Use reasonable component sizes.

37. LAZY LOADING
Use React lazy loading for appropriate pages.

Especially lazy load the Admin section.

For example:

const AdminDashboard = lazy(
    () => import("./pages/admin/AdminDashboard")
);

Use Suspense.

Do not lazy-load every small component unnecessarily.

38. PERFORMANCE
The assignment specifically requires React performance consideration.

Implement only meaningful optimizations.

Use:

useMemo
Use it where there is an actual expensive calculation.

Good example:

cart totals
expensive derived data
Do not use useMemo everywhere.

useCallback
Use it when it actually helps with function references and prevents unnecessary renders, especially with memoized children.

React.memo
Use it for components that actually benefit from avoiding unnecessary renders.

Do not add these just to satisfy the assignment.

I need to be able to explain why they were used.

39. SEARCH DEBOUNCE
Product search must be debounced.

Do not call the API on every keystroke.

Example behavior:

p
ph
pho
phon
phone

should not create five immediate API requests.

Wait until the user stops typing and then call the API.

Keep the implementation simple.

40. IMAGE UPLOAD
The backend already uses/supports Multer.

If image upload APIs already exist:

Use them.

For admin product/category image upload:

File input
    ↓
FormData
    ↓
API service
    ↓
Backend Multer

Do not add unnecessary image services.

Use the image URLs/data returned by the backend.

41. BACKEND INSPECTION
The backend is almost ready.

Before implementing API integration:

Inspect the backend code.

Check:

routes
controllers
repositories
models
authentication
middleware
product APIs
category APIs
cart APIs
order APIs
review APIs
user APIs
admin APIs
Multer/image APIs
Use the existing backend API structure.

Do not guess endpoint names.

42. IF AN API IS MISSING
If the frontend requires an API that does not exist:

First check whether an existing API can already handle the requirement.

If it cannot:

You are allowed to create the missing backend API.

However:

keep it simple
follow the existing backend structure
do not rewrite unrelated code
do not add advanced architecture
do not add unnecessary abstractions
do not add comments
The backend should remain easy to understand.

43. EXISTING BACKEND CODE
You are allowed to modify existing backend files when necessary.

For example, if an existing API has a bug or does not return required data, fix it.

But do not rewrite working backend code unnecessarily.

Keep the existing naming and structure when possible.

44. CODE STYLE — VERY IMPORTANT
Write code at a BASIC/MID LEVEL.

The code should look like a normal developer wrote it.

I should be able to understand the code and explain it during my assignment review.

Prefer:

const response = await getProducts(params);

instead of creating multiple abstraction layers.

Prefer simple Redux slices.

Prefer simple service functions.

Prefer straightforward React components.

Prefer readable variable names.

Avoid:

advanced design patterns
unnecessary custom hooks
complicated generic components
complicated API wrappers
unnecessary abstractions
advanced caching
complicated state machines
unnecessary libraries
unnecessary memoization
overly clever code
DO NOT add comments inside the code.

45. DO NOT DUPLICATE EXISTING CODE
Before creating anything:

Check whether it already exists.

If there is already:

ProductCard
Navbar
Footer
Button
Modal
Loader
API service
Redux slice

reuse it where appropriate.

Do not create duplicate versions.

46. IMPORTANT — DO NOT DESTROY MY EXISTING WORK
My existing frontend code is important.

The files in:

frontend-ref

are references.

My existing React code may also contain useful functionality.

Before modifying something:

Understand what it does.

Keep useful functionality.

Improve it where necessary.

Do not delete working code just to create a new implementation.

47. ASSIGNMENT REQUIREMENTS
The final frontend should satisfy these requirements:

Customer:

Home
Categories
Product Listing
Product Details
Cart
Login
Signup
Profile
Orders
Order Details
Search
Debounced search
Category filtering
Price filtering
Availability filtering
Sorting
Pagination
Inventory display
Out-of-stock handling
Cart quantity handling
Coupon handling
Checkout
Reviews where supported
Responsive design
Loading states
Error states
Admin:

Dashboard
Product management
Add product
Edit product
Delete product
Stock management
Category management
Add category
Edit category
Delete category
Order management
Order details
Update order status
User management if backend supports it
User role management
Performance:

debounced search
lazy-loaded admin pages
meaningful useMemo
meaningful useCallback
meaningful React.memo
reduced unnecessary API requests
responsive UI
48. FINAL WORKFLOW
Follow this workflow.

STEP 1:

Inspect the entire existing frontend project.

STEP 2:

Inspect:

frontend-ref

and understand the existing HTML/SCSS/JS.

STEP 3:

Inspect the provided Figma designs.

STEP 4:

Inspect the backend APIs.

STEP 5:

Make a short internal plan of:

Already exists
Needs modification
Needs creation

STEP 6:

Build/rebuild the customer pages in React.

STEP 7:

Connect the customer pages to the backend.

STEP 8:

Build the Admin section.

STEP 9:

Connect Admin pages to the backend.

STEP 10:

Implement Redux where needed.

STEP 11:

Implement protected routes and admin routes.

STEP 12:

Implement loading/error/empty states.

STEP 13:

Implement responsive SCSS.

STEP 14:

Implement meaningful performance optimizations.

STEP 15:

Test all important user flows.

49. USER FLOW TO TEST
Test this complete flow:

Signup
   ↓
Login
   ↓
Home
   ↓
Categories
   ↓
Products
   ↓
Search
   ↓
Filter
   ↓
Sort
   ↓
Pagination
   ↓
Product Details
   ↓
Add to Cart
   ↓
Cart
   ↓
Checkout
   ↓
Order Created
   ↓
Orders
   ↓
Order Details
   ↓
Profile

Also test:

Admin Login
   ↓
Admin Dashboard
   ↓
Products
   ↓
Add/Edit/Delete Product
   ↓
Categories
   ↓
Add/Edit/Delete Category
   ↓
Orders
   ↓
Update Order Status
   ↓
Users
   ↓
Role Management

Test that a normal user cannot access:

/admin

50. FINAL CHECK BEFORE FINISHING
After implementation, inspect the complete project again.

Make sure:

there are no duplicate pages
there are no duplicate API calls
API calls are inside services
Redux is used appropriately
createAsyncThunk is used for async Redux operations
React Router DOM is used
ProtectedRoute exists
AdminRoute exists
admin pages are protected
search is debounced
pagination works
filters work together
cart works
checkout works
profile works
orders work
inventory is respected
images work
Multer upload works where required
Toastify is used
loading states exist
error states exist
responsive design works
admin pages are lazy-loaded
SCSS is organized
no unnecessary advanced code exists
MOST IMPORTANT RULE
Keep the implementation SIMPLE.

This is a student MERN assignment.

Do not try to make this look like a large production enterprise application.

The code should be:

simple
readable
understandable
maintainable
human-written

I need to be able to explain:

Component
   ↓
Redux
   ↓
createAsyncThunk
   ↓
Service function
   ↓
Backend API

without needing to explain a complicated architecture.

Use my Figma and frontend-ref as the design source.

Build the missing pages yourself where there is no reference.

If something is missing in the backend, create the simplest API needed.

Do not add comments to the source code.

Do not unnecessarily rewrite existing code.

Build the project according to the complete assignment requirements above.

can you please build this as simple as look like that is written by human dont write the advance level code avoid the comment 
take care of the resposive ness as well okay use scss mixins vaiblae and one function that convert px to rem 
scss folder structreand font family  you can take ref form the frontend Ref 

