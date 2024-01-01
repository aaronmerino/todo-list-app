const crypto = require('crypto');

class Account {
  constructor(id, name, authenticated, db) {
    this.id = id;
    this.name = name;
    this.authenticated = authenticated;
    this.db = db;
  }

  static generateSalt(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0,length);
  }

  static hashPassword(password, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
  }

  static isValidUsername(username) {
    return true;
  }

  static isValidPassword(password) {
    return true;
  }

  async getUserFromUsername(username) {
    try {
      const [rows, fields] = await this.db.execute(`SELECT * FROM users u WHERE u.username = ${username}`);
      return rows;

    } catch (error) {
      console.error(error);
    }
  }

  async createAccount(username, password) {
    username = username.trim();
    password = password.trim();

    if (!this.isValidUsername(username)) {
      throw new Error("Invalid Username");
    }

    if (!this.isValidPassword(password)) {
      throw new Error("Invalid Password");
    }

    if (this.getUserFromUsername(username).length === 0) {
      throw new Error("Username not available");
    }

    let salt = generateSalt(16);
    let password_hash = hashPassword(password, salt);

    try {
      const [rows, fields] = await this.db.execute(`INSERT INTO users (username, password_hash, salt) VALUES (${username}, ${password_hash}, ${salt})`);
    } catch (error) {
      console.error(error);
    }

    return username;
  }
}

export default Account;