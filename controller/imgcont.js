const express = require('express');
const Listing = require('../models/listing');
const User = require('../models/user');
const Trial = require("../models/trial");

async function getImage(req, res){
    try{
    const {username, password}=req.body;
    if(username==pass) return res.json("sucess").status(200);
    }catch(err){
        return res.error(err);
        return res.status(500);
    }
}

const getImage2 = async(req,res) =>{
     return res.status(401).json({message:"unaothorized"});
}

async function createInTrial(req,res){
    try{
        const {username,phone} = req.body;
        const user = await Trial.findOne({username});
        if(user) return res.status(409).json({message:"User already exists.."});
        await Trial.create({
            username,
            phone
        });
        // const trial = new Trial({username, phone});
        // await trial.save();
    }catch(err){

    }
}
module.exports = getImage,getImage2,createInTrial;