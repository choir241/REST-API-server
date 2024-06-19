const sdk = require("node-appwrite");

const endpoint = "https://cloud.appwrite.io/v1";

async function seedUser() {
    var testUser1 = {
        email: 'yummyapple@email.com',
        password: 'applesareyummy'
    };

    var testUser2 = {
        email: 'washapple@email.com',
        password: 'washapples'
    };

    var testUser3 = {
        email: 'cutapples@email.com',
        password: 'cutapples',
    };

    await createUser(
        testUser1
    );
    await createUser(
        testUser2
    );
    await createUser(
        testUser3
    );
}

async function createUser({email, password}){
    await fetch(`${endpoint}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
            'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
            userId: sdk.ID.unique(),
            email: email,
            password: password
        })
    });
}

async function getUsers() {
    const response = await fetch(`${endpoint}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
            'X-Appwrite-Key': apiKey,
        }
    });

    var data = await response.json();
    
    data.users.forEach(user => {
        console.log(`User: ${user.email}\nCreated At: ${user.$createdAt}`);
    });
}

async function runAllTasks() {
    await seedUser();
    await getUsers();
}
runAllTasks();
