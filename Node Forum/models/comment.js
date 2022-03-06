const db = require('../config/db');
const date = require('./date');

/**
 * Models a comment
 */
class Comment{
    constructor(userid, postid, content, commentDate){
        this.userid = userid;
        this.postid=postid;
        this.content=content;  
        this.commentDate = commentDate;      
    }
    
    /**
     * Saves comment object to database
     */
    async save(){
        let commentDate = date.getTimestamp();

        let sql = "insert into comments(userid, postid, content, commentDate) values (?,?,?,?)"

        await db.query(sql, [this.userid, this.postid, this.content, commentDate]); 
        
    }

    /**
     * Returns user associated with this comment
     */
    async getCommentAuthor(){

        let sql = "select username from users where id = ?"

        const [result, _] = await db.query(sql, this.userid); 

        return result[0].username;
    }
}

module.exports=Comment;