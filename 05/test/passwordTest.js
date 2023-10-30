var assert = require("assert");

function includes(values, item) {
  return values.indexOf(item) >= 0;
}

describe("password api test", function () {
  var password;

  describe("test makePasswordEntry", function (done) {
    it("can get the function from the module by require", function (done) {
      password = require("../password");
      assert(password);
      assert.strictEqual(typeof password.makePasswordEntry, "function");
      done();
    });

    it("can make a password with a hash and salt", function (done) {
      var pwd = password.makePasswordEntry("TestPassword");
      assert.strictEqual(typeof pwd, "object");
      assert.strictEqual(typeof pwd.hash, "string");
      assert.strictEqual(pwd.hash.length, 40);
      assert.strictEqual(typeof pwd.salt, "string");
      assert.strictEqual(pwd.salt.length, 16);
      done();
    });

    it("should return a different salt and hash each time", function (done) {
      var saltsSeen = [];
      var hashsSeen = [];
      for (var i = 0; i < 100; i++) {
        var pwd = password.makePasswordEntry("TestPassword");
        assert(!includes(saltsSeen, pwd.salt), "duplicate salt returned");
        assert(!includes(hashsSeen, pwd.hash), "duplicate hash returned");
        saltsSeen.push(pwd.salt);
        hashsSeen.push(pwd.hash);
      }
      done();
    });
  });

  describe("test doesPasswordMatch", function (done) {
    var password;

    it("can get the function from the module by require", function (done) {
      password = require("../password");
      assert(password);
      assert.strictEqual(typeof password.doesPasswordMatch, "function");
      done();
    });

    it("can validate a password returned by makePasswordEntry", function () {
      var pwd = password.makePasswordEntry("TestPassword");
      assert(
        password.doesPasswordMatch(pwd.hash, pwd.salt, "TestPassword")
      );
      assert(
        !password.doesPasswordMatch(pwd.hash, pwd.salt, "NotTestPassword")
      );
    });
  });
});
