export class RoleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoleError";
  }
}

export class RoleNotFoundError extends RoleError {
  constructor(message = "Role tidak ditemukan") {
    super(message);
    this.name = "RoleNotFoundError";
  }
}

export class RoleAlreadyExistsError extends RoleError {
  constructor(message = "Role sudah terdaftar") {
    super(message);
    this.name = "RoleAlreadyExistsError";
  }
}


