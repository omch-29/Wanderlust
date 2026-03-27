const express = require('express');
const Listing = require('../models/listing');
const User = require('../models/user');

async function getImage(req, res){
    try{
    const {username, password}=req.body;
    if(username==pass) return res.json("sucess").status(200);
    }catch(err){
        return res.error(err);
    }
}

const getImage2 = async(req,res) =>{

}

module.exports = getImage,getImage2;