describe("POST /api/v1/auth/signup", () => {
    it("should create a new user to database", async () => {
        const data = {
            firstName: "John",
            lastName: "Doe",
            email: "john@gmail.com"
        }
        const userService = require("../src/services/user");
        const user = await userService.saveUser(data);
        const dbUser = await userService.findByEmail(data.email);
        
        expect(user).not.toBeNull();
        expect(user.firstName).toBe(dbUser.firstName);
        expect(user.lastName).toBe(dbUser.lastName);
        expect(user.email).toBe(dbUser.email);
    })
})