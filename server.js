const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SQUAD_SECRET_KEY;

app.get("/", (req, res) => {
    res.send("Squad Withdrawal API is running");
});

app.post("/withdraw", async (req, res) => {
  try {
    const { bank_code, account_number, amount, narration } = req.body;

    const response = await axios.post(
      "https://api.squadco.com/v1/payout/initiate",
      {
        bank_code,
        account_number,
        amount,
        currency: "NGN",
        narration,
      },
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.response?.data || error);
    res.status(500).json({ error: "Withdrawal failed" });
  }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
