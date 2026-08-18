// Run this from a trusted environment after configuring Firebase Admin credentials.
// It creates the starter categories, services, and sample products.
// This file is intentionally not imported by the browser application.
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const categories = ["Hot Coffee","Iced Coffee","Espresso","Tea","Smoothies","Desserts"];
const products = [
  {name:"Thnol Coffee",description:"TUBE's bold Khmer-style coffee, smooth and energizing.",price:2.40,category:"Hot Coffee",image:"/assets/popular-drink.jpg",available:true},
  {name:"Classic Latte",description:"Espresso balanced with silky steamed milk.",price:2.60,category:"Espresso",image:"/assets/popular-drink.jpg",available:true},
  {name:"Green Milk Tea",description:"Creamy green tea with a refreshing finish.",price:2.50,category:"Tea",image:"/assets/drink-menu.jpg",available:true},
  {name:"Passion Juice",description:"Bright, refreshing passion fruit drink.",price:2.40,category:"Smoothies",image:"/assets/popular-drink.jpg",available:true},
  {name:"Khmer Breakfast Rice",description:"A filling local favorite for everyday fuel.",price:2.80,category:"Desserts",image:"/assets/Food-menu.jpg",available:true}
];
async function run(){
 for(const name of categories) await db.collection("categories").add({name,createdAt:FieldValue.serverTimestamp()});
 for(const p of products) await db.collection("products").add({...p,createdAt:FieldValue.serverTimestamp()});
 for(const s of ["Dine-in","Takeaway","Online Ordering","Delivery","Special Coffee Services"]) await db.collection("services").add({name:s,createdAt:FieldValue.serverTimestamp()});
 console.log("TUBE Coffee seed data created.");
}
run().catch(console.error);
