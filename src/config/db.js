const mongoose = require("mongoose");
const connect = () => {
  return mongoose.connect(
    "mongodb+srv://AleemAlam:password@123@cluster0.l6mx2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  );
};

module.exports = connect;
