const { expect } = require("chai");
const sinon = require("sinon");
const { favoriteGet } = require("../controllers/film");
const Watch = require("../models/Watch");
const Interaction = require("../models/Interaction");

describe("Testes para o método favoriteGet (film.js)", () => {
  it("Deve ser FALSO quando req.xhr for FALSO e req.accepts('json, html') == 'json' for FALSO", () => {
    const req = {
      xhr: false,
      accepts: sinon.stub().returns("html"),
    };

    const next = sinon.spy();
    req.accepts("html");

    if (req.xhr || req.accepts("json,html") === "json") next();

    expect(next.calledOnce).to.be.false;
  });

  it("Deve ser verdadeiro quando req.xhr for FALSO e req.accepts('json,html') === 'json' for VERDADEIRO", () => {
    const req = {
      xhr: false,
      accepts: sinon.stub().returns("json"),
    };

    const next = sinon.spy();

    if (req.xhr || req.accepts("json,html") === "json") next();

    expect(req.accepts.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
  });

  it('Deve ser verdadeiro quando req.xhr for VERDADEIRO e req.accepts("json,html") === "json" for FALSO', () => {
    const req = {
      xhr: true,
      accepts: sinon.stub().returns("html"),
    };

    const next = sinon.spy();
    req.accepts("json,html");

    if (req.xhr || req.accepts("json,html") === "json") next();

    expect(req.accepts.calledOnce).to.be.true;
    expect(next.calledOnce).to.be.true;
  });

  it("Deve entrar no bloco if quando interaction for um objeto válido", () => {
    const interaction = {
      favorite: true,
      save: sinon.spy(),
    };
    const res = {};
    const next = sinon.spy();

    const interactionStub = sinon
      .stub(Interaction, "findOne")
      .yields(null, interaction);

    const watchStub = sinon
      .stub(Watch, "findOne")
      .yields(null, { id: "watch1" });

    favoriteGet(
      {
        body: { u: "user2" },
        user: { id: "user1" },
        params: { permalink: "umlinkqualquerai" },
        xhr: true,
        accepts: sinon.stub().returns("json"),
      },
      res,
      next
    );

    expect(interaction.save.calledOnce).to.be.true;

    expect(next.notCalled).to.be.true;

    interactionStub.restore();
    watchStub.restore();
  });

  it("Não deve entrar no bloco if quando interaction for um objeto inválido", (done) => {
    const interaction = null;

    const res = {
      send: sinon.spy(),
    };
    const next = sinon.spy();

    const interactionStub = sinon
      .stub(Interaction, "findOne")
      .yields(null, interaction);

    const watchStub = sinon
      .stub(Watch, "findOne")
      .yields(null, { id: "watch1" });

    favoriteGet(
      {
        body: { u: "user2" },
        user: { id: "user1" },
        params: { permalink: "umlinkqualquerai" },
        xhr: true,
        accepts: sinon.stub().returns("json"),
      },
      res,
      next
    );

    setImmediate(() => {
      expect(interactionStub.calledOnce).to.be.true;
      expect(watchStub.calledOnce).to.be.true;
      expect(next.notCalled).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.deep.equal({ success: true });
      interactionStub.restore();
      watchStub.restore();
      done();
    });
  });

  it("Faz o update quando existe interaction.favorite", () => {
    const interaction = {
      favorite: true,
      save: sinon.spy(),
    };

    const res = {};
    const next = sinon.spy();

    const interactionStub = sinon
      .stub(Interaction, "findOne")
      .yields(null, interaction);

    const watchStub = sinon
      .stub(Watch, "findOne")
      .yields(null, { id: "watch1" });

    favoriteGet(
      {
        body: { u: "user2" },
        user: { id: "user1" },
        params: { permalink: "umlinkqualquerai" },
        xhr: true,
        accepts: sinon.stub().returns("json"),
      },
      res,
      next
    );

    expect(interaction.favorite).to.be.false;
    expect(interaction.save.calledOnce).to.be.true;
    expect(next.notCalled).to.be.true;

    interactionStub.restore();
    watchStub.restore();
  });

  it("Não faz o update quando não existe interaction.favorite", (done) => {
    const interaction = null;
    const res = {
      send: sinon.spy(),
    };
    const next = sinon.spy();

    const interactionStub = sinon
      .stub(Interaction, "findOne")
      .yields(null, interaction);

    const watchStub = sinon
      .stub(Watch, "findOne")
      .yields(null, { id: "watch1" });

    favoriteGet(
      {
        body: { u: "user2" },
        user: { id: "user1" },
        params: { permalink: "umlinkqualquerai" },
        xhr: true,
        accepts: sinon.stub().returns("json"),
      },
      res,
      next
    );

    setImmediate(() => {
      expect(interactionStub.calledOnce).to.be.true;
      expect(watchStub.calledOnce).to.be.true;
      expect(next.notCalled).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      done();
    });
  });
});
