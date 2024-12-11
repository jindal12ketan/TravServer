class LoginDTO {
  constructor(name, email, token) {
    this.user = {
      name: name,
      email: email,
    };
    this.token = token;
  }
}

module.exports = LoginDTO;
