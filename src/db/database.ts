import { v4 as uuidv4 } from "uuid";

export interface User {
    id: string;
    name: string;
    age: number;
    email: string;
}

const database: User[] = [];

export const db = {
    getAll: async (): Promise<User[]> => database,
    getById: async (id: string): Promise<User | undefined> => {
        return database.find(user => user.id === id)
    },
    create: async (name: string, age: number, email: string): Promise<User> => {
        const newUser = { id: uuidv4(), name, age, email };
        database.push(newUser);
        return newUser;
    },
    update: async (id: string, name: string, age: number, email: string): Promise<User | undefined> => {
        const user = await db.getById(id);
        if (user) {
            user.name = name;
            user.age = age;
            user.email = email;
            return user;
        }
        return undefined;
    },
    delete: async (id: string): Promise<boolean> => {
        const user = await db.getById(id);
        if (!user) {
            return false;
        } else {
            const index = database.indexOf(user);
            if (index !== -1) {
                database.splice(index, 1);
                return true;
            }
            return false;
        }
    }
}