// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

//read order information

//read shop information
app.get("/api/store/info", async (req, res) => {
  try {
    let storeInfo = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
      ids: "632910392,921728736",
    });
    res.status(200).send(storeInfo);
  } catch (error) {
    console.error("Error fetching store info:", error);
    res.status(500).json({ error: "Failed to fetch store info" });
  }
});
//get Product_count
app.get("/api/products/count", async (_req, res) => {
  try {
    const countData = await shopify.api.rest.Product.count({
      session: res.locals.shopify.session,
    });
    return res.status(200).send(countData);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//read collection Data
app.get("/api/collection/count", async (_req, res) => {
  try {
    const countData = await shopify.api.rest.CustomCollection.count({
      session: res.locals.shopify.session,
    });
    return res.status(200).send(countData);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//read orders

app.get("/api/orders/all", async (_req, res) => {
  try {
    const orderData = await shopify.api.rest.Order.all({
      session: res.locals.shopify.session,
      status: "any",
    });
    return res.status(200).send(orderData);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Read all Products
app.get("/api/products/all", async (req, res) => {
  try {
    let allProducts = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
      ids: "632910392,921728736",
    });
    return res.status(200).send(allProducts);
  } catch (error) {
    console.error("Shopify API Error:", error.response.data);
    return res.status(500).send(error);
  }
});

//UPDATE A PRODUCT
// app.put("/api/products/update", async (req, res) => {
//   try {
//     let updateProdcts = await shopify.api.rest.Product.count({
//       session: res.locals.shopify.session,
//     });
//     return res.status(200).send(updateProdcts);
//   } catch (error) {
//     console.log("Shopify API Error",error.response.data)
//   }
// });

//CREATE NEW PRODUCT
app.post("/api/products/create", async (req, res) => {});
//DETETE A  PRODUCT
app.delete("/api/products/delete", async () => {});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
