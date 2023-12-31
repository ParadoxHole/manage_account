const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const expireTime = "2h"; //token will expire in 2 hours
const fs = require("fs");

const User = function(user){
    this.fullname = user.fullname;
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
    this.img = user.img;
}
User.checkUsername = (username, result)=>{
    sql.query("SELECT * FROM player WHERE userName='"+username+"'",(err,res)=>{
        if(err){
            console.log("Error: " + err);
            result(err, null);
            return;
        }
        if(res.length){
            console.log("Found username: " + res[0]);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found"}, null);
    });
};

User.create = (newUser, result)=>{
    sql.query("INSERT INTO player SET ?", newUser, (err, res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
        result(null, {id: res.insertId, ...newUser, accessToken: token});
        console.log("Created user:", {id: res.insertId, ...newUser, accessToken: token});
    });
};

User.loginModel = (account, result)=>{
    sql.query("SELECT * FROM player WHERE userName=?", [account.username], (err, res)=>{
        if(err){
            console.log("err:" + err);
            result(err, null);
            return;
        }
        if(res.length){
            const validPassword = bcrypt.compareSync(account.password, res[0].password);
            if(validPassword){
                const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
                console.log("Login success. Token: " + token);
                res[0].accessToken = token;
                result(null, res[0]);
                return;
            }else{
                console.log("Password not match");
                result({kind: "invalid_pass"}, null);
                return;
            }
        }
        result({kind: "not_found"}, null);
    });
};

User.getAllRecords = (result)=>{
    sql.query("SELECT * FROM users", (err, res)=>{
        if(err){
            console.log("Query err: " + err);
            result(err,null);
            return;
        }
        result(null, res);
    });
};
//const, var, let => function scope
const removeOldImage = (id, result) => {
    sql.query("SELECT * FROM player WHERE id=?", [id], (err, res)=>{
        if(err){
            console.log("error:" + err);
            result(err, null);
            return;
        }
        if(res.length){
            let filePath = __basedir + "/assets/" + res[0].img;
            try {
                if(fs.existsSync(filePath)){
                    fs.unlink(filePath, (e)=>{
                        if(e){
                            console.log("Error: " + e);
                            return;
                        }else{
                            console.log("File: " + res[0].img + " was removed");
                            return;
                        }
                    });
                }else {
                    console.log("File: " + res[0].img + " not found.")
                    return;
                }
            } catch (error) {
                console.log(error);
                return;
            }
        }
    });
};

User.updateUser = (id, data, result)=>{
    removeOldImage(id);
    sql.query("UPDATE player SET fullname=?, email=?, img=? WHERE id=?", 
    [data.fullname, data.email, data.img, id], (err, res)=>{
        if(err){
            console.log("Error: " + err);
            result(err, null);
            return;
        }
        if(res.affectedRows == 0){
            //NO any record update
            result({kind: "not_found"}, null);
            return;
        }
        console.log("Update user: " + {id: id, ...data});
        result(null, {id: id, ...data});
        return;
    });
};
User.removeUser = (id, result)=>{
    removeOldImage(id);
    sql.query("DELETE FROM player WHERE id=?", [id], (err, res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        if(res.affectedRows == 0){
            result({kind: "not_found"}, null);
            return;
        }
        console.log("Deleted user id: " + id);
        result(null, {id: id});
    } );
};
module.exports = User;