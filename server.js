const app = require("./app"); // Importă aplicația
const dotenv = require("dotenv");
const connectDB = require("./db"); // Importă funcția de conectare la MongoDB

dotenv.config(); // Încarcă variabilele de mediu

const PORT = process.env.PORT || 5000;

connectDB(); // 🔄 Apelează funcția de conectare la baza de date

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
