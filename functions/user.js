const {pool}= require('../Database/db')



const getTrains=(req,res)=>{   
        const{starting, destination}=req.body;
       pool.query('select * from  public."Trains" where starting=$1 and destination=$2',[starting,destination],
        (err,result)=>{
            if(err){
               return res.status(500).json({message:err.message});
            }
            if(result && result.rows.length > 0){
                res.status(200).json(result.rows);}
                else{
                    res.status(200).json({message:'Trains are not found in this moment.'});
                }
        });
}


const bookSeat = (req, res) => {
    const { train_id } = req.body;
    const email = req.user.email;

    pool.query('BEGIN', async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to start transaction' });
        }

        try {
            const trainResult = await pool.query('SELECT seats FROM public."Trains" WHERE train_id = $1 FOR UPDATE', [train_id]);
            const seatsLeft = trainResult.rows[0].seats;

            if (seatsLeft > 0) {
                const updateResult = await pool.query('UPDATE public."Trains" SET seats = seats - 1 WHERE train_id = $1 RETURNING *', [train_id]);
                if (updateResult.rows.length > 0) {
                    const insertResult = await pool.query('INSERT INTO public."Booking" (email, train_id, status) VALUES ($1, $2, $3) RETURNING *', [email, train_id, 'Booked']);
                    if (insertResult.rows.length > 0) {
                        await pool.query('COMMIT');
                        return res.json({ message: 'Booking finished successfully', booking_id: insertResult.rows[0].booking_id });
                    } else {
                        await pool.query('ROLLBACK');
                        return res.status(500).json({ message: 'Failed to insert booking record' });
                    }
                } else {
                    await pool.query('ROLLBACK');
                    return res.json({ message: 'No seats left for this moment' });
                }
            } else {
                await pool.query('ROLLBACK');
                return res.json({ message: 'No seats left for this moment' });
            }
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};


const BookingDetails = (req, res) => {
    const { booking_id } = req.body;
    pool.query(
        `SELECT b.*, t.* 
         FROM public."Booking" b 
         JOIN public."Trains" t ON b.train_id = t.train_id 
         WHERE b.booking_id = $1`,
        [booking_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Booking not found!' });
            }
            const booking = result.rows[0];
            res.json({ booking });
        }
    );
};




module.exports={getTrains,bookSeat,BookingDetails};


