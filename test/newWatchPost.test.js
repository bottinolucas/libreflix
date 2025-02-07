const { expect } = require("chai");
const { newWatchPost } = require("../controllers/watch");

describe("TDD do metodo newWatchPost", () => {
  it("deve ter erro se o campo ano nao for informado (PRIMEIRO CICLO)", () => {
    const req = {
      body: {
        title: "Um título qualquer",

        permalink: "permalink-teste",
      },
      validationErrors: () => null,
      flash: () => {},
      user: { id: "user123" },
    };

    const res = {
      render: () => {},
      redirect: () => {},
    };

    const next = () => {};

    expect(() => newWatchPost(req, res, next)).to.throw("ANO OBRIGATORIO!");
  });

  it("deve ter erro se o campo ano nao for numero (SEGUNDO CICLO)", () => {
    const req = {
      body: {
        year: "202A",
      },
      validationErrors: () => null,
      flash: () => {},
      user: { id: "user123" },
    };
    const res = {
      render: () => {},
      redirect: () => {},
    };
    const next = () => {};

    expect(() => newWatchPost(req, res, next)).to.throw(
      "ANO DEVE SER NUMERO VALIDO"
    );
  });
});
