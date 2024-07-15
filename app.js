const sdk = require("node-appwrite");

const client = new sdk.Client();
const endpoint = "https://cloud.appwrite.io/v1";

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

    const databases = new sdk.Databases(client);

    var todoDatabase;
    var todoCollection;
    
async function prepareDatabase() {
        todoDatabase = await databases.create(
            sdk.ID.unique(),
            'TodosDB'
        );
    
        todoCollection = await databases.createCollection(
            todoDatabase.$id,
            sdk.ID.unique(),
            'Todos'
        );
    
        await databases.createStringAttribute(
            todoDatabase.$id,
            todoCollection.$id,
            'title',
            255,
            true
        );
    
        await databases.createStringAttribute(
            todoDatabase.$id,
            todoCollection.$id,
            'description',
            255, false,
            'This is a test description'
        );
        await databases.createBooleanAttribute(
            todoDatabase.$id,
            todoCollection.$id,
            'isComplete',
            true
        );
}
    
async function seedDatabase() {
    var testTodo1 = {
        title: 'Buy apples',
        description: 'At least 2KGs',
        isComplete: true
    };

    var testTodo2 = {
        title: 'Wash the apples',
        isComplete: true
    };

    var testTodo3 = {
        title: 'Cut the apples',
        description: 'Don\'t forget to pack them in a box',
        isComplete: false
    };

    await createDocument(
        testTodo1
    );
    await createDocument(
        testTodo2
    );
    await createDocument(
        testTodo3
    );
}

async function createDocument({title, description, isComplete}){
    await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
            'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
            documentId: sdk.ID.unique(),
            data:{
                title,
                description,
                isComplete   
            }
        })
    });
}

async function getTodos() {
    const response = await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
            'X-Appwrite-Key': apiKey,
        }
    });

    var todos = await response.json();

    todos.documents.forEach(todo => {
        console.log(`Title: ${todo.title}\nDescription: ${todo.description}\nIs Todo Complete: ${todo.isComplete}\n\n`);
    });
}

async function runAllTasks() {
    await prepareDatabase();
    await seedDatabase();
    await getTodos();
}
runAllTasks();