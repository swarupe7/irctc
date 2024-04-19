const { pool } = require('../Database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 

const Register = (req, res) => {
    const { email, password, isAdmin } = req.body;

   
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log("Error in hashing password:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        
        pool.query(
            'INSERT INTO public."Users" (email, password, "isAdmin") VALUES ($1, $2, $3) RETURNING *',
            [email, hash, isAdmin],
            (err, result) => {
                if (err) {
                    console.log("ERROR in creating user:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                res.status(200).json({ msg: "User registered successfully" });
            }
        );
    });
}


const Login = (req, res) => {
    const { email, password } = req.body;

    
    pool.query(
        'SELECT * FROM public."Users" WHERE email = $1',
        [email],
        (err, result) => {
            if (err) {
                console.log("Error in database query:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            
            if (result.rows.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const user = result.rows[0];

            
            bcrypt.compare(password, user.password, (err, bcryptResult) => {
                if (err) {
                    console.log("Error in comparing passwords:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                if (!bcryptResult) {
                    return res.status(401).json({ error: "Invalid email or password" });
                }

                
                const token = jwt.sign(
                    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
                    'your-secret-key',
                    { expiresIn: '1h' }
                );

                res.status(200).json({ token: token });
            });
        }
    );
}



module.exports={Register, Login};