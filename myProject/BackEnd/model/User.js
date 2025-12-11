const db = require("../config/db");

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
    
    static addToSaves(userId, recipeId) {
        return new Promise((resolve, reject) => {
            // This query checks existence before inserting:
            const query = `
                INSERT INTO favorite (user_id, recipe_id) 
                SELECT ?, ? 
                WHERE NOT EXISTS (
                    SELECT 1 FROM favorite WHERE user_id = ? AND recipe_id = ?
                )
            `;

            db.query(query, [userId, recipeId, userId, recipeId], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
        });
    }


    static getAllSaves(userId) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT r.* 
            FROM Recipe r
            JOIN favorite f ON r.recipe_id = f.recipe_id
            WHERE f.user_id = ?
            `;

            db.query(query, [userId], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            })
        })
    }

    static searchForRecipe(keyword) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT DISTINCT r.*
            FROM recipe r
            LEFT JOIN recipetag rt ON r.recipe_id = rt.recipe_id
            LEFT JOIN tag t ON rt.tag_id = t.tag_id
            WHERE r.title LIKE ? OR t.name LIKE ?
            `
            const searchTerm = `%${keyword}%`;
            db.query(query, [searchTerm, searchTerm], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}
module.exports = User;

