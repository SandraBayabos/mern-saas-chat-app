export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword } = req.body;
  } catch (error) {}
};

export const login = (req, res) => {
  console.log("Login user");
};

export const logout = (req, res) => {
  console.log("Logout user");
};
