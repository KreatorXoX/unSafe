module.exports.sessionOptions = {
  name: "myAppSession",
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
