const db = require('../config/db')
const date = require('./date');

/**
 * Models a user
 */
class User{
    constructor(username, password, usertype){
        this.username=username;
        this.password=password;        
        if(usertype){
            this.usertype=usertype;
        }
        else{
            this.usertype='visitor';
        }
    }

    /**
     * Saves user object to db
     */
    async save(){
        let registerDate = date.getTimestamp();

        let sql = "insert into users(username, pass, usertype, registerDate) values (?,?,?,?)"

        const [newUser,_] = await db.query(sql, [this.username, this.password, this.usertype, registerDate]);       

        return newUser;
    }

    /**
     * Translates user type to numerical permission value
     */
    static getPermissionLevel(usertype){
        switch(usertype) {
            case 'visitor' : return 1;
            case 'contentManager' : return 2;
            case 'admin' : return 3;
            default : return 0;
        }
    }

    /**
     * Returns a user from db by this username and password
     */
    async getUserByLoginParams(){
        let sql = 'select * from users where username = ? and pass = ?'
        const [newUser,_] = await db.query(sql, [this.username, this.password]);       

        return newUser;
    }

    /**
     * Returns all users
     */
    static async getAll(){
        let sql = "select * from users"

        const [allUsers,_] = await db.execute(sql);

        return allUsers;
    }

    /**
     * Returns user by id
     */
    static async getById(id){
        let sql = `select * from users where id = ?`

        const [user,_] = await db.query(sql, id);       

        return user;
    }
}

module.exports=User;