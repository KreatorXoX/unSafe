const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7xrkj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  secret: process.env.SESSION_SECRET || "secretForSession",
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (err) {
  console.log(err);
});
module.exports.sessionOptions = {
  name: "myAppSession",
  store,
  secret: process.env.SESSION_SECRET || "secretForSession",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires in a week.
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    //secure:true
  },
};
