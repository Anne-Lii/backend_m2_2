//Anne-Lii Hansen - webbapplikation med mina tidigare arbetslivserfarenheter

//inkluderar express och cors
const express = require("express");
const cors = require("cors");
const {Client} = require("pg");

const app = express();

app.use(express.json());// Middleware för att tolka JSON
app.use(cors());// Middleware för CORS
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

app.set("view engine", "ejs");//view engine: EJS

const client = new Client({
    connectionString: "postgres://cv_vpad_user:9bZaiG8PluXY5jbRiBeqOYhL1tqAjWGn@dpg-coag95a0si5c73cuom6g-a.frankfurt-postgres.render.com/cv_vpad",
    ssl: {
        rejectUnauthorized: false
    }
    
}); 

client.connect();

// Routing
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/post", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM jobs");
        console.log("Fetched data from database:", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message:"Serverfel"});
    }
});

app.post("/posts", async (req, res) => {
    const { companyname, location, jobtitle, description, startdate, enddate } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO jobs (companyname, location, jobtitle, description, startdate, enddate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [companyname, location, jobtitle, description, startdate, enddate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfel"});
    }
});

app.delete("/posts/:id", async (req, res) => {
    const jobId = req.params.id;
    try {
        const result = await client.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [jobId]);
        if (result.rowCount > 0) {
            res.json({ message: "Job deleted successfully" });
        } else {
            res.status(404).json({ message: "Job not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Serverfel"});
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//stänger anslutningen till databasen
process.on('exit', () => {
    client.end();
});



