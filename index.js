const { json } = require('express');
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const User = require('./schema/User');
const Admin = require('./schema/Admin');
const bcrypt = require('bcryptjs');

app.use(json());
app.listen(port, () => console.log(`Listening on port ${port}`));

mongoose.connect(
    "mongodb+srv://dbUser:NbO8EYzM9qcicoCn@clubdirectory.wzqvtyu.mongodb.net/?retryWrites=true&w=majority"
).then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Could not connect to MongoDB", err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post("/api/users/signup", (req, res) => {
    const { name, email, password, clubId, roll } = req.body;
    const hashpassword = bcrypt.hashSync(password, 10);
    const user = new User({
        name,
        email,
        password:hashpassword,
        clubId,
        roll
    });
    user.save().then(() => {
        res.send(`User created ${user}`);
    }).catch(err => {
        res.status(400).send(err);
    });
})

app.post("/api/users/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("HI");
    console.log(user);
    if (!user) {
        res.status(404).send("User not found");
    }
    if (bcrypt.compareSync(password, user.password)) {
        res.send("Logged in Successfully");
    }
    else {
        res.status(400).send("Incorrect password");
    }
});

app.get("/api/users", (req, res) => {
    const users = User.find();
    const selectedparams = users.map(user => {
        return {
            name: user.name,
            email: user.email,
            clubId: user.clubId,
            roll: user.roll
        }
    });
    res.send(selectedparams);
});

app.post("/api/admin/signup", (req, res) => {
    const { name, email, password, clubId } = req.body;
    const hashpassword = bcrypt.hashSync(password, 10);
    const admin = new Admin({
        name,
        email,
        password:hashpassword,
        clubId
    });
    admin.save().then(() => {
        res.send(`Admin created ${admin}`);
    }).catch(err => {
        res.status(400).send(err);
    });
})

app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    console.log("HI");
    console.log(admin);
    if (!admin) {
        res.status(404).send("Admin not found");
    }
    if (bcrypt.compareSync(password, admin.password)) {
        res.send("Logged in Successfully");
    }
    else {
        res.status(400).send("Incorrect password");
    }
});


app.get("/api/admin", (req, res) => {
    const admins = Admin.find();
    console.log(admins);
    if (!admins) {
        res.status(404).send("No admins created");
    }
    res.send(admins);
});

