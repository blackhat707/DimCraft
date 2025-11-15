import express from "express";
import cors from "cors";
import morgan from "morgan";

// Simple Express backend that mirrors the core behavior of the Convex functions
// for products, orders, and chat (threads & messages).
//
// This is intentionally stateless/persistent-in-memory only. In a real
// deployment you'd back these structures with a database.

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- In-memory stores -------------------------------------------------------

/** @type {Array<any>} */
const products = [];

/** @type {Array<any>} */
const orders = [];

/** @type {Array<any>} */
const messageThreads = [];

/** @type {Array<any>} */
const chatMessages = [];

// --- Helpers ----------------------------------------------------------------

function getCurrentUser(req) {
  // Very simple stand‑in for authentication.
  // In production you'd verify a JWT or session and derive userId/role.
  const userId = req.header("x-user-id") || "demo-user";
  const name = req.header("x-user-name") || "Demo User";
  return { userId, name };
}

function nowTimestamp() {
  return new Date().toISOString();
}

// --- Health check -----------------------------------------------------------

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: nowTimestamp() });
});

// --- Products ---------------------------------------------------------------

// List all products
app.get("/products", (_req, res) => {
  res.json(products);
});

// Create a product as an artisan (mirrors createArtisanProduct)
app.post("/artisan/products", (req, res) => {
  const { userId, name: userDisplayName } = getCurrentUser(req);
  const { name, description, price, image, category } = req.body || {};

  if (!name || !description || typeof price !== "number" || !image) {
    return res
      .status(400)
      .json({ error: "name, description, price (number), image are required" });
  }

  const nextProductId =
    products.length === 0
      ? 1
      : Math.max(...products.map((p) => p.productId ?? 0)) + 1;

  const priceDisplay = {
    zh: `HK$ ${price}`,
    en: `HK$ ${price}`,
  };

  const product = {
    _id: `prod-${nextProductId}`,
    productId: nextProductId,
    name: { zh: name, en: name },
    price,
    priceDisplay,
    priceSubDisplay: null,
    image,
    artisan: { zh: userDisplayName, en: userDisplayName },
    full_description: { zh: description, en: description },
    category: category ?? null,
    ownerUserId: userId,
  };

  products.push(product);
  res.status(201).json(product);
});

// --- Orders (ecommerce) -----------------------------------------------------

// List all orders (simple admin/artisan view)
app.get("/orders", (_req, res) => {
  res.json(orders);
});

// Create an order (mirrors createOrder)
app.post("/orders", (req, res) => {
  const { userId, name } = getCurrentUser(req);
  const { productId, quantity } = req.body || {};

  if (!productId || typeof quantity !== "number" || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "productId and positive quantity are required" });
  }

  const product =
    products.find((p) => p._id === productId || p.productId === productId) ??
    null;

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const total = product.price * quantity;
  const createdAt = nowTimestamp();
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const order = {
    _id: `order-${orderId}`,
    orderId,
    customerName: name,
    productId: product._id,
    productSnapshot: {
      name: product.name,
      price: product.price,
      image: product.image,
    },
    quantity,
    total,
    date: createdAt,
    status: "待處理",
    customerUserId: userId,
    artisanUserId: product.ownerUserId ?? null,
  };

  orders.push(order);
  res.status(201).json(order);
});

// --- Threads & chat (negotiation) ------------------------------------------

// List all threads
app.get("/threads", (_req, res) => {
  res.json(messageThreads);
});

// Get or create a thread for a product (mirrors getOrCreateThreadForProduct)
app.post("/threads", (req, res) => {
  const { userId, name } = getCurrentUser(req);
  const { productNumericId } = req.body || {};

  if (typeof productNumericId !== "number") {
    return res.status(400).json({ error: "productNumericId (number) is required" });
  }

  const existing = messageThreads.find(
    (t) => t.customerUserId === userId && t.productId === productNumericId
  );
  if (existing) {
    return res.json(existing);
  }

  const product = products.find((p) => p.productId === productNumericId) ?? null;
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const threadId = `THREAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = new Date().toLocaleString("zh-HK", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });

  const thread = {
    _id: `thread-${threadId}`,
    threadId,
    customerName: name,
    lastMessage: "",
    timestamp,
    unread: false,
    avatar: "/user-avatar.jpg",
    productId: productNumericId,
    customerUserId: userId,
    artisanUserId: product.ownerUserId ?? null,
  };

  messageThreads.push(thread);
  res.status(201).json(thread);
});

// List messages in a thread (mirrors getChatMessagesByThread)
app.get("/threads/:threadId/messages", (req, res) => {
  const { threadId } = req.params;
  const messages = chatMessages.filter((m) => m.threadId === threadId);
  res.json(messages);
});

// Send a message (mirrors sendChatMessage)
app.post("/threads/:threadId/messages", (req, res) => {
  const { threadId } = req.params;
  const { sender, text, language, offerPrice } = req.body || {};

  if (!sender || !text || !language) {
    return res
      .status(400)
      .json({ error: "sender, text, and language are required" });
  }

  if (sender !== "customer" && sender !== "artisan") {
    return res.status(400).json({ error: "sender must be 'customer' or 'artisan'" });
  }

  if (language !== "en" && language !== "zh") {
    return res.status(400).json({ error: "language must be 'en' or 'zh'" });
  }

  const timestamp = new Date().toLocaleTimeString("zh-HK", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });
  const messageId = `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const message = {
    _id: `msg-${messageId}`,
    messageId,
    threadId,
    sender,
    originalText: text,
    translatedText: null,
    language,
    timestamp,
    offerPrice: typeof offerPrice === "number" ? offerPrice : null,
  };

  chatMessages.push(message);

  const thread = messageThreads.find((t) => t.threadId === threadId);
  if (thread) {
    thread.lastMessage = text;
    thread.timestamp = timestamp;
    thread.unread = sender === "customer";
  }

  res.status(201).json(message);
});

// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express backend listening on http://localhost:${PORT}`);
});


