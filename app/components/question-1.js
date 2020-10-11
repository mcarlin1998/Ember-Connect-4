import Component from '@ember/component';

export default Component.extend({
  didInsertElement: function () {
    let stage = new createjs.Stage(this.$('#thestage')[0]);
    let shape = new createjs.Shape();
    let graphics = shape.graphics;
    graphics.beginStroke('#66ff66');
    graphics.setStrokeStyle(10);
    graphics.drawCircle(100, 100, 30);
    let shape1 = new createjs.Shape();
    graphics = shape1.graphics;
    graphics.beginFill('#0000000');
    graphics.setStrokeStyle(10);
    graphics.drawCircle(70, 110, 40);
    let shape2 = new createjs.Shape();
    graphics = shape1.graphics;
    graphics.beginFill('#66ff66');
    graphics.drawRect(100, 125, 13, 13);
    let shape3 = new createjs.Shape();
    graphics = shape3.graphics;
    graphics.beginFill('#66ff66');
    graphics.setStrokeStyle(5);
    graphics.drawCircle(105, 160, 10);
    stage.addChild(shape);
    stage.addChild(shape1);
    stage.addChild(shape2);
    stage.addChild(shape3);
    stage.update();
  }
});
