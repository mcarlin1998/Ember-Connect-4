import Component from "@ember/component";

export default Component.extend({
  playing: false,
  winner: undefined,
  draw: false,

  didInsertElement: function () {
    let stage = new createjs.Stage(this.$("#stage")[0]);
    //draw the game board
    let board = new createjs.Shape();
    let graphics = board.graphics;
    graphics.beginFill("#ffffff");
    graphics.drawRect(0, 99, 300, 2);
    graphics.drawRect(0, 199, 300, 2);
    graphics.drawRect(99, 0, 2, 300);
    graphics.drawRect(199, 0, 2, 300);
    board.x = 40;
    board.y = 40;
    board.alpha = 0;
    this.set('board', board);
    stage.addChild(board);

    let markers = {
      'x': [],
      'o': []
    };
    for (let x = 0; x < 5; x++) {
      let circleMarker = new createjs.Shape();
      graphics = circleMarker.graphics;
      graphics.beginStroke("#66ff66");
      graphics.setStrokeStyle(10);
      graphics.drawCircle(0, 0, 30);
      circleMarker.visible = false;
      stage.addChild(circleMarker);
      markers.o.push(circleMarker);

      let crossMarker = new createjs.Shape();
      graphics = crossMarker.graphics;
      graphics.beginStroke("#6666ff");
      graphics.moveTo(0, 0);
      graphics.lineTo(40, 40);
      graphics.moveTo(0, 40);
      graphics.lineTo(40, 0);
      crossMarker.visible = false;
      stage.addChild(crossMarker);
      markers.x.push(crossMarker);
    }
    this.set("markers", markers);
    this.set("stage", stage);
    createjs.Ticker.addEventListener("tick", stage);
  },
  click: function (ev) {
    if (this.get("playing") && !this.get("winner")) {
      if (
        ev.target.tagName.toLowerCase() === "canvas" &&
        ev.originalEvent.offsetX >= 40 &&
        ev.originalEvent.offsetY >= 40 &&
        ev.originalEvent.offsetX < 340 &&
        ev.originalEvent.offsetY < 340
      ) {
        let x = Math.floor((ev.originalEvent.offsetX - 40) / 100);
        let y = Math.floor((ev.originalEvent.offsetY - 40) / 100);
        let state = this.get("state");

        if (!state[x][y]) {
          let player = this.get("player");
          state[x][y] = player;

          let move_count = this.get("moves")[player];
          let marker = this.get("markers")[player][move_count];
          marker.visible = true;
          if (player == "x") {
            marker.x = 70 + x * 100;
            marker.y = 70 + y * 100;
          } else {
            marker.x = 90 + x * 100;
            marker.y = 90 + y * 100;
          }
          this.check_winner();
          this.get("moves")[player] = move_count + 1;
          if (player == "x") {
            this.set("player", "o");
          } else {
            this.set("player", "x");
          }
          this.get("stage").update();
        }
      }
    }
  },
  check_winner: function () {
    let patterns = [
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
    ];
    let state = this.get('state');
    for (let pidx = 0; pidx < patterns.length; pidx++) {
      let pattern = patterns[pidx];
      let winner = state[pattern[0][0]][pattern[0][1]];
      if (winner) {
        for (let idx = 1; idx < pattern.length; idx++) {
          if (winner != state[pattern[idx][0]][pattern[idx][1]]) {
            winner = undefined;
            break;
          }
        }
        if (winner) {
          this.set('winner', winner);
          break;
        }
      }
    }
    if (!this.get('winner')) {
      let draw = true;
      for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
          if (!state[x][y]) {
            draw = false;
            break;
          }
        }
      }
      this.set('draw', draw);
    }
  },
  actions: {
    start: function () {
      var board = this.get('board');
      board.alpha = 0;
      if(this.get('playing')) {
        var markers = this.get('markers');
        for(var idx = 0; idx < 5; idx++) {
          createjs.Tween.get(markers.x[idx]).to({y: 600}, 500);
          createjs.Tween.get(markers.o[idx]).to({y: 600}, 500);
        }
        createjs.Tween.get(board).wait(500).to({alpha: 1}, 1000);
      } else {
        createjs.Tween.get(board).to({alpha: 1}, 1000);
      }
      this.set("playing", true);
      this.set("winner", undefined);
      this.set("draw", false);
      this.set("state", [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]
      ]);
      this.set("moves", { 'x': 0, 'o': 0 });
      this.set("player", "x");
      this.get("stage").update();
    }
  }
});
