const http = require("http");
const url = require("url");
const bodyParser = require("body-parser");
const Item = require("./models/item-model");

const port = 5000;

const app = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  await bodyParser.json()(req, res, async () => {
    try {
      if (pathname === "/items" && req.method === "POST") {
        // Create Item
        const newItem = new Item(req.body);
        const createdItem = await newItem.save();

        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(createdItem));
      } else if (pathname === "/items" && req.method === "GET") {
        // Get All Items
        const items = await Item.find();
        res.writeHead(200, { "Content-Type": "application/json" });

        return res.end(JSON.stringify(items));
      } else if (parsedUrl.pathname === "/item" && req.method === "GET") {
        // Get Item by ID
        const itemId = parsedUrl.query.id;
        const item = await Item.findOne({ _id: itemId });

        if (item) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(item));
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("Item not found");
        }
      } else if (parsedUrl.pathname === "/item" && req.method === "PATCH") {
        // Update Item
        const itemId = parsedUrl.query.id;
        const updateItem = await Item.findByIdAndUpdate(itemId, req.body, {
          new: true,
        });

        if (updateItem) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(updateItem));
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("Item not found");
        }
      } else if (parsedUrl.pathname === "/item" && req.method === "DELETE") {
        // Delete Item
        const itemId = parsedUrl.query.id;
        const deleteItem = await Item.findByIdAndDelete(itemId);

        if (deleteItem) {
          res.writeHead(200, { "Content-Type": "text/plain" });
          return res.end("Item deleted successfully");
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("Item not found");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("Internal Server Error");
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
