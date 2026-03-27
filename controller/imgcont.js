const express = require('express');
const Listing = require('../models/listing');
const User = require('../models/user');

async function getImage(req, res){
    const {username, password}=req.body;
    return res.json("sucess").status(200);
}

const getImage2 = async(req,res) =>{

}

module.exports = getImage,getImage2;