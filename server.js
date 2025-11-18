const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow all frontends
app.use(cors());
app.use(express.json());

// Health route (Railway needs this)
app.get("/", (req, res) => {
    res.json({ status: "Backend running" });
});

// WITHDRAW route
app.post("/withdraw", async (req, res) => {
    try {
        const { amount, bank_code, account_number } = req.body;

        if (!amount || !bank_code || !account_number) {
            return res.status(400).json({
                error: "amount, bank_code, account_number are required"
            });
        }

        const payload = {
            amount: Number(amount),
            bank_code,
            account_number,
            currency: "NGN",
            reference: "wd_" + Date.now(),
            callback_url: process.env.CALLBACK_URL
        };

        const response = await axios.post(
            "https://api-d.squadco.com/api/v1/payout/initiate",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({
            message: "Withdrawal Sent",
            squad_response: response.data
        });

    } catch (error) {
        console.error(error.response?.data || error);
        res.status(500).json({
            error: "Withdrawal failed",
            details: error.response?.data || error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Backend running on port " + PORT);
});
