const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    value = value.replace(/^["']|["']$/g, "").trim();
    process.env[match[1]] = value;
  }
});

async function testAll() {
  console.log("=== ১. Cloudinary Credentials টেস্ট ===");
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary: ✅ সফলভাবে সংযুক্ত হয়েছে! (Connected successfully)");
    console.log("Cloud Name:", cloudName);
  } catch (err) {
    console.error("Cloudinary Error: ❌", err.message);
  }

  console.log("\n=== ২. MongoDB Atlas কানেকশন টেস্ট ===");
  const mongoUri = process.env.MONGODB_URI;
  console.log("URI Format:", mongoUri ? "Configured correctly" : "Missing");

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB Atlas: ✅ সফলভাবে ডাটাবেজে কানেক্ট হয়েছে! (Database:", mongoose.connection.name + ")");
    await mongoose.disconnect();
  } catch (err) {
    console.error("MongoDB Atlas Error: ❌", err.message);
    if (err.message.includes("whitelist") || err.message.includes("ECONNREFUSED") || err.message.includes("IP") || err.message.includes("buffering timed out") || err.message.includes("querySrv")) {
      console.log("\n[গুরুত্বপূর্ণ টিপস]: MongoDB Atlas এর 'Network Access' মেনুতে গিয়ে '0.0.0.0/0' (Allow access from anywhere) অ্যাড করা আছে কিনা যাচাই করুন।");
    }
  }

  console.log("\n=== ৩. Firebase Web Config ফরম্যাট টেস্ট ===");
  console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.startsWith("AIza") ? "✅ Valid Google API Key format" : "❌ Invalid format");
  console.log("Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? `✅ ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}` : "❌ Missing");
  console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `✅ ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}` : "❌ Missing");
  console.log("Storage Bucket:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? `✅ ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}` : "❌ Missing");
  console.log("App ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? `✅ ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}` : "❌ Missing");
}

testAll();
