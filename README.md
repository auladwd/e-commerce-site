# স্মার্টশপ বাংলাদেশ (SmartShop BD) - প্রিমিয়াম ফুল-স্ট্যাক ই-কমার্স প্ল্যাটফর্ম

একটি আধুনিক, হাইপার-অপ্টিমাইজড ও রেডি-টু-সেল ফুল-স্ট্যাক ই-কমার্স ওয়েবসাইট। যা দেশব্যাপী যেকোনো ধরনের ব্যবসা (গ্যাজেট, মেনস ও ওমেন্স ফ্যাশন, অর্গানিক ফুড, কসমেটিকস, হোম অ্যাপ্লায়েন্স ইত্যাদি) খুব সহজে অনলাইন করার জন্য বিশেষভাবে আর্কিটেক্ট করা হয়েছে।

---

## 🚀 প্রধান প্রযুক্তি (Tech Stack)

- **Frontend & Framework**: Next.js 15+ (App Router, TypeScript, Server & Client Components)
- **Styling & UI**: Tailwind CSS v4, Glassmorphism, Responsive Mobile-First Design
- **Bangla Typography**: Google Fonts `Hind Siliguri` (বাংলা) এবং `Inter` (ইংরেজি)
- **Database**: MongoDB Atlas (Mongoose ODM with serverless connection caching)
- **Authentication**: Firebase Auth (Google 1-Click Login, Email/Password, Guest Instant Checkout)
- **Image Optimization & CDN**: Cloudinary (Direct Upload with auto WebP compression `f_auto, q_auto`)
- **Deployment**: Vercel Ready

---

## 🌟 স্পেশাল ফিচারসমূহ (Features Highlight)

1. **বাংলা ও ইংরেজি ভাষা পরিবর্তন (Bilingual Support)**:
   - হেডার থেকে এক ক্লিকে সম্পূর্ণ ওয়েবসাইট বাংলা এবং ইংরেজিতে সুইচ করা যায়।
   - সম্পূর্ণ সাইটের টেক্সট, কার্ট, চেকআউট এবং অ্যাডমিন প্যানেল উভয় ভাষায় অনূদিত।

2. **Cloudinary অপ্টিমাইজড ইমেজ আপলোড**:
   - ক্লায়েন্ট-সাইড ক্যানভাস কম্প্রেশন এবং Cloudinary ট্রান্সফরমেশন (`f_auto, q_auto, w_1200`)।
   - ড্র্যাগ অ্যান্ড ড্রপ ফাইল আপলোডার, তাৎক্ষণিক প্রিভিউ এবং একাধিক ছবি আপলোড।
   - ছবির অপ্টিমাইজড লিঙ্ক সরাসরি MongoDB Atlas-এ সেভ হয়।

3. **বাংলাদেশি চেকআউট ও পেমেন্ট সিস্টেম**:
   - **ঢাকা সিটি ও ঢাকার বাইরে ডেলিভারি চার্জ অটো-ক্যালকুলেশন** (যেমনঃ ঢাকা ৭০৳, ঢাকার বাইরে ১৩০৳)।
   - **ক্যাশ অন ডেলিভারি (COD)** এবং **বিকাশ / নগদ / রকেট** সেন্ড মানি নির্দেশনা ও TrxID ইনপুট।
   - **১-ক্লিক "সরাসরি অর্ডার" (Quick Buy Modal)**: ফেসবুক বা টিকটক ট্রাফিকের জন্য দ্রুত অর্ডার কনভার্সন।

4. **অর্ডার ট্র্যাকিং সিস্টেম (Live Parcel Tracking)**:
   - মোবাইল নম্বর (০১XXXXXXXXX) অথবা অর্ডার আইডি (যেমনঃ BD-84920) দিয়ে পার্সেলের বর্তমান অবস্থা লাইভ ট্র্যাকিং।
   - প্রোগ্রেস বার (Pending -> Confirmed -> Processing -> Shipped -> Delivered)।

5. **সম্পূর্ণ অ্যাডমিন কন্ট্রোল সেন্টার (`/admin`)**:
   - **ড্যাশবোর্ড**: মোট বিক্রি, মোট অর্ডার, পেন্ডিং অর্ডার এবং অ্যাক্টিভ পণ্যের অ্যানালিটিক্স।
   - **প্রোডাক্ট ম্যানেজার**: নতুন প্রোডাক্ট তৈরি, ছবি আপলোড (Cloudinary), মূল্য ও ছাড় নির্ধারণ, স্টক আপডেট।
   - **অর্ডার ম্যানেজার**: সকল অর্ডারের তালিকা, স্ট্যাটাস পরিবর্তন, কাস্টমার চালান/মেমো প্রিন্ট।
   - **স্টোর ও ডেলিভারি সেটিংস**: ডেলিভারি ফি, হেল্পলাইন, বিকাশ/নগদ নম্বর এক ক্লিকে পরিবর্তন।
   - **১-ক্লিক MongoDB সিড**: ডাটাবেজে সাথে সাথে ডেমো প্রোডাক্ট ও ক্যাটাগরি ইম্পোর্ট করার বাটন।

6. **সার্বক্ষণিক হোয়াটসঅ্যাপ চ্যাট ও হটলাইন কল**:
   - স্ক্রিনের ডানপাশে ফ্লোটিং হোয়াটসঅ্যাপ বাটন (প্রোডাক্ট বা অর্ডারের বিবরণ সহ সরাসরি মেসেজ পাঠানোর সুবিধা)।

---

## 🛠️ লোকাল সেটআপ ও রান করার নিয়ম (Getting Started)

### ১. ডিপেন্ডেন্সি ইনস্টল করুন:
```bash
npm install
```

### ২. এনভায়রনমেন্ট ভ্যারিয়েবল সেটআপ:
প্রজেক্ট ফোল্ডারে `.env.local` ফাইলটি খুলুন এবং আপনার কিগুলো দিন:
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smartshop_db?retryWrites=true&w=majority

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **নোট**: যদি আপনার কাছে এখন MongoDB বা Firebase কী না থাকে, তাহলেও কোনো সমস্যা নেই! সাইটটি স্বয়ংক্রিয়ভাবে একটি আকর্ষণীয় ডেমো মোডে চলে এবং সমস্ত ফিচার (কার্ট, অর্ডার, ট্র্যাকিং, ফিল্টার) ব্রাউজারে কাজ করে।

### ৩. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```
ব্রাউজারে ভিজিট করুন: [http://localhost:3000](http://localhost:3000)

### ৪. অ্যাডমিন ড্যাশবোর্ড ভিজিট করুন:
[http://localhost:3000/admin](http://localhost:3000/admin) এ গিয়ে "MongoDB সিড করুন" বাটনে ক্লিক করলেই আপনার ডাটাবেজে স্বয়ংক্রিয়ভাবে রেডি-মেড পণ্য ও ক্যাটাগরি তৈরি হয়ে যাবে।

---

## 🌐 Vercel-এ ডিপ্লয় করার নিয়ম (Deployment Guide)

1. প্রজেক্টটি আপনার GitHub রিপোজিটরিতে পুশ করুন:
   ```bash
   git add .
   git commit -m "Initial commit of SmartShop BD"
   git branch -M main
   git push -u origin main
   ```
2. [Vercel](https://vercel.com) এ লগইন করে **Add New Project** এ গিয়ে রিপোজিটরিটি সিলেক্ট করুন।
3. **Environment Variables** অপশনে `.env.local` এর মানগুলো (MONGODB_URI, Cloudinary, Firebase ইত্যাদি) পেস্ট করুন।
4. **Deploy** বাটনে ক্লিক করুন। মাত্র ১ মিনিটে সাইটটি লাইভ হয়ে যাবে!

---

## 💼 ক্লায়েন্টদের কাছে বিক্রির টিপস (Selling Strategy)

- **ডেমো লিংক শেয়ার করুন**: সাইটটি Vercel-এ ফ্রিতে ডিপ্লয় করে ক্লায়েন্টকে লাইভ ডেমো দেখান।
- **লো-বাজেট প্যাকেজ**: ফেসবুক ও টিকটক পেজের উদ্যোক্তাদের জন্য "সরাসরি অর্ডার" (Quick Buy) ফিচারটি অত্যন্ত আকর্ষণীয় কারণ এটি দ্রুত সেলস বাড়ায়।
- **সহজ কাস্টমাইজেশন**: অ্যাডমিন প্যানেল থেকে ক্লায়েন্ট নিজেই তার বিকাশ নম্বর, হটলাইন ও ডেলিভারি চার্জ পরিবর্তন করতে পারবে।
