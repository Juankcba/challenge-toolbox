import chai from "chai";
import request from "supertest";
import app from "../index.js";
const expect = chai.expect;

describe("Healthcheck", function () {
  it("should return a 200 status code", function (done) {
    request(app)
      .get("/")
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("should return a list of strings", function (done) {
    request(app)
      .get("/files/list")
      .end(function (err, res) {
        expect(Array.isArray(res.body.files)).to.be.true;
        res.body.files.forEach((item) => {
          expect(typeof item).to.equal("string");
        });
        done();
      });
  });
  it("should return a object of File", function (done) {
    request(app)
      .post("/file/data?fileID=test2.csv")
      .end(function (err, res) {
        expect(res.body).to.deep.equal({
          file: "test2.csv",
          lines: [
            {
              text: "HCclJSLYEKDu",
              number: "535",
              hex: "b2454012f1012a54d844aebb5712d70b",
            },
          ],
        });
        done();
      });
  });
  it("should return a list of object of File", function (done) {
    request(app)
      .get("/files/data")
      .end(function (err, res) {
        expect(res.body).to.deep.include({
          file: "test2.csv",
          lines: [
            {
              text: "HCclJSLYEKDu",
              number: "535",
              hex: "b2454012f1012a54d844aebb5712d70b",
            },
          ],
        });
        done();
      });
  });
});
