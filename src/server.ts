require('module-alias/register');
import connectDB from "./setup/mongodb/mongoose.connection";
import app from "./app";
import config from "./setup/config";

const PORT = config.port;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
