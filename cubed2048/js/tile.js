function valueToHex(value, colors) {
  return colors[Math.log(value) / Math.log(2) - 1];
}

function Tile(position, value, _mesh, scene) {
  this.x                = position.x;
  this.y                = position.y;
  //this.z                = position.z;
  this.value            = value || 2;
  var geometry = new THREE.BoxGeometry( 70, 70, 70 );

  //var colors = [0xeee4da, 0xede0c8, 0xf2b179, 0xf59563, 0xf67c5f, 0xf65e3b, 0xedcf72, 0xedcf72, 0xedcc61, 0xedc850, 0xedc53f, 0xedc22e, 0x3c3a32];
  var colors = ["eee4da", "ede0c8", "f2b179", "f59563", "f67c5f", "f65e3b", "edcf72", "edcf72", "edcc61", "edc850", "edc53f", "edc22e", "3c3a32"];

  var canvas1 = document.createElement('canvas');
  var context1 = canvas1.getContext('2d');
  context1.lineWidth = 13;
  if(value == 2 || value == 4) {
    context1.strokeStyle = "#776e65";
  } else {
    context1.strokeStyle = "#f9f6f2";
  }
  context1.font = "96px Helvetica Neue";

  context1.fillStyle = "#" + valueToHex(this.value, colors).toUpperCase();
  context1.fillRect(0,0,1000,1000);
  var str = this.value.toString();
  var x = 0;
  if(str.length == 1) {
    x = 125;
  } else if (str.length == 2) {
    x = 100;
  } else if (str.length == 3) {
    x = 70;
  } else {
    x = 50;
  }
  
  context1.strokeText(str, x, 105);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1); 
  texture1.needsUpdate = true;

  //var texture = THREE.ImageUtils.loadTexture( 'textures/crate.gif' );
  var material = new THREE.MeshPhongMaterial( {map: texture1, wireframe: false, vertexColors: THREE.VertexColors, recieveShadow: true } );
  
  this.mesh = new THREE.Mesh( geometry, material );

  this.mesh.position.x = this.x * 110;
  this.mesh.position.y = this.y * 110;
  this.scene = scene;
  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
  scene.add(this.mesh);

}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position, vector, GMContext, c, t) {
  this.mesh.position.x = this.x * 110;
  this.mesh.position.y = this.y * 110;
  this.x = position.x;
  this.y = position.y;
  //this.mesh.position.x = position.x * 110;
  //this.mesh.position.y = position.y * 110;

  var self = this;
  var doneX = false;
  var doneY = false;

  var intervalX = setInterval(function(){
    //if (self.mesh.position.x == position.x * 110) {
    if ((self.mesh.position.x >= position.x * 110 && vector.x == 1) ||
        (self.mesh.position.x <= position.x * 110 && vector.x == -1)||
        (vector.x == 0)) {
      clearInterval(intervalX);

      /*
      if (doneY) {
        GMContext.prepareTiles();

        if (!GMContext.positionsEqual(c, t)) {
          GMContext.addRandomTile();
        }

      } else {
        doneX = true;
      }
      */
    } else {
      self.mesh.position.x += vector.x * 16;
    }
  },1);

  var intervalY = setInterval(function(){
    //if (self.mesh.position.y == position.y * 110) {
    if ((self.mesh.position.y >= position.y * 110 && vector.y == 1) ||
        (self.mesh.position.y <= position.y * 110 && vector.y == -1)||
        (vector.y == 0)) {
      clearInterval(intervalY);

      /*
      if (doneX) {
        GMContext.prepareTiles();

        if (!GMContext.positionsEqual(c, t)) {
          GMContext.addRandomTile();
        }
      } else {
        doneY = true;
      }
      */
    } else {
      self.mesh.position.y += vector.y * 16;
    }
  },1);

};

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value
  };
};
