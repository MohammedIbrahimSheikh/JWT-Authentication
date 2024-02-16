import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://Dbuser:JfCMiKn6Rat2Tmpq@cluster0.zqhxsat.mongodb.net/?retryWrites=true&w=majority";
// Connect to your Atlas cluster
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log('error occured',err.stack);
        client.close();
        process.exit(1);
    }
}
run().catch(console.dir);
process.on('SIGINT',function(){
  console.log('app is terminating');
  client.close();
  process.exit(0);
})
export default client;