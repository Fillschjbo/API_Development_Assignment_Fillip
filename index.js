import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

const SECRET = process.env.SECRET;

if (!SECRET) {
    console.error("SECRET is not defined. Please set the SECRET environment variable.");
    process.exit(1);
}

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token required" });

    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

app.get("/", authenticateToken, (req, res) => {
    res.json({ message: "Token verified", user: req.user });
});

app.post("/user", async(req, res) => {
    const {username, email, password} = req.body;
    const [result] = await connection.query(`
    INSERT INTO user(username, email, password) VALUES ('${username}', '${email}', '${password}')
    `)

    res.json(req.body)
});

app.get("/user", async(req, res) => {
    const sort = req.query.sort || "id";
    const sortOrder = req.query.sortOrder || "ASC";
    const [result, fields] = await connection.query(" SELECT * FROM user ORDER BY " + sort + " " + sortOrder)
    res.json(result)
});

async function checkPassword(username, password) {
    const [rows] = await connection.query("SELECT id, username, password FROM user WHERE username = ?", [username]);

    if (rows.length === 0) {
        return null;
    }

    const user = rows[0];

    if (user.password === password) {
        return { id: user.id, username: user.username };
    }

    return null;
}


app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userId = await checkPassword(username, password);

    if (userId) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
        res.json({ message: "success", accessToken: token, id: userId });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

app.get("/fragrances", async (req, res) => {
    const sort = req.query.sort || "id";
    const sortOrder = req.query.sortOrder || "DESC";
    const [result] = await connection.query(
        `SELECT fragrance.*, user.username 
            FROM fragrance 
            JOIN user ON fragrance.user_id = user.id 
            ORDER BY ?? ${sortOrder}`,
        [sort]
    );
    res.json(result)
});

app.post("/fragrances", authenticateToken, async (req, res) =>{
  const {brand, name, scent_profile, img_url, user_id} = req.body;
    const [result] = await connection.query(`
    INSERT INTO fragrance(brand, name, scent_profile, img_url, user_id) VALUES (
    '${brand}',
    '${name}',
    '${scent_profile}',
    '${img_url}',
    '${user_id}'
    )
    `)
    res.json(req.body)
});

app.get("/fragrances/:username", async (req, res) => {
    const { username } = req.params;
    const sort = req.query.sort || "id";
    const sortOrder = req.query.sortOrder || "DESC";

    try {
        const [result] = await connection.query(
            `SELECT fragrance.*, user.username 
             FROM fragrance 
             JOIN user ON fragrance.user_id = user.id 
             WHERE user.username = ? 
             ORDER BY ?? ${sortOrder}`,
            [username, sort]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "No fragrances found for this user" });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while fetching fragrances" });
    }
});


app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
