export class UserClass implements GoogleAppsScript.Base.User {
  email: string = 'test@example.com';

  constructor(email: string) {
    this.email = email;
  }
  getUserLoginId(): string {
    throw new Error('Method not implemented.');
  }

  getEmail() {
    return this.email;
  }
}
