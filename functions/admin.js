const { pool } = require('../Database/db');


const AddTrain=(req, res) => {
    const { name, starting, destination, seats, api_key } = req.body;
    if (api_key !== 'pass') {
        return res.status(401).json({ message: 'Unauthorized access!' });
    }
    pool.query(
        'INSERT INTO public."Trains" (name, starting, destination, seats) VALUES ($1, $2, $3,$4) RETURNING *',
        [name, starting, destination, seats],
        (err, result) => {
            if (err) {
               
                return res.status(500).json({ error: "Internal server error" });
            }
            res.json({ message: 'New train added!' });
            
        }
    );
   
};

module.exports = {AddTrain};