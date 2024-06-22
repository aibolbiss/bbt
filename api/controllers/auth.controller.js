import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  //   res.send('Register is working!');
};

export const login = (req, res) => {
  res.send('Login is working!');
};

export const logout = (req, res) => {
  res.send('Logout is working!');
};
