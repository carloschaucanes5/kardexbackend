const {pool} =  require("../db/conection");
const Response = require("../models/Response");
const CG = require("../config/configGeneral");
const CTU = require("../config/users/configTableUser");
const CU = require("../config/users/configUser");
const resu = new Response();
const jwt = require('jsonwebtoken');
const saveUser = async (req,res)=>{
    try{
        const {
            identification,first_name,second_name,first_lastname,second_lastname,
            email,address,phone,status,password,id_role,idt
          } = req.body;
        let sql = "insert into users(identification,first_name,second_name,first_lastname,second_lastname,email,address,phone,status,password,id_role,idt)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)";
        const response = await pool.query(sql,[identification,first_name,second_name,first_lastname,second_lastname,email,address,phone,status,password,id_role,idt]);
        resu.setCode(CG.C200);
        resu.setMessage(CU.registerSuccessUser);
        resu.setResponse(response.rowCount);
        res.json(resu);
    }
    catch(err)
    {
        const resError = new CTU();
        const r = resError.processErrors(err);
        res.json(r);
    }
}

const login = async(req,res)=>{
    try
    {
        const {email,password}=req.body;
        const response = await pool.query("select * from users where email = $1 and password = $2",[email,password]);
        if(response.rowCount== 1){
            const user = {email,password};
            const token = generateAccessToken(user);
            resu.setCode(CG.C200);
            resu.setMessage(CU.authenticatedUser);
            resu.setResponse({token,user:response.rows[0]});
            res.json(resu);
        }
        else
        {
            resu.setCode(CG.C400);
            resu.setMessage(CU.userInvalideData);
            resu.setResponse(CU.userInvalideData);
            res.json(resu);
        }
    }
    catch(err)
    {
        resu.setCode(CG.c500);
        resu.setMessage(CG.c500Message);
        resu.setResponse(err);
        res.json(resu);
    }
}

const generateAccessToken = (user)=>{
    return jwt.sign(user,CG.SECRETTOKEN,{expiresIn:'5m'});
}

const getUsers = async(req,res)=>{
const response = await pool.query("select * from users");
    res.send(response.rows);   
}

const getUserById = async(req,res)=>{
    try
    {
        const idUser = req.params.id;
        const response = await pool.query("select * from users where identification = $1",[idUser]);
        resu.setCode(CG.C200);
        resu.setMessage(CU.userFound);
        resu.setResponse(response.rows);
        res.json(resu);
    }
    catch(err)
    {
        resu.setCode(CG.c500);
        resu.setMessage(CG.c500Message);
        resu.setResponse(err);
        res.json(resu);
    }

}

const deleteUser = async(req,res)=>{
    const idUser = req.params.id; 
    const response = await pool.query("delete from users where id = $1",[idUser]);
    res.json(response);
}

const updateUser = async(req,res)=>{
    const idUser = req.params.id;
    const {name,email} = req.body;
    const response = await pool.query("update users set name = $1, email = $2 where id=$3",[name,email,idUser]);
    res.json(response);
}

//funcion para obtener listado de los tipos
//de identificacion para el usuario
const getTypesIdentification = async(req,res)=>{
    try{
        const response = await pool.query("select * from typesidentification where state = 'a'");
        resu.setCode(CG.C200);
        resu.setMessage('');
        resu.setResponse(response.rows);
        res.json(resu);
    }
    catch(err)
    {
        const resError = new CTU();
        const r = resError.processErrors(err);
        res.json(r);
    }

}
module.exports = {getUsers,saveUser,getUserById,deleteUser,updateUser,login,getTypesIdentification};