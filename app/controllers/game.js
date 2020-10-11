import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    "save-highscore": function(name, score) {
      let controller = this;
      let highscore = controller.store.createRecord("highscore", {
        name: name,
        score: score
      });
      highscore.save().then(function() {
        controller.store.unloadAll();
        controller.transitionToRoute("highscores");
      });
    }
  }
});
