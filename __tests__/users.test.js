describe("Gettting user info", () => {
    
    it("should return user info given email", async () => {
        const { findByEmail } = require("../src/services/user")
        const email =  "john@gmail.com";
        const user = await findByEmail(email);
        expect(user.email).toEqual(email);
    })

});