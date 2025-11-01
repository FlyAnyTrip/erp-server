const mongoose = require("mongoose")
require("dotenv").config()

// Import models
const Sales = require("../models/Sales")
const Inventory = require("../models/Inventory")
const Expense = require("../models/Expense")
const Task = require("../models/Task")
const Admin = require("../models/Admin")

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connected")

    // Clear existing data
    await Sales.deleteMany({})
    await Inventory.deleteMany({})
    await Expense.deleteMany({})
    await Task.deleteMany({})
    console.log("🗑️  Cleared existing data")

    // Create Admin User
    const adminExists = await Admin.findOne({ email: "admin@erp.com" })
    if (!adminExists) {
      const admin = new Admin({
        username: "admin",
        email: "admin@erp.com",
        password: "admin123",
      })
      await admin.save()
      console.log("👤 Admin user created: admin@erp.com / admin123")
    }

    // Sample Sales Data
    const salesData = [
      {
        date: new Date("2024-01-15"),
        productName: "Laptop Dell XPS 13",
        quantity: 5,
        unitPrice: 1200,
        totalAmount: 6000,
        profit: 1200,
        status: "Completed",
      },
      {
        date: new Date("2024-01-16"),
        productName: "iPhone 15 Pro",
        quantity: 10,
        unitPrice: 999,
        totalAmount: 9990,
        profit: 2500,
        status: "Completed",
      },
      {
        date: new Date("2024-01-17"),
        productName: "Samsung 4K Monitor",
        quantity: 8,
        unitPrice: 450,
        totalAmount: 3600,
        profit: 800,
        status: "Completed",
      },
      {
        date: new Date("2024-01-18"),
        productName: "Mechanical Keyboard RGB",
        quantity: 15,
        unitPrice: 150,
        totalAmount: 2250,
        profit: 450,
        status: "Completed",
      },
      {
        date: new Date("2024-01-19"),
        productName: "Wireless Mouse Pro",
        quantity: 20,
        unitPrice: 80,
        totalAmount: 1600,
        profit: 400,
        status: "Completed",
      },
      {
        date: new Date("2024-01-20"),
        productName: "USB-C Hub 7-in-1",
        quantity: 12,
        unitPrice: 65,
        totalAmount: 780,
        profit: 180,
        status: "Completed",
      },
      {
        date: new Date("2024-01-21"),
        productName: "Webcam 4K Ultra HD",
        quantity: 7,
        unitPrice: 200,
        totalAmount: 1400,
        profit: 350,
        status: "Pending",
      },
      {
        date: new Date("2024-01-22"),
        productName: "Headphones Noise Cancelling",
        quantity: 18,
        unitPrice: 350,
        totalAmount: 6300,
        profit: 1800,
        status: "Completed",
      },
      {
        date: new Date("2024-01-23"),
        productName: "Portable SSD 1TB",
        quantity: 9,
        unitPrice: 120,
        totalAmount: 1080,
        profit: 270,
        status: "Completed",
      },
      {
        date: new Date("2024-01-24"),
        productName: "Graphics Card RTX 4070",
        quantity: 3,
        unitPrice: 600,
        totalAmount: 1800,
        profit: 450,
        status: "Completed",
      },
    ]

    await Sales.insertMany(salesData)
    console.log("📊 Sales data inserted: 10 records")

    // Sample Inventory Data
    const inventoryData = [
      {
        productName: "Laptop Dell XPS 13",
        quantity: 25,
        price: 1200,
        minStock: 10,
        category: "Electronics",
        sku: "DELL-XPS-13-001",
      },
      {
        productName: "iPhone 15 Pro",
        quantity: 8,
        price: 999,
        minStock: 15,
        category: "Mobile Phones",
        sku: "APPLE-IP15P-001",
      },
      {
        productName: "Samsung 4K Monitor",
        quantity: 12,
        price: 450,
        minStock: 8,
        category: "Monitors",
        sku: "SAMSUNG-MON-4K",
      },
      {
        productName: "Mechanical Keyboard RGB",
        quantity: 45,
        price: 150,
        minStock: 20,
        category: "Peripherals",
        sku: "MECH-KB-RGB-001",
      },
      {
        productName: "Wireless Mouse Pro",
        quantity: 60,
        price: 80,
        minStock: 30,
        category: "Peripherals",
        sku: "MOUSE-WIRELESS-PRO",
      },
      {
        productName: "USB-C Hub 7-in-1",
        quantity: 5,
        price: 65,
        minStock: 10,
        category: "Accessories",
        sku: "USB-HUB-7IN1-001",
      },
      {
        productName: "Webcam 4K Ultra HD",
        quantity: 18,
        price: 200,
        minStock: 12,
        category: "Peripherals",
        sku: "WEBCAM-4K-UHD",
      },
      {
        productName: "Headphones Noise Cancelling",
        quantity: 32,
        price: 350,
        minStock: 15,
        category: "Audio",
        sku: "HEADPHONES-NC-001",
      },
      {
        productName: "Portable SSD 1TB",
        quantity: 22,
        price: 120,
        minStock: 10,
        category: "Storage",
        sku: "SSD-PORT-1TB-001",
      },
      {
        productName: "Graphics Card RTX 4070",
        quantity: 2,
        price: 600,
        minStock: 5,
        category: "Components",
        sku: "GPU-RTX4070-001",
      },
      {
        productName: "RAM DDR5 32GB",
        quantity: 15,
        price: 180,
        minStock: 8,
        category: "Components",
        sku: "RAM-DDR5-32GB",
      },
      {
        productName: "SSD NVMe 2TB",
        quantity: 10,
        price: 200,
        minStock: 5,
        category: "Storage",
        sku: "SSD-NVME-2TB",
      },
    ]

    await Inventory.insertMany(inventoryData)
    console.log("📦 Inventory data inserted: 12 records")

    // Sample Expense Data
    const expenseData = [
      {
        date: new Date("2024-01-10"),
        category: "Utilities",
        description: "Electricity bill for January",
        amount: 450,
        status: "Approved",
      },
      {
        date: new Date("2024-01-12"),
        category: "Salaries",
        description: "Monthly salary for 5 employees",
        amount: 15000,
        status: "Approved",
      },
      {
        date: new Date("2024-01-15"),
        category: "Rent",
        description: "Office rent for January",
        amount: 3000,
        status: "Approved",
      },
      {
        date: new Date("2024-01-18"),
        category: "Supplies",
        description: "Office supplies and stationery",
        amount: 250,
        status: "Pending",
      },
      {
        date: new Date("2024-01-20"),
        category: "Marketing",
        description: "Google Ads campaign",
        amount: 500,
        status: "Approved",
      },
      {
        date: new Date("2024-01-22"),
        category: "Utilities",
        description: "Internet and phone bill",
        amount: 200,
        status: "Approved",
      },
      {
        date: new Date("2024-01-23"),
        category: "Supplies",
        description: "Printer ink and paper",
        amount: 120,
        status: "Pending",
      },
      {
        date: new Date("2024-01-24"),
        category: "Marketing",
        description: "Social media advertising",
        amount: 800,
        status: "Approved",
      },
      {
        date: new Date("2024-01-25"),
        category: "Other",
        description: "Equipment maintenance",
        amount: 350,
        status: "Pending",
      },
      {
        date: new Date("2024-01-26"),
        category: "Utilities",
        description: "Water bill",
        amount: 100,
        status: "Approved",
      },
    ]

    await Expense.insertMany(expenseData)
    console.log("💰 Expense data inserted: 10 records")

    // Sample Task Data
    const taskData = [
      {
        title: "Complete Q1 Financial Report",
        description: "Prepare comprehensive financial report for Q1 2024",
        assignedTo: "John Doe",
        dueDate: new Date("2024-02-15"),
        status: "In Progress",
        priority: "High",
      },
      {
        title: "Update Inventory System",
        description: "Integrate new barcode scanning system",
        assignedTo: "Jane Smith",
        dueDate: new Date("2024-02-10"),
        status: "Pending",
        priority: "High",
      },
      {
        title: "Client Meeting - ABC Corp",
        description: "Discuss new product requirements",
        assignedTo: "Mike Johnson",
        dueDate: new Date("2024-01-30"),
        status: "Pending",
        priority: "Medium",
      },
      {
        title: "Review Sales Performance",
        description: "Analyze January sales data and prepare insights",
        assignedTo: "Sarah Williams",
        dueDate: new Date("2024-02-05"),
        status: "In Progress",
        priority: "Medium",
      },
      {
        title: "Fix Bug in Inventory Module",
        description: "Resolve low stock alert notification issue",
        assignedTo: "Tom Brown",
        dueDate: new Date("2024-01-28"),
        status: "In Progress",
        priority: "High",
      },
      {
        title: "Prepare Marketing Strategy",
        description: "Create Q2 marketing plan and budget",
        assignedTo: "Emily Davis",
        dueDate: new Date("2024-02-20"),
        status: "Pending",
        priority: "Medium",
      },
      {
        title: "Conduct Staff Training",
        description: "Train new employees on ERP system",
        assignedTo: "Robert Wilson",
        dueDate: new Date("2024-02-01"),
        status: "Pending",
        priority: "Low",
      },
      {
        title: "Audit Expense Records",
        description: "Review and verify all January expenses",
        assignedTo: "Lisa Anderson",
        dueDate: new Date("2024-02-08"),
        status: "Completed",
        priority: "High",
      },
      {
        title: "Update Customer Database",
        description: "Add new customers and update contact information",
        assignedTo: "David Martinez",
        dueDate: new Date("2024-02-03"),
        status: "In Progress",
        priority: "Low",
      },
      {
        title: "Backup System Data",
        description: "Perform weekly backup of all system data",
        assignedTo: "Chris Taylor",
        dueDate: new Date("2024-01-29"),
        status: "Pending",
        priority: "High",
      },
    ]

    await Task.insertMany(taskData)
    console.log("✅ Task data inserted: 10 records")

    console.log("\n🎉 Database seeding completed successfully!")
    console.log("\n📝 Login Credentials:")
    console.log("   Email: admin@erp.com")
    console.log("   Password: admin123")
    console.log("\n📊 Data Summary:")
    console.log("   - Sales Records: 10")
    console.log("   - Inventory Items: 12")
    console.log("   - Expenses: 10")
    console.log("   - Tasks: 10")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
