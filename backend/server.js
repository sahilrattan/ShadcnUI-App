const express = require("express");
const fetch = require("node-fetch"); // Use node-fetch v2 for CommonJS
const app = express();
const PORT = 3001;

app.get("/api/view-pdf", async (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("Missing 'url' query parameter");
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch file");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=preview.pdf");

    response.body.pipe(res); // Stream the response to client
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Server error while fetching file");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
