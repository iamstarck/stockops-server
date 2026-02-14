import { prisma } from "./lib/prisma.ts";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      password: "securepassword",
      role: "ADMIN",
    },
    include: {
      movements: true,
    },
  });
  console.log("Created user:", user);

  const category = await prisma.productCategory.create({
    data: {
      name: "Electronics",
      products: {
        create: {
          name: "Smartphone",
          sku: "SKU-001",
          stock: 10,
          minimum_stock: 2,
        },
      },
    },
    include: {
      products: true,
    },
  });
  console.log("Created category with product:", category);

  if (category.products.length > 0 && category.products[0]) {
    const movement = await prisma.stockMovement.create({
      data: {
        type: "IN",
        quantity: 5,
        note: "Initial stock",
        productId: category.products[0].id,
        createdById: user.id,
      },
      include: {
        product: true,
        createdBy: true,
      },
    });
    console.log("Created stock movement:", movement);
  }

  const allUsers = await prisma.user.findMany({
    include: {
      movements: {
        include: {
          product: true,
        },
      },
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));

  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      movements: {
        include: {
          createdBy: true,
        },
      },
    },
  });
  console.log("All products:", JSON.stringify(allProducts, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
