import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Allow all origins (for testing)
app.use(cors());
app.use(express.json());

// -----------------------------
// WITHDRAW ENDPOINT
// -----------------------------
app.post("/withdraw", async (req, res) => {
    try {
        const { amount, bank_code, account_number } = req.body;

        if (!amount || !bank_code || !account_number) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // YOUR SQUAD SECRET KEY HERE
        const SECRET_KEY = "YOUR_SECRET_KEY_HERE";

        const payload = {
            bank_code,
            account_number,
            amount
        };

        const response = await fetch("https://api.squadco.com/transaction/initiate-payout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${SECRET_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// -----------------------------
// TEST ENDPOINT
// -----------------------------
app.get("/", (req, res) => {
    res.send("Backend is running ✔");
});

// -----------------------------
// START SERVER
// -----------------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
