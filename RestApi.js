const http = require('http');
const fs = require('fs');

const tasksFile = 'tasks.json';
let tasks = [];

if (fs.existsSync(tasksFile)) {
    tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf-8')) || [];
}

function getNextId() {
    if (tasks.length === 0) return 1; 
    return Math.max(...tasks.map(task => task.id)) + 1; 
}

function saveTasksToFile() {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf-8');
}

function handlePostRequest(req, res, body) {
    const { title, description, priority, dueDate } = JSON.parse(body);

    if (!title || !description || !priority || !dueDate) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'All fields are required.' }));
    }

    const newTask = {
        id: getNextId(),
        title,
        description,
        priority,
        dueDate
    };

    tasks.push(newTask);
    res.statusCode = 201;
    saveTasksToFile();
    return res.end(JSON.stringify(newTask));
}

function handleGetRequest(req, res, url) {
    if (url === '/' || url==='/tasks') {
        return res.end(JSON.stringify(tasks));
    }

    const id = parseInt(url.split('/')[2]);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Task not found.' }));
    }

    return res.end(JSON.stringify(task));
}

function handlePutRequest(req, res, url, body) {
    const id = parseInt(url.split('/')[2]);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Task not found.' }));
    }

    const data = JSON.parse(body);
    Object.keys(data).forEach(key => {
        if (data[key]) {
            task[key] = data[key];
        }
    });

    res.statusCode = 200;
    saveTasksToFile();
    return res.end(JSON.stringify({
        message: 'Task updated successfully.',
        task
    }));
}

function handleDeleteRequest(req, res, url) {
    const id = parseInt(url.split('/')[2]);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Task not found.' }));
    }

    tasks.splice(index, 1);
    saveTasksToFile();
    res.statusCode = 200;
    return res.end(JSON.stringify({ message:"Task Deleted succesfully" }));
}

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let body = '';

    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
        switch (req.method) {
            case 'POST':
                return handlePostRequest(req, res, body);
            case 'GET':
                return handleGetRequest(req, res, req.url);
            case 'PUT':
                return handlePutRequest(req, res, req.url, body);
            case 'DELETE':
                return handleDeleteRequest(req, res, req.url);
            default:
                res.statusCode = 405;
                return res.end(JSON.stringify({ error: 'Method not allowed.' }));
        }
    });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));