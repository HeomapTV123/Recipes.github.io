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
    /**
     * Adds a full recipe including ingredients and steps using a Transaction.
     * 
     * @param {Object} data - The full request body (title, ingredients array, steps array, etc)
     * @param {number} userId - The ID of the logged-in user
     * @param {string|null} imageUrl - The path to the uploaded image
     */
    static addRecipe(data, userId, imageUrl = null) {
        return new Promise(async(resolve, reject) => {
            const query = (sql, params) => {
                return new Promise((res, rej) => {
                   db.query(sql, params ,(err, result) => {
                        if(err) rej(err);
                        else res(result);
                   }); 
                });
            };

            try {
                await query("START TRANSACTION");
                // INSERT RECIPE
                const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

                const recipeResult = await query(
                    "INSERT INTO Recipe (user_id, title, slug, description, prep_time, cook_time, servings, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        userId,
                        data.title,
                        slug, 
                        data.description || '', 
                        data.prep_time || 0, 
                        data.cook_time || 0, 
                        data.servings || 1, 
                        imageUrl
                    ]
                );
                const recipeId = recipeResult.insertId;

                // PROCESS INGREDIENTS
                if(data.ingredient && Array.isArray(data.ingredient)) {
                    for(let i = 0; i < data.ingredient.length; i++) {
                        const name = data.ingredient[i];
                        const qty = data.quantity ? data.quantity : 0;
                        const unit = data.unit ? data.unit[i] : '';

                        if(!name || name.trim() === '') continue;

                        // check if ingredient exists to reuse ID
                        let ingId;
                        const existingIng = await query("SELECT ingredient_id FROM Ingredient WHERE name = ?", [name]);

                        if(existingIng.length > 0) {
                            ingId = existingIng[0].ingredient_id;
                        } 
                        else {
                            // create new ingredient if it doesn't exist
                            const newIng = await query("INSERT INTO Ingredient (name) VALUES (?)", [name]);

                            ingId = newIng.insertId;
                        }
                        await query(
                            "INSERT INTO RecipeIngredient (recipe_id, ingredient_id, quantity, unit, position) VALUES (?, ?, ?, ?, ?)",
                            [recipeId, ingId, qty, unit, i]
                        );
                    }
                }

                // ==========================================
                // C. PROCESS STEPS
                // ==========================================
                if (data.steps && Array.isArray(data.steps)) {
                    for (let i = 0; i < data.steps.length; i++) {
                        const step = data.steps[i];
                        
                        // Note: step_number is i + 1
                        await query(
                            "INSERT INTO Step (recipe_id, step_number, instruction, duration_minutes, tip, video_url) VALUES (?, ?, ?, ?, ?, ?)",
                            [
                                recipeId, 
                                i + 1, 
                                step.instruction, 
                                step.duration || null, 
                                step.tip || null, // Make sure JS input name is "tip"
                                step.video_url || null
                            ]
                        );
                    }
                }

                // COMMIT EVERYTHING
                await query("COMMIT");
                resolve(recipeId);
            } catch (err) {
                await query("ROLLBACK");
                reject(err);
            }
        });
    }


    // ADMIN ONLY: Delete a user and their recipes
    static deleteUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM
            user WHERE user_id = ?
            `;
            db.query(query, [userId], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
        });
    }

    // ADMIN ONLY: Delete Any Recipe By ID
    static adminDeleteRecipe(recipeId) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM
            Recipe WHERE recipe_id = ?
            `;
            db.query(query, [recipeId], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
        });
    }
    
}
module.exports = User;

