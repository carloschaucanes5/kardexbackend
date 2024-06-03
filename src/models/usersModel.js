import { Pool } from "pg";

const CG = require("../config/configGeneral");
const {pool} =  require("../db/conection");
export class UsersModel{
    constructor(){}
    //guardar usuario
    async saveUser(user){
        try{
            await pool.query('BEGIN');
            const {
                identification,first_name,second_name,first_lastname,second_lastname,
                email,address,phone,types_identification_id
            } = user;
            let sql1 = "insert into persons(identification,first_name,second_name,first_lastname,second_lastname,email,address,phone,types_identification_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)";
            const res1 = await pool.query(sql1,
                [
                    identification,
                    first_name.toUpperCase(),
                    second_name.toUpperCase(),
                    first_lastname.toUpperCase(),
                    second_lastname.toUpperCase(),
                    email,address,
                    phone,
                    types_identification_id
                ]);
            if(res1.rowCount!=1){
                await pool.query("ROLLBACK")
                return res1; 
            }
            let password1 = await EncryptText.encrypt(user.password,CG.numberOfRounds);
            let sq2 = "insert into users(alias,identification,roles_id,password,status) values($1,$2,$3,$4,$5)";
            const res2 = await pool.query(sql2,
                [
                    user.alias,
                    user.identification,
                    user.roles_id,
                    password1,
                    user.status
                ]);
            if(res2.rowCount!=1){
                await pool.query("ROLLBACK");
                return res2;
            };
            pool.query("COMMIT");
        }catch(err){
            await pool.query("ROLLBACK");
            return err; 
        }
        
    }

}

