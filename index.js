// start of shrivi
const { json } = require('express');
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const User = require('./schema/User');
const Admin = require('./schema/Admin');
const Clubs = require('./schema/Clubs');

const bcrypt = require('bcryptjs');
const { findOneAndUpdate } = require('./schema/User');

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
// end of shrivi

// start of kirthi
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

app.get("/api/users", async (req, res) => {
    const users = await User.find();
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
// end of kirthi

// start of samrdhhi
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
// end of samrddhi

// start of Daf

app.post("/api/addclub/:clubid",(req,res)=>{
    const {clubid} = req.params;
    const {name, description, slogan, advisor, m_count} = req.body;
    const club = new Clubs({
        clubid,
        name,
        description,
        slogan,
        advisor,
        m_count
    });
    club.save().then(()=>{
        res.status(201).send(`Club added ${club}`);
    }).catch(err => {
        res.status(400).send(err);
    });
})

app.get("/api/club/:clubid",async (req,res)=>{
    const {clubid} = req.params;
    const club = await Clubs.find({clubid});
    if(!club){
        res.status(404).send("Club not found");
    }
    res.send(club);
})

app.get("/api/club",async (req,res)=>{
    const clubs = await Clubs.find();
    if(!clubs){
        res.status(404).send("No clubs found");
    }
    res.send(clubs);
})
// end of Daf

// start of NXPP 
app.patch("/api/club/update/:clubid",async (req,res)=>{
    const {clubid} = req.params;
    const club = await Clubs.findOneAndUpdate(
        {clubid:clubid},
        req.body,
        {new: false});
    if (!club) {
        res.status(404).send("Club not found");
    }
    res.json({msg:"Post updated"});
});

app.delete("/api/club/delete/:clubid",async (req,res)=>{
    const {clubid} = req.params;
    try{
        const club = await Clubs.findOneAndDelete({clubid});
        res.send("Club deleted",club);
    }catch(err){
        res.status(404).send("Club not found");
    }

})