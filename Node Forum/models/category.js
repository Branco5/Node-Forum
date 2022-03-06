const db = require('../config/db');
const date = require('./date');

/**
 * Models a category of posts
 */
class Category{
    constructor(name, userid){
        this.name=name;
        this.userid = userid;
    }

    /**
     * Saves category object to db 
     */
    async save(){
        
        let createDate = date.getTimestamp();

        let sql = "insert into categories(name, userid, createDate) values (?,?,?)"

        const [newCategory,_] = await db.query(sql, [this.name, this.userid, createDate]); 

        return newCategory;
    }

    /**
     * Deletes a category from db 
     */
    static async delete(category){
        let sql = "delete from categories where name = ?"

        await db.query(sql, category); 
    }

    /**
     * Returns all categories from db
     */
    static async getAll(){
        let sql = "select * from categories";   

        const [categories,_] = await db.query(sql, this.name);  

        return categories;
    }

    /**
     * Returns posts with this category associated with them
     */
    async getPosts(){
        let sql = "select * from posts where category = ?";   

        const [posts,_] = await db.query(sql, this.name);   
        return posts;
    }    

    /**
     * Returns true if name of this category object exists
     */
    async nameExists(){
        let sql = "select * from categories where name = ?"; 
        const [categories,_] = await db.query(sql, this.name);     
        if(categories.length>0){
            return true;
        }

        return false; 
    }
}

module.exports=Category;