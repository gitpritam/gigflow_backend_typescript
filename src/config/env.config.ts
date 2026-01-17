class EnvConfig {
  private readonly _nodeEnv: string;
  private readonly _port: number;
  private readonly _databaseUrl: string;
  private readonly _jwtSecret: string;
  private readonly _jwtExpiresIn: string;
  private readonly _bcryptSaltRounds: number;
  private readonly _corsOrigin: string;

  constructor() {
    this._nodeEnv = process.env.NODE_ENV || "dev";
    this._port = parseInt(process.env.PORT || "5000", 10);
    this._databaseUrl = process.env.DATABASE_URL || "";
    this._jwtSecret = process.env.JWT_SECRET || "";
    this._jwtExpiresIn = process.env.JWT_EXPIRES_IN || "30d";
    this._bcryptSaltRounds = parseInt(
      process.env.BCRYPT_SALT_ROUNDS || "12",
      10,
    );
    this._corsOrigin = process.env.CORS_ORIGIN || "";
  }

  get nodeEnv(): string {
    return this._nodeEnv;
  }

  get port(): number {
    return this._port;
  }

  get databaseUrl(): string {
    return this._databaseUrl;
  }

  get isDevelopment(): boolean {
    return this._nodeEnv === "dev";
  }

  get isStage(): boolean {
    return this._nodeEnv === "stage";
  }

  get isProduction(): boolean {
    return this._nodeEnv === "prod";
  }

  get jwtSecret(): string {
    return this._jwtSecret;
  }

  get jwtExpiresIn(): string | number {
    return this._jwtExpiresIn;
  }

  get bcryptSaltRounds(): number {
    return this._bcryptSaltRounds;
  }

  get corsOrigin(): string {
    return this._corsOrigin;
  }
}

export const env = new EnvConfig();
