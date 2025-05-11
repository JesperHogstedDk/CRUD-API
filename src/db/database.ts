import { v4 as uuidv4 } from "uuid";

export interface User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

const database: User[] = [];

export const db = {
    getAll: async (): Promise<User[]> => database,
    getById: async (id: string): Promise<User | undefined> => {
        return database.find(user => user.id === id)
    },
    create: async (username: string, age: number, hobbies: string[]): Promise<User> => {
        const newUser = { id: uuidv4(), username, age, hobbies };
        database.push(newUser);
        return newUser;
    },
    update: async (id: string, username: string, age: number, hobbies: string[]): Promise<User | undefined> => {
        const user = await db.getById(id);
        if (user) {
            user.username = username;
            user.age = age;
            user.hobbies = hobbies;
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