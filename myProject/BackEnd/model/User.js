const connectDB = require("../config/db");

let db;
(async() => {
    db = await connectDB();
})();

class User {
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM user WHERE email = ?",
            [email], (err, result) => {
                if(err) return reject(err);
                resolve(result[0] || null);
            });
        });
    }

    static findByName(name) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM user WHERE name = ?",
                [name], (err, result) => {
                    if(err) return reject(err);
                    resolve(result[0] || null);
                });
        });
    }

    static getAllUsers() { 
        return new Promise((resolve, reject) => { 
            db.query("SELECT * FROM user", 
                (err, results) => { 
                if(err) return reject(err); 
                resolve(results); 
            }); 
            }); 
        }

        static create({ name, email, password_hash, role = "user"}) { 
            return new Promise((resolve, reject) => { 
                db.query("INSERT INTO user (name, email, password_hash, role) VALUES (?, ?, ?, ?) ", 
                    [name, email, password_hash, role], (err, results) => { 
                        if(err) return reject(err); 
                        resolve(results.insertId); 
                    }); 
                }); 
            }
            
        }
module.exports = User;

