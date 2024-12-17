import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface CategoryWithData {
  id: number;
  name: string;
}

// Define realistic e-commerce categories and subcategories
const categoryStructure = {
  Electronics: [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Headphones",
    "Smart Watches",
    "Gaming Consoles",
    "Cameras",
  ],
  Fashion: [
    "Men's Clothing",
    "Women's Clothing",
    "Kids' Clothing",
    "Shoes",
    "Accessories",
    "Jewelry",
    "Bags",
  ],
  "Home & Living": [
    "Furniture",
    "Kitchen & Dining",
    "Bedding",
    "Home Decor",
    "Storage & Organization",
    "Lighting",
    "Rugs & Carpets",
  ],
  "Beauty & Personal Care": [
    "Skincare",
    "Makeup",
    "Haircare",
    "Fragrances",
    "Personal Hygiene",
    "Beauty Tools",
    "Men's Grooming",
  ],
  "Sports & Outdoor": [
    "Exercise Equipment",
    "Sports Gear",
    "Outdoor Recreation",
    "Athletic Clothing",
    "Camping Gear",
    "Bicycles",
    "Sports Accessories",
  ],
  "Books & Stationery": [
    "Fiction Books",
    "Non-Fiction Books",
    "Academic Books",
    "Notebooks",
    "Art Supplies",
    "Office Supplies",
    "Calendars & Planners",
  ],
};

// Product attributes by category for more realistic data
const productAttributes: Record<
  string,
  { brands: string[]; specs: string[]; prefixes: string[] }
> = {
  Smartphones: {
    brands: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
    specs: ["5G", "4G", "Dual SIM", "256GB", "128GB", "64GB"],
    prefixes: ["iPhone", "Galaxy", "Pixel", "Nord", "Redmi"],
  },
  Laptops: {
    brands: ["Dell", "HP", "Lenovo", "ASUS", "Apple"],
    specs: ["i7", "i5", "Ryzen 7", "16GB RAM", "8GB RAM", "512GB SSD"],
    prefixes: ["XPS", "Pavilion", "ThinkPad", "ROG", "MacBook"],
  },
};

// Realistic shop categories
const shopTypes = [
  "Electronics Store",
  "Fashion Boutique",
  "Home Decor Store",
  "Beauty Supply Store",
  "Sports Equipment Store",
  "Bookstore",
  "Department Store",
  "Specialty Store",
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.tracking.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.shop.deleteMany(),
    prisma.address.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("🧹 Cleaned up existing data");

  // Create admin users
  const adminUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        name: "System Administrator",
        role: Role.ADMIN,
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
      },
    }),
    prisma.user.create({
      data: {
        email: "moderator@example.com",
        password: await bcrypt.hash("admin123", 10),
        name: "Content Moderator",
        role: Role.ADMIN,
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
      },
    }),
  ]);

  console.log("👥 Created admin users");

  // Create sellers with realistic business names
  const sellers = await Promise.all(
    Array(10)
      .fill(null)
      .map(async (_, index) => {
        const businessType = faker.helpers.arrayElement(shopTypes);
        return prisma.user.create({
          data: {
            email: `seller${index + 1}@example.com`,
            password: await bcrypt.hash("seller123", 10),
            name: faker.person.fullName(),
            role: Role.SELLER,
            phone: faker.phone.number(),
            avatar: faker.image.avatar(),
          },
        });
      })
  );

  console.log("👥 Created sellers");

  // Create regular users
  const regularUsers = await Promise.all(
    Array(20)
      .fill(null)
      .map(async (_, index) => {
        return prisma.user.create({
          data: {
            email: `user${index + 1}@example.com`,
            password: await bcrypt.hash("user123", 10),
            name: faker.person.fullName(),
            role: Role.USER,
            phone: faker.phone.number(),
            avatar: faker.image.avatar(),
          },
        });
      })
  );

  console.log("👥 Created regular users");

  // Create shops with more realistic data
  const shops = await Promise.all(
    sellers.map((seller) => {
      const shopType = faker.helpers.arrayElement(shopTypes);
      const isVerified = Math.random() > 0.2; // 80% shops are verified
      return prisma.shop.create({
        data: {
          name: `${faker.company.name()} ${shopType}`,
          description: `${faker.company.catchPhrase()} - Your trusted ${shopType.toLowerCase()} since ${faker.date
            .past()
            .getFullYear()}`,
          logo: faker.image.url(),
          banner: faker.image.url(),
          sellerId: seller.id,
          isVerified,
          rating: faker.number.float({
            min: isVerified ? 4.0 : 3.0,
            max: 5,
            fractionDigits: 1,
          }),
        },
      });
    })
  );

  console.log("🏪 Created shops");

  // Create categories and subcategories
  const categoriesMap = new Map();

  for (const [mainCategory, subcategories] of Object.entries(
    categoryStructure
  )) {
    const mainCat = await prisma.category.create({
      data: {
        name: mainCategory,
        description: faker.commerce.productDescription(),
        image: faker.image.url(),
      },
    });

    const subCats = await Promise.all(
      subcategories.map((subcat) =>
        prisma.category.create({
          data: {
            name: subcat,
            description: faker.commerce.productDescription(),
            image: faker.image.url(),
            parentId: mainCat.id,
          },
        })
      )
    );

    categoriesMap.set(mainCategory, {
      main: mainCat,
      subs: subCats,
    });
  }

  console.log("📑 Created categories and subcategories");

  // Helper function to generate product name based on category
  const generateProductName = (categoryName: string) => {
    const attrs = productAttributes[categoryName];
    if (attrs) {
      const brand = faker.helpers.arrayElement(attrs.brands);
      const spec = faker.helpers.arrayElement(attrs.specs);
      const prefix = faker.helpers.arrayElement(attrs.prefixes);
      return `${brand} ${prefix} ${spec}`;
    }
    return `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
  };

  // Replace the product creation section with this fixed version
  // Create products with realistic data
  const products: any[] = [];
  for (const shop of shops) {
    const productCount = faker.number.int({ min: 15, max: 30 });

    // Get all categories
    const allCategories = Array.from(categoriesMap.values()).map((cat) => ({
      main: cat.main,
      subs: cat.subs as CategoryWithData[],
    }));

    for (let i = 0; i < productCount; i++) {
      // Randomly select a category and subcategory
      const categoryGroup = faker.helpers.arrayElement(allCategories);
      const subcategory = faker.helpers.arrayElement(
        categoryGroup.subs
      ) as CategoryWithData;

      const basePrice = parseFloat(
        faker.commerce.price({ min: 10, max: 2000 })
      );
      const discount =
        Math.random() > 0.7
          ? faker.number.float({ min: 0.1, max: 0.5, fractionDigits: 2 })
          : 0;

      const product = await prisma.product.create({
        data: {
          name: generateProductName(subcategory.name),
          description: faker.commerce.productDescription(),
          price: basePrice,
          sellerId: shop.sellerId,
          shopId: shop.id,
          categoryId: subcategory.id,
          stock: faker.number.int({ min: 0, max: 200 }),
          images: Array(faker.number.int({ min: 3, max: 6 }))
            .fill(null)
            .map(() => faker.image.url()),
          isActive: Math.random() > 0.1, // 90% products are active
          rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
          discount,
          sku: `${subcategory.name.substring(0, 3).toUpperCase()}-${
            shop.id
          }-${String(i).padStart(5, "0")}`,
        },
      });

      products.push(product);
    }
  }

  console.log("📦 Created products");

  // Create reviews
  const reviewTemplates = [
    "Great product! {feature}. Definitely recommend.",
    "Nice quality for the price. {feature}, but {drawback}.",
    "Exactly as described. {feature}. Shipping was fast.",
    "Good value for money. {feature}. Would buy again.",
    "{feature}. However, {drawback}. Overall satisfied.",
  ];

  const features = [
    "The material is excellent",
    "Works perfectly",
    "Very well made",
    "Looks beautiful",
    "Easy to use",
    "Great design",
  ];

  const drawbacks = [
    "could be cheaper",
    "delivery took a while",
    "packaging could be better",
    "minor issues with finish",
    "setup takes time",
  ];

  for (const product of products) {
    const reviewCount = faker.number.int({ min: 0, max: 8 });

    for (let i = 0; i < reviewCount; i++) {
      const rating = faker.number.int({ min: 3, max: 5 });
      const template = faker.helpers
        .arrayElement(reviewTemplates)
        .replace("{feature}", faker.helpers.arrayElement(features))
        .replace("{drawback}", faker.helpers.arrayElement(drawbacks));

      const user = faker.helpers.arrayElement(regularUsers);
      await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          shopId: product.shopId,
          rating,
          comment: template,
          images: Array(faker.number.int({ min: 0, max: 2 }))
            .fill(null)
            .map(() => faker.image.url()),
        },
      });
    }
  }

  console.log("⭐ Created reviews");

  // Create addresses
  for (const user of [...regularUsers, ...sellers]) {
    const addressCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < addressCount; i++) {
      await prisma.address.create({
        data: {
          userId: user.id,
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          postalCode: faker.location.zipCode(),
          isDefault: i === 0,
        },
      });
    }
  }

  console.log("📍 Created addresses");

  // Create orders with tracking
  for (const user of regularUsers) {
    const orderCount = faker.number.int({ min: 0, max: 5 });

    for (let i = 0; i < orderCount; i++) {
      const orderProducts = faker.helpers.arrayElements(
        products,
        faker.number.int({ min: 1, max: 4 })
      );
      const total = orderProducts.reduce(
        (sum, product) => sum + product.price * (1 - product.discount),
        0
      );

      const userAddress = await prisma.address.findFirst({
        where: { userId: user.id },
      });

      if (!userAddress) continue;

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          addressId: userAddress.id,
          status: faker.helpers.arrayElement(Object.values(OrderStatus)),
          paymentStatus: faker.helpers.arrayElement(
            Object.values(PaymentStatus)
          ),
          paymentMethod: faker.helpers.arrayElement([
            "CREDIT_CARD",
            "DEBIT_CARD",
            "PAYPAL",
            "STRIPE",
          ]),
          total,
        },
      });

      // Create order items
      for (const product of orderProducts) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 3 }),
            price: product.price * (1 - product.discount),
          },
        });
      }

      // Create tracking for orders that are not pending
      if (order.status !== OrderStatus.PENDING) {
        await prisma.tracking.create({
          data: {
            orderId: order.id,
            carrier: faker.helpers.arrayElement([
              "FedEx",
              "UPS",
              "DHL",
              "USPS",
            ]),
            trackingNo: faker.string.alphanumeric({
              length: 12,
              casing: "upper",
            }),
            status: order.status,
            updates: Array(faker.number.int({ min: 1, max: 4 }))
              .fill(null)
              .map(() => ({
                status: faker.helpers.arrayElement([
                  "In Transit",
                  "Out for Delivery",
                  "Delivered",
                  "Processing",
                ]),
                location: faker.location.city(),
                timestamp: faker.date.recent(),
                description: faker.helpers.arrayElement([
                  "Package has left the facility",
                  "Package arrived at sorting center",
                  "Out for delivery",
                  "Delivered to recipient",
                ]),
              })),
          },
        });
      }
    }
  }

  console.log("📦 Created orders with tracking");

  // Create shopping carts
  for (const user of regularUsers) {
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    if (Math.random() > 0.3) {
      // 70% chance of having items in cart
      const cartItemCount = faker.number.int({ min: 1, max: 5 });
      const cartProducts = faker.helpers.arrayElements(products, cartItemCount);

      for (const product of cartProducts) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 5 }),
          },
        });
      }
    }
  }

  console.log("🛒 Created carts");

  // Update product and shop ratings based on reviews
  console.log("📊 Updating ratings...");

  // Update product ratings
  for (const product of products) {
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
    });

    if (reviews.length > 0) {
      const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;

      await prisma.product.update({
        where: { id: product.id },
        data: { rating: parseFloat(averageRating.toFixed(1)) },
      });
    }
  }

  // Update shop ratings
  for (const shop of shops) {
    const reviews = await prisma.review.findMany({
      where: { shopId: shop.id },
    });

    if (reviews.length > 0) {
      const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;

      await prisma.shop.update({
        where: { id: shop.id },
        data: { rating: parseFloat(averageRating.toFixed(1)) },
      });
    }
  }

  // Print summary statistics
  const stats = {
    users: {
      admins: await prisma.user.count({ where: { role: Role.ADMIN } }),
      sellers: await prisma.user.count({ where: { role: Role.SELLER } }),
      customers: await prisma.user.count({ where: { role: Role.USER } }),
    },
    shops: {
      total: await prisma.shop.count(),
      verified: await prisma.shop.count({ where: { isVerified: true } }),
    },
    categories: {
      main: await prisma.category.count({ where: { parentId: null } }),
      sub: await prisma.category.count({ where: { NOT: { parentId: null } } }),
    },
    products: {
      total: await prisma.product.count(),
      active: await prisma.product.count({ where: { isActive: true } }),
      withDiscount: await prisma.product.count({
        where: { discount: { gt: 0 } },
      }),
    },
    orders: {
      total: await prisma.order.count(),
      status: {
        pending: await prisma.order.count({
          where: { status: OrderStatus.PENDING },
        }),
        processing: await prisma.order.count({
          where: { status: OrderStatus.PROCESSING },
        }),
        shipped: await prisma.order.count({
          where: { status: OrderStatus.SHIPPED },
        }),
        delivered: await prisma.order.count({
          where: { status: OrderStatus.DELIVERED },
        }),
        cancelled: await prisma.order.count({
          where: { status: OrderStatus.CANCELLED },
        }),
      },
      withTracking: await prisma.tracking.count(),
    },
    reviews: {
      total: await prisma.review.count(),
      withImages: await prisma.review.count({
        where: { images: { isEmpty: false } },
      }),
    },
    carts: {
      total: await prisma.cart.count(),
      withItems: await prisma.cart.count({
        where: {
          items: {
            some: {},
          },
        },
      }),
    },
    addresses: await prisma.address.count(),
  };

  console.log("\n📊 Seed Summary:");
  console.log("==================");
  console.log("👥 Users:");
  console.log(`  - ${stats.users.admins} Admins`);
  console.log(`  - ${stats.users.sellers} Sellers`);
  console.log(`  - ${stats.users.customers} Customers`);

  console.log("\n🏪 Shops:");
  console.log(`  - Total: ${stats.shops.total}`);
  console.log(`  - Verified: ${stats.shops.verified}`);

  console.log("\n📑 Categories:");
  console.log(`  - ${stats.categories.main} Main categories`);
  console.log(`  - ${stats.categories.sub} Subcategories`);

  console.log("\n📦 Products:");
  console.log(`  - Total: ${stats.products.total}`);
  console.log(`  - Active: ${stats.products.active}`);
  console.log(`  - With discount: ${stats.products.withDiscount}`);

  console.log("\n🛍️ Orders:");
  console.log(`  - Total: ${stats.orders.total}`);
  console.log(`  - Pending: ${stats.orders.status.pending}`);
  console.log(`  - Processing: ${stats.orders.status.processing}`);
  console.log(`  - Shipped: ${stats.orders.status.shipped}`);
  console.log(`  - Delivered: ${stats.orders.status.delivered}`);
  console.log(`  - Cancelled: ${stats.orders.status.cancelled}`);
  console.log(`  - With tracking: ${stats.orders.withTracking}`);

  console.log("\n⭐ Reviews:");
  console.log(`  - Total: ${stats.reviews.total}`);
  console.log(`  - With images: ${stats.reviews.withImages}`);

  console.log("\n🛒 Carts:");
  console.log(`  - Total: ${stats.carts.total}`);
  console.log(`  - With items: ${stats.carts.withItems}`);

  console.log("\n📍 Addresses:");
  console.log(`  - Total: ${stats.addresses}`);

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
