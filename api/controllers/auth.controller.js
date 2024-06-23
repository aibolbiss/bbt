import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log('New User: ', newUser);

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({ message: 'Failed to create user!' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: 'Invalid Credentials!' });

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid Credentials!' });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    res.setHeader('Set-Cookie', 'test=' + 'myValue').json('success');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to Login!' });
  }
};

export const logout = (req, res) => {
  res.send('Logout is working!');
};
