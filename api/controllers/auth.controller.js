// import bcrypt from 'bcrypt';
// import prisma from '../lib/prisma';

// export const register = async (req, res) => {
//   const { username, email, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);
//   //   const newUser = await prisma.user.create({
//   //     data: {
//   //       username,
//   //       email,
//   //       password: hashedPassword,
//   //     },
//   //   });

//   //   console.log(newUser);

//   //   res.status(201).json({ message: 'User created successfully' });

//   //   try {
//   //     const hashedPassword = await bcrypt.hash(password, 10);
//   //     const newUser = await prisma.user.create({
//   //       data: {
//   //         username,
//   //         email,
//   //         password: hashedPassword,
//   //       },
//   //     });

//   //     console.log(newUser);

//   //     res.status(201).json({ message: 'User created successfully' });
//   //   } catch (error) {
//   //     console.log(error);
//   //     res.status(500).json({ message: 'Failed to create user!' });
//   //   }
// };

export const register = (req, res) => {
  res.send('Register is working!');
};

export const login = (req, res) => {
  res.send('Login is working!');
};

export const logout = (req, res) => {
  res.send('Logout is working!');
};
