const createUser = async (username, password, conn) => {
    try {
        await conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    } catch (error) {
        console.error('Error creating user: ', error);
        throw error;
    }
}

const getUser = async (username, conn) => {
    try {
        const [rows] = await conn.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error getting user: ', error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUser
};