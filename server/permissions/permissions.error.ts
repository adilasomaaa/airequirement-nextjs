export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export class PermissionNotFoundError extends PermissionError {
  constructor(message = "Permission tidak ditemukan") {
    super(message);
    this.name = "PermissionNotFoundError";
  }
}

export class PermissionAlreadyExistsError extends PermissionError {
  constructor(message = "Permission sudah terdaftar") {
    super(message);
    this.name = "PermissionAlreadyExistsError";
  }
}


