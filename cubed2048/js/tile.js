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
  context1.lineWidth = 3;
  context1.strokeStyle = "black";
  context1.font = "Bold 96px Helvetica Neue";

  context1.fillStyle = "#" + valueToHex(this.value, colors).toUpperCase();
  context1.fillRect(0,0,1000,1000);
  context1.strokeText(this.value.toString(), 105, 105);

    
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1); 
  texture1.needsUpdate = true;

  //var texture = THREE.ImageUtils.loadTexture( 'textures/crate.gif' );
  var material = new THREE.MeshBasicMaterial( {map: texture1, wireframe: false, vertexColors: THREE.VertexColors} );

  this.mesh = new THREE.Mesh( geometry, material );

  this.mesh.position.x = this.x * 100;
  this.mesh.position.y = this.y * 100;
  this.scene = scene;
  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
  //scene.add(this.mesh);
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
  this.mesh.position.x = position.x * 100;
  this.mesh.position.y = position.y * 100;
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
