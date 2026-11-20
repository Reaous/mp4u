import {Dexie} from "dexie"


export const db =new Dexie("videoDB")
db.version(1).stores ({
    videos : '++id, createdat'
})
