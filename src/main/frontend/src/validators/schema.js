const loginSchema = {
  email: {
    required: true,
    format: "email"
  },
  password: {
    required: true,
    minLength: 8
  }
}