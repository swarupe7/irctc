
const {Register,Login}= require('./functions/auth');
const {AddTrain}=require('./functions/admin');
const {getTrains,bookSeat,BookingDetails}=require('./functions/user');
const express= require('express');
const authenticate= require('./middleware/checkUser');
const checkAdmin=require('./middleware/checkAdmin');


const app = express();

const port=3000;



app.use(express.json());

//this route responsible for registering
app.post("/register",Register);
//this route responsible for login
app.post("/login",Login);
//this route responsible for adding train only accessible to admin users
app.post('/admin/add_train',authenticate,checkAdmin, AddTrain);
//this route responsible for getting train details between two different stations
app.post('/user/get_train',authenticate,getTrains);
// this route responsible for booking seat 
app.post('/user/book_seat',authenticate, bookSeat);
//this route is responsible for getting booking details
app.post('/user/booking_details',authenticate, BookingDetails);




app.listen(port, ()=>{
    console.log(`listening on port ${port}`); 
})