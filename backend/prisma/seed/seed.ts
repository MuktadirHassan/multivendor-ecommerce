import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";
import axios from "axios";

const prisma = new PrismaClient();

// Types
interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface CategoryWithData {
  id: number;
  name: string;
}

interface DummyJSONResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Category Manager
class CategoryManager {
  private categoryStructure: { [key: string]: string[] } = {};
  private categoriesMap = new Map<
    string,
    { main: any; subs: CategoryWithData[] }
  >();

  async populateFromProducts(products: DummyProduct[]) {
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    uniqueCategories.forEach((cat) => {
      const formattedCat = this.formatCategoryName(cat);
      this.categoryStructure[formattedCat] = ["General"];
    });
  }

  getCategoryStructure() {
    return this.categoryStructure;
  }

  setCategoriesMap(map: Map<string, { main: any; subs: CategoryWithData[] }>) {
    this.categoriesMap = map;
  }

  getCategoriesMap() {
    return this.categoriesMap;
  }

  private formatCategoryName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

// API Service
class ProductAPIService {
  private static readonly API_URL = "https://dummyjson.com/products";

  async fetchProducts(limit: number = 100): Promise<DummyProduct[]> {
    try {
      const response = await axios.get<DummyJSONResponse>(
        `${ProductAPIService.API_URL}?limit=${limit}`
      );
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
}

// User Manager
class UserManager {
  constructor(private prisma: PrismaClient) {}

  async createAdmins(): Promise<Array<{ id: number }>> {
    return Promise.all([
      this.prisma.user.create({
        data: {
          email: "admin@example.com",
          password: await bcrypt.hash("admin123", 10),
          name: "System Administrator",
          role: Role.ADMIN,
          phone: faker.phone.number(),
          avatar: faker.image.avatar(),
        },
      }),
      this.prisma.user.create({
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
  }

  async createSellers(brands: string[]): Promise<Array<{ id: number }>> {
    return Promise.all(
      brands.map(async (_, index) => {
        return this.prisma.user.create({
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
  }

  async createRegularUsers(count: number): Promise<Array<{ id: number }>> {
    return Promise.all(
      Array(count)
        .fill(null)
        .map(async (_, index) => {
          return this.prisma.user.create({
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
  }
}

// Shop Manager
class ShopManager {
  constructor(private prisma: PrismaClient) {}

  async createShops(
    sellers: Array<{ id: number }>,
    brands: string[]
  ): Promise<Array<{ id: number; sellerId: number; name: string }>> {
    return Promise.all(
      sellers.map((seller, index) => {
        const brand = brands[index];
        return this.prisma.shop.create({
          data: {
            name: `${brand} Official Store`,
            description: faker.company.catchPhrase(),
            logo: faker.image.url(),
            banner: faker.image.url(),
            sellerId: seller.id,
            isVerified: Math.random() > 0.2,
            rating: faker.number.float({ min: 3.5, max: 5 }),
          },
        });
      })
    );
  }
}

// Database Cleaner
class DatabaseCleaner {
  constructor(private prisma: PrismaClient) {}

  async cleanDatabase() {
    await this.prisma.$transaction([
      this.prisma.review.deleteMany(),
      this.prisma.orderItem.deleteMany(),
      this.prisma.tracking.deleteMany(),
      this.prisma.order.deleteMany(),
      this.prisma.cartItem.deleteMany(),
      this.prisma.cart.deleteMany(),
      this.prisma.product.deleteMany(),
      this.prisma.category.deleteMany(),
      this.prisma.shop.deleteMany(),
      this.prisma.address.deleteMany(),
      this.prisma.user.deleteMany(),
    ]);
  }
}

// Main seeding logic
async function main() {
  console.log("🌱 Starting seed...");

  const dbCleaner = new DatabaseCleaner(prisma);
  const userManager = new UserManager(prisma);
  const shopManager = new ShopManager(prisma);
  const productAPI = new ProductAPIService();
  const categoryManager = new CategoryManager();

  // Clean database
  await dbCleaner.cleanDatabase();
  console.log("🧹 Cleaned up existing data");

  // Fetch products
  const dummyProducts = await productAPI.fetchProducts();
  await categoryManager.populateFromProducts(dummyProducts);

  // Create users
  const adminUsers = await userManager.createAdmins();
  console.log("👥 Created admin users");

  const uniqueBrands = [...new Set(dummyProducts.map((p) => p.brand))];
  const sellers = await userManager.createSellers(uniqueBrands);
  console.log("👥 Created sellers");

  const regularUsers = await userManager.createRegularUsers(20);
  console.log("👥 Created regular users");

  // Create shops
  const shops = await shopManager.createShops(sellers, uniqueBrands);
  console.log("🏪 Created shops");

  // Create categories
  const categoriesMap = new Map();
  const categoryStructure = categoryManager.getCategoryStructure();

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

  categoryManager.setCategoriesMap(categoriesMap);
  console.log("📑 Created categories");

  // Create products from dummy products
  const products = await Promise.all(
    dummyProducts.map(async (dummyProduct) => {
      const categoryName =
        dummyProduct.category.charAt(0).toUpperCase() +
        dummyProduct.category.slice(1);
      const category = categoriesMap.get(categoryName);
      const shop = shops.find((s) => s.name.includes(dummyProduct.brand));

      if (!category || !shop) return null;

      return prisma.product.create({
        data: {
          name: dummyProduct.title,
          description: dummyProduct.description,
          price: dummyProduct.price,
          sellerId: shop.sellerId,
          shopId: shop.id,
          categoryId: category.subs[0].id,
          stock: dummyProduct.stock,
          images: [dummyProduct.thumbnail, ...dummyProduct.images],
          isActive: true,
          rating: dummyProduct.rating,
          discount: dummyProduct.discountPercentage / 100,
          sku: `${dummyProduct.category.substring(0, 3).toUpperCase()}-${
            shop.id
          }-${String(dummyProduct.id).padStart(5, "0")}`,
        },
      });
    })
  );

  // Create reviews for products
  await Promise.all(
    products.filter(Boolean).map(async (product) => {
      if (!product) return;

      const reviewCount = faker.number.int({ min: 0, max: 8 });
      const reviewPromises = Array(reviewCount)
        .fill(null)
        .map(async () => {
          const user = faker.helpers.arrayElement(regularUsers);
          return prisma.review.create({
            data: {
              userId: user.id,
              productId: product.id,
              shopId: product.shopId,
              rating: faker.number.int({ min: 3, max: 5 }),
              comment: faker.commerce.productDescription(),
              images: Array(faker.number.int({ min: 0, max: 2 }))
                .fill(null)
                .map(() => faker.image.url()),
            },
          });
        });

      await Promise.all(reviewPromises);
    })
  );

  console.log("⭐ Created reviews");

  // Create addresses
  await Promise.all(
    [...regularUsers, ...sellers].map(async (user) => {
      const addressCount = faker.number.int({ min: 1, max: 3 });
      return Promise.all(
        Array(addressCount)
          .fill(null)
          .map((_, i) =>
            prisma.address.create({
              data: {
                userId: user.id,
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                country: faker.location.country(),
                postalCode: faker.location.zipCode(),
                isDefault: i === 0,
              },
            })
          )
      );
    })
  );

  console.log("📍 Created addresses");

  // Create orders and carts
  await Promise.all(
    regularUsers.map(async (user) => {
      // Create cart
      const cart = await prisma.cart.create({
        data: { userId: user.id },
      });

      if (Math.random() > 0.3) {
        const cartItemCount = faker.number.int({ min: 1, max: 5 });
        const cartProducts = faker.helpers.arrayElements(
          products.filter(Boolean) as any[],
          cartItemCount
        );

        await Promise.all(
          cartProducts.map((product) =>
            prisma.cartItem.create({
              data: {
                cartId: cart.id,
                productId: product.id,
                quantity: faker.number.int({ min: 1, max: 5 }),
              },
            })
          )
        );
      }

      // Create orders
      const orderCount = faker.number.int({ min: 0, max: 5 });
      const address = await prisma.address.findFirst({
        where: { userId: user.id },
      });

      if (!address) return;

      await Promise.all(
        Array(orderCount)
          .fill(null)
          .map(async () => {
            const orderProducts = faker.helpers.arrayElements(
              products.filter(Boolean) as any[],
              faker.number.int({ min: 1, max: 4 })
            );

            const total = orderProducts.reduce(
              (sum, product) =>
                sum + product.price * (1 - (product.discount || 0)),
              0
            );

            const order = await prisma.order.create({
              data: {
                userId: user.id,
                addressId: address.id,
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

            await Promise.all(
              [
                ...orderProducts.map((product) =>
                  prisma.orderItem.create({
                    data: {
                      orderId: order.id,
                      productId: product.id,
                      quantity: faker.number.int({ min: 1, max: 3 }),
                      price: product.price * (1 - (product.discount || 0)),
                    },
                  })
                ),
                order.status !== OrderStatus.PENDING
                  ? prisma.tracking.create({
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
                    })
                  : null,
              ].filter(Boolean)
            );
          })
      );
    })
  );

  console.log("🛒 Created orders and carts");
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
