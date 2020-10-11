import Component from '@ember/component';

export default Component.extend({
  //playing set to false as default.
  playing: false,
  //Winner variable is undecided until someone wins.
  winner: undefined,
  //Variable is empty due to game not being started.
  draw: false,
  //Create Function
  didInsertElement: function() {
    //Create a variable called stage.
    var stage = new createjs.Stage(this.$('#stage')[0])

    //Create and draw the game board.
    var board = new createjs.Shape();
    var graphics = board.graphics;
    graphics.beginFill('#ffffff');
    //Draw lines with the specified coordinates.
    graphics.drawRect(0, 0, 340, 2);
    graphics.drawRect(340, 0, 2, 300);
    graphics.drawRect(0, 0, 2, 300);
    graphics.drawRect(0, 300, 340, 2);
    graphics.drawRect(49, 0, 2, 300);
    graphics.drawRect(97, 0, 2, 300);
    graphics.drawRect(146, 0, 2, 300);
    graphics.drawRect(195, 0, 2, 300);
    graphics.drawRect(243, 0, 2, 300);
    graphics.drawRect(291, 0, 2, 300);
    graphics.drawRect(0, 50, 340, 2);
    graphics.drawRect(0, 100, 340, 2);
    graphics.drawRect(0, 150, 340, 2);
    graphics.drawRect(0, 200, 340, 2);
    graphics.drawRect(0, 250, 340, 2);


    //Makes board transparrent until its acitvated.
    board.x = 20;
    board.y = 40
    board.alpha = 0;
    this.set('board', board);
    stage.addChild(board);

    //Creates variables for the users markers.
    var markers = {
      'x': [],
      'o': []
    }
    //Creates 22 markers for each player.
    for(var x = 0; x < 22; x++){
      //Creates blue circle marker for x, with a radius of 18 and makes it invisible until played.
      var circleBlueMarker = new createjs.Shape();
      graphics = circleBlueMarker.graphics;
      graphics.beginStroke('#0000FF');
      graphics.setStrokeStyle(10);
      graphics.drawCircle(0, 0, 18);
      circleBlueMarker.visible = false;
      stage.addChild(circleBlueMarker);
      markers.x.push(circleBlueMarker);
      //Creates red circle marker for o, with a radius of 18 and is invisble until played.
      var circleRedMarker = new createjs.Shape();
      graphics = circleRedMarker.graphics;
      graphics.beginStroke('#FF0000');
      graphics.setStrokeStyle(10);
      graphics.drawCircle(0, 0, 18);
      circleRedMarker.visible = false;
      stage.addChild(circleRedMarker);
      markers.o.push(circleRedMarker);
    }

    this.set('markers', markers);
    this.set('stage', stage);
    stage.addChild(board);
    createjs.Ticker.addEventListener("tick", stage);
  },

  click: function(ev) {
    if(this.get('playing') && !this.get('winner')){
      if(
        //Board is 360 wide and 340 tall and starts at 20/40.
        ev.target.tagName.toLowerCase() == 'canvas' &&
        ev.originalEvent.offsetX >= 20 &&
        ev.originalEvent.offsetY >= 40 &&
        ev.originalEvent.offsetX < 360 &&
        ev.originalEvent.offsetY < 340)
      {
        //subtracts 20 pixels and  divides by 48.5.
        var x = Math.floor((ev.originalEvent.offsetX - 20) / 48.5);
        //subtracts 40 pixels and divides by 50
        var y = Math.floor((ev.originalEvent.offsetY - 40) / 50);
        var state = this.get('state');
                //Gives y value of 5 and takes 1 away from variable when marker is placed in relevant column.
                if(y >= 0){
                  var y = 5;
                  var state = this.get('state');
                  while (state[x][y] == 'x' || state[x][y] == 'o'){
                    y = y - 1;
                  }

                  var player = this.get('player');
                  state[x][y] = player;

                  var move_count = this.get('moves')[player];
                  var marker = this.get('markers')[player][move_count];
                  marker.visible = true;

                  //where to place the markers.
                  marker.x = 45 + x * 48.5;
                  marker.y = 66 + y * 50;

                  this.get('moves')[player] = move_count + 1;
                  //Change which player's go it is.
                  if(player == 'x'){
                    this.set('player', 'o')
                  } else {
                    this.set('player', 'x');
                  }
                  this.get('stage').update();
                }
                //check if any of the patterns match and thus decide winner.
                this.check_winner();
              }
            }
          },

  check_winner: function() {
    //Create variable
    var patterns = [

    //All possibile angles for pattern to match. Diagonally, vertically and Horiztonially.

    [[3, 0], [2, 1], [1, 2], [0, 3]],
    [[4, 0], [3, 1], [2, 2], [1, 3]],
    [[3, 1], [2, 2], [1, 3], [0, 4]],
    [[5, 0], [4, 1], [3, 2], [2, 3]],
    [[4, 1], [3, 2], [2, 3], [1, 4]],
    [[3, 2], [2, 3], [1, 4], [0, 5]],
    [[5, 1], [4, 2], [3, 3], [2, 4]],
    [[4, 2], [3, 3], [2, 4], [1, 5]],
    [[3, 3], [4, 2], [5, 1], [6, 0]],
    [[5, 2], [4, 3], [3, 4], [2, 5]],
    [[3, 4], [4, 3], [5, 2], [6, 1]],
    [[3, 5], [4, 4], [5, 3], [6, 2]],
    [[6, 3], [5, 2], [4, 1], [3, 0]],
    [[6, 4], [5, 3], [4, 2], [3, 1]],
    [[5, 3], [4, 2], [3, 1], [2, 0]],
    [[5, 3], [4, 2], [3, 1], [2, 0]],
    [[6, 5], [5, 4], [4, 3], [3, 2]],
    [[5, 4], [4, 3], [3, 2], [2, 1]],
    [[4, 3], [3, 2], [2, 1], [1, 0]],
    [[5, 5], [4, 4], [3, 3], [2, 2]],
    [[4, 4], [3, 3], [2, 2], [1, 1]],
    [[3, 3], [2, 2], [1, 1], [0, 0]],
    [[4, 5], [3, 4], [2, 3], [1, 2]],
    [[3, 4], [2, 3], [1, 2], [0, 1]],
    [[3, 5], [2, 4], [1, 3], [0, 2]],

    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 1], [0, 2], [0, 3], [0, 4]],
    [[0, 2], [0, 3], [0, 4], [0, 5]],

    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[1, 1], [1, 2], [1, 3], [1, 4]],
    [[1, 2], [1, 3], [1, 4], [1, 5]],

    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[2, 1], [2, 2], [2, 3], [2, 4]],
    [[2, 2], [2, 3], [2, 4], [2, 5]],

    [[3, 0], [3, 1], [3, 2], [3, 3]],
    [[3, 1], [3, 2], [3, 3], [3, 4]],
    [[3, 2], [3, 3], [3, 4], [3, 5]],

    [[4, 0], [4, 1], [4, 2], [4, 3]],
    [[4, 1], [4, 2], [4, 3], [4, 4]],
    [[4, 2], [4, 3], [4, 4], [4, 5]],

    [[5, 0], [5, 1], [5, 2], [5, 3]],
    [[5, 1], [5, 2], [5, 3], [5, 4]],
    [[5, 2], [5, 3], [5, 4], [5, 5]],

    [[6, 0], [6, 1], [6, 2], [6, 3]],
    [[6, 1], [6, 2], [6, 3], [6, 4]],
    [[6, 2], [6, 3], [6, 4], [6, 5]],

    [[0, 5], [1, 5], [2, 5], [3, 5]],
    [[1, 5], [2, 5], [3, 5], [4, 5]],
    [[2, 5], [3, 5], [4, 5], [5, 5]],
    [[3, 5], [4, 5], [5, 5], [6, 5]],

    [[0, 4], [1, 4], [2, 4], [3, 4]],
    [[1, 4], [2, 4], [3, 4], [4, 4]],
    [[2, 4], [3, 4], [4, 4], [5, 4]],
    [[3, 4], [4, 4], [5, 4], [6, 4]],

    [[0, 3], [1, 3], [2, 3], [3, 3]],
    [[1, 3], [2, 3], [3, 3], [4, 3]],
    [[2, 3], [3, 3], [4, 3], [5, 3]],
    [[3, 3], [4, 3], [5, 3], [6, 3]],

    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 2], [2, 2], [3, 2], [4, 2]],
    [[2, 2], [3, 2], [4, 2], [5, 2]],
    [[3, 2], [4, 2], [5, 2], [6, 2]],

    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[1, 1], [2, 1], [3, 1], [4, 1]],
    [[2, 1], [3, 1], [4, 1], [5, 1]],
    [[3, 1], [4, 1], [5, 1], [6, 1]],

    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[1, 0], [2, 0], [3, 0], [4, 0]],
    [[2, 0], [3, 0], [4, 0], [5, 0]],
    [[3, 0], [4, 0], [5, 0], [6, 0]],


  ];

  let state = this.get('state');
  for(let pidx = 0; pidx < patterns.length; pidx++) {
    let pattern = patterns[pidx];
    let winner = state[pattern[0][0]][pattern[0][1]];

    if(winner) {
      //loop over coordinates starting at 1
      for(var idx = 1; idx < pattern.length; idx++) {
        if(winner != state[pattern[idx][0]][pattern[idx][1]]){
          winner = undefined;
          break;
        }
      }
      //If winner is identified then set winner.
      if(winner){
        this.set('winner', winner);
        break;

      }
    }
  }

  //Check if the game is a draw.
  if(!this.get('winner')) {
    var draw = true;
    for(var x = 0; x <= 6; x++) {
      for(var y = 0; y <= 5; y++) {
        if(!state[x][y]){
          draw = false;
          break;
        }
      }
    }
    this.set('draw', draw);
  }
  },

  actions: {
    start: function() {

      //If start is pressed then set playing to true.
      this.set('playing', true);
      //Winner is undefined.
      this.set('winner', undefined);
      this.set('draw', false);

      var board = this.get('board');
      //Fades board out if game is restarted.
      board.alpha = 0;
      //Moves markers outide of board so they are not in the and can be reused.
      if(this.get('playing')) {
        var markers = this.get('markers');
        for(var idx = 0; idx < 22; idx++){
          createjs.Tween.get(markers.x[idx]).to({y: 600}, 500);
          createjs.Tween.get(markers.o[idx]).to({y: 600}, 500);
        }
        createjs.Tween.get(board).wait(500).to({alpha: 2}, 1000);
      } else {
        createjs.Tween.get(board).to({alpha: 2}, 1000);
      }
      //Sets game state to undefined.
      this.set('state', [
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined]]);
        //Reset markers and places for players.
        this.set('moves', {'x': 0, 'o': 0});
        this.set('player', 'o');
        var markers = this.get('markers');

        //redraw the stage.
        this.get('stage').update();
      }
    },
});
