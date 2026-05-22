class LoginDTO {
  constructor(id, name, email, token) {
    this.user = {
      id,
      name: name,
      email: email,
    };
    this.token = token;
  }
}

module.exports = LoginDTO;
