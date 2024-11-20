const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserFile='User.json'
const fs = require('fs');
const secretKey ="d57d7d6ae26d7d2a4b41cd8dcc9283951695252c98381d3d7b55d5fde668d100dd008a14ef806b2dcbc894867fa860696f10b5713be0c50ee19cb777281f5a6b"
let users = [];


if (fs.existsSync(UserFile)) {
    users = JSON.parse(fs.readFileSync(UserFile, 'utf-8'))|| [];
    
}
function saveTasksToFile() {
    fs.writeFileSync(UserFile, JSON.stringify(users, null, 2), 'utf-8');
}


const authServer = http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;
    let body = '';

    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        res.setHeader('Content-Type', 'application/json');

        if (url === '/register' && method === 'POST') {
            const { username, password } = JSON.parse(body);
            const userExists = users.find(user => user.username === username);
            if (userExists) {
                res.statusCode=400
                return res.end(JSON.stringify({ error: 'User already registered.' }));
            }
            if (!username || !password) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Username and password are required.' }));
            }

            if (password.length < 6 || !/\W/.test(password)) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Password must be at least 6 characters and include a special character.' }));
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            users.push({ username, password: hashedPassword });
            saveTasksToFile()
            res.statusCode = 201;
            return res.end(JSON.stringify({ message: 'User registered successfully.' }));
        }

        if (url === '/login' && method === 'POST') {
            const { username, password } = JSON.parse(body);
           try{      
            function getHashedPassword(username) {
                const user = users.find(user => user.username === username);
                if (!user) {
                    res.statusCode = 404;
                    return res.end(JSON.stringify({ error: 'User not found.' }));
                }
                return user.password;
            }
           
            const isPasswordValid = await bcrypt.compare(password,getHashedPassword(username));
            if (!isPasswordValid) {
                res.statusCode = 401;
                return res.end(JSON.stringify({ error: 'Invalid credentials.' }));
            }

            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            return res.end(JSON.stringify({ token }));
        } catch  {
            res.statusCode =401;
            return res.end(JSON.stringify({ error:"check the credentials "}))
        }}

        if (url === '/profile' && method === 'GET') {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.statusCode = 401;
                return res.end(JSON.stringify({ error: 'Access denied.' }));
            }
            try {
                const verified = jwt.verify(token, secretKey,{ algorithms: ['HS256'] });
                res.end(JSON.stringify({ message: `Welcome, ${verified.username}!` }));
            } catch {
                res.statusCode = 403;
                res.end(JSON.stringify({ error: 'Invalid token.' }));
            }
        }
    });
});

authServer.listen(3001, () => console.log('Auth server running on http://localhost:3001'));
