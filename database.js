import Dexie from "dexie";

const db = new Dexie('atividade_todo_list')

db.version(1).stores({
    tasks: 'id++, title, isCompleted, id_user',
    users: 'id++, name, email, password'
})

export default db;