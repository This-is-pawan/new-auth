require('dotenv').config()
const mongoose=require('mongoose')

const connection=async function () {
 
 try {
  await mongoose.connect(process.env.MONGODB_URL)
  console.log( `db is connected`)
 } catch (err) {
  console.log(`disconnect ${err}`);
  
 }
}
module.exports=connection