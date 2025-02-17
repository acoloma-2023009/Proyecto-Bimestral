import User from '../src/user/user.model.js'
import Category from "../src/category/category.model.js";
import Product from "../src/product/product.model.js";
import { isValidObjectId } from 'mongoose'

export const existUsername = async(username)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existEmail = async(email)=>{
    const alreadyEmail = await User.findOne({email}) 
        if(alreadyEmail){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const objectIdValid = async(objectId)=>{    
    if(!isValidObjectId(objectId)){
        throw new Error(`Keeper is not objectId valid`)
    }
}

export const existCategory = async (categoryName) => {
    const alreadyCategory = await Category.findOne({ name: categoryName });
    if (alreadyCategory) {
        console.error(`Category ${categoryName} already exists`);
        throw new Error(`Category ${categoryName} already exists`);
    }
};

export const existProductName = async (productName) => {
    const alreadyProduct = await Product.findOne({ name: productName });
    if (alreadyProduct) {
        console.error(`Product ${productName} already exists`);
        throw new Error(`Product ${productName} already exists`);
    }
};


export const findUser = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}