export interface User {
    id: number;
    name: string;
}

const database: User[] = [];

export const db = {
    getAll: async (): Promise<User[]> => database,
    create: async (name: string): Promise<User> => {
        const newUser = { id: database.length + 1, name };
        database.push(newUser);
        return newUser;
    },
};