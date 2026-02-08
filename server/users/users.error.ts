export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export class UserNotFoundError extends UserError {
  constructor(message = "User tidak ditemukan") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class UserAlreadyExistsError extends UserError {
  constructor(message = "Email sudah terdaftar") {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}
