const db = require('../config/db')
const date = require('./date');
const Comment = require("./comment")

/**
 * Models a post
 */
class Post{
    constructor(category, game, body, userid, imgurl){
        this.category=category;
        this.game=game;
        this.body=body;
        this.userid=userid;     
        this.imgurl = imgurl;
    }

    /**
     * Saves this post object to db
     */
    async save(){
        let postDate = date.getTimestamp();

        let sql = "insert into posts(category, game, body, userid, postDate, imgUrl) values (?,?,?,?,?,?)"

        const [newUser,_] = await db.query(sql, [this.category, this.game, this.body, this.userid, postDate, this.imgurl]); 

        return newUser;
    }

    /**
     * Returns username of author responsible for a post
     */
    static async getPostAuthor(postid){

        let sql = "select username from users u join posts p on u.id=p.userid where p.id = ?"

        const [result, _] = await db.query(sql, postid); 

        return result[0].username;
    }

    /**
     * Returns a post by its id
     */
    static async getPostById(id){
        let sql = "select * from posts where id = ?";   

        const [post,_] = await db.query(sql, id);       
        
        return post[0];
    }

    /**
     * Returns comments associated with a post
     */
    static async getPostComments(id){
        let sql = "select * from comments where postid = ?";   

        const [comments,_] = await db.query(sql, id);  
        
        let commentArray = [];

        for(let c of comments) {
            let comment = new Comment(c.userid, c.postid, c.content, c.commentDate);
            commentArray.push(comment);
        }

        return commentArray;
    }    

    /**
     * Returns number of likes a post has
     */
    static async getPostLikes(id){
        let sql = "select count(*) as likeCount from postLikes where postid = ?";   

        const [result,_] = await db.query(sql, id);       
        
        return result[0].likeCount;
    }       
    
    /**
     * Deletes a post from db
     */
    static async delete(id){
        let sql = "delete from posts where id = ?"

        await db.query(sql, id); 
    }

    /**
     * Returns a row from db if a certain user liked a certain post
     */
    static async getUserPostLike(postid, userid){
        let sql = "select * from postLikes where postid = ? and userid = ?"; 

        let [result,_] = await db.query(sql, [postid, userid]); 
        
        return result;
    }

    /**
     * Adds record to db representing a like if that record is not found. If it is, it is removed instead.
     */
    static async updatePostLikes(userid, postid){ 
        let sql = "insert into postLikes (userid, postid) values (?,?)"; 
        try {
            await db.query(sql, [userid,postid]); 
        } catch (error) {
            if(error.errno===1062){
                sql = "delete from postLikes where userid=? and postid=?"; 
                await db.query(sql, [userid,postid]); 
            }
            else{
                console.log(error);
            }
        }
    } 
    
}

module.exports=Post;