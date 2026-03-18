import connectDatabase from "../database/connectDatabase.js";

const startServer = async (app, port, mode) => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`✅ Server is running in ${mode} mode at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ DB connection failed", error);
    process.exit(1);
  }
};

export default startServer;