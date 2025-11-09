const { v4: uuidv4 } = require("uuid");

const REQUIRED_FIELDS = ["username", "age", "hobbies"];

interface UserProps {
  username: string;
  age: number;
  hobbies: string[];
}

class User {
  public id: string;
  public username: string;
  public age: number;
  public hobbies: string[];

  constructor({ username, age, hobbies }: UserProps) {
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !{ username, age, hobbies }[field as keyof UserProps]
    );
    if (missingFields.length > 0)
      throw new Error(`Field(s) ${missingFields.join(", ")} is(are) required`);
    if (typeof username !== "string")
      throw new Error("Field 'username' must be of a string type");
    if (typeof age !== "number")
      throw new Error("Field 'age' must be of a number type");
    if (
      !Array.isArray(hobbies) ||
      !hobbies.every((hobby) => typeof hobby === "string")
    )
      throw new Error("Field 'hobbies' must be an array of strings");

    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
    this.id = uuidv4();
  }

  public update({ username, age, hobbies }: Partial<UserProps>) {
    if (username) {
      if (typeof username !== "string")
        throw new Error("Field 'username' must be of a string type");
      this.username = username;
    }
    if (age) {
      if (typeof age !== "number")
        throw new Error("Field 'age' must be of a number type");
      this.age = age;
    }
    if (hobbies) {
      if (
        !Array.isArray(hobbies) ||
        !hobbies.every((hobby) => typeof hobby === "string")
      )
        throw new Error("Field 'hobbies' must be an array of strings");
      this.hobbies = hobbies;
    }
  }

  public destroy(usersDB: InstanceType<typeof User>[]) {
    const userIndex = usersDB.findIndex((user) => user.id === this.id);
    if (userIndex !== -1) {
      usersDB.splice(userIndex, 1);
    }
  }
}

module.exports = { User };
