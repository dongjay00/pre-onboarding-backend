const app = require("../index");
const syncDb = require("./sync-db");

syncDb()
  .then(() => {
    console.log("Connected to db!");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is running!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
