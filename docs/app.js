

var Vector2 = function (x,y) {
  this.x= x || 0; 
  this.y = y || 0; 
};

Vector2.prototype = {

  reset: function ( x, y ) {

    this.x = x;
    this.y = y;

    return this;

  },
  toString : function (decPlaces) {
     decPlaces = decPlaces || 3; 
    var scalar = Math.pow(10,decPlaces); 
    return "[" + Math.round (this.x * scalar) / scalar + ", " + Math.round (this.y * scalar) / scalar + "]";
  },
  
  clone : function () {
    return new Vector2(this.x, this.y);
  },
  
  copyTo : function (v) {
    v.x = this.x;
    v.y = this.y;
  },
  
  copyFrom : function (v) {
    this.x = v.x;
    this.y = v.y;
  },  
  magnitude : function () {
    return Math.sqrt((this.x*this.x)+(this.y*this.y));
  },
  
  magnitudeSquared : function () {
    return (this.x*this.x)+(this.y*this.y);
  },
  
  normalise : function () {
    
    var m = this.magnitude();
        
    this.x = this.x/m;
    this.y = this.y/m;

    return this;  
  },
  
  reverse : function () {
    this.x = -this.x;
    this.y = -this.y;
    
    return this; 
  },
  
  plusEq : function (v) {
    this.x+=v.x;
    this.y+=v.y;
    
    return this; 
  },
  
  plusNew : function (v) {
     return new Vector2(this.x+v.x, this.y+v.y); 
  },
  
  minusEq : function (v) {
    this.x-=v.x;
    this.y-=v.y;
    
    return this; 
  },

  minusNew : function (v) {
     return new Vector2(this.x-v.x, this.y-v.y); 
  },  
  
  multiplyEq : function (scalar) {
    this.x*=scalar;
    this.y*=scalar;
    
    return this; 
  },
  
  multiplyNew : function (scalar) {
    var returnvec = this.clone();
    return returnvec.multiplyEq(scalar);
  },
  
  divideEq : function (scalar) {
    this.x/=scalar;
    this.y/=scalar;
    return this; 
  },
  
  divideNew : function (scalar) {
    var returnvec = this.clone();
    return returnvec.divideEq(scalar);
  },

  dot : function (v) {
    return (this.x * v.x) + (this.y * v.y) ;
  },
  
  angle : function (useRadians) {
    
    return Math.atan2(this.y,this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
    
  },
  
  rotate : function (angle, useRadians) {
    
    var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
    var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
  
    Vector2Const.temp.copyFrom(this); 

    this.x= (Vector2Const.temp.x*cosRY)-(Vector2Const.temp.y*sinRY);
    this.y= (Vector2Const.temp.x*sinRY)+(Vector2Const.temp.y*cosRY);
    
    return this; 
  },  
    
  equals : function (v) {
    return((this.x==v.x)&&(this.y==v.x));
  },
  
  isCloseTo : function (v, tolerance) {  
    if(this.equals(v)) return true;
    
    Vector2Const.temp.copyFrom(this); 
    Vector2Const.temp.minusEq(v); 
    
    return(Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
  },
  
  rotateAroundPoint : function (point, angle, useRadians) {
    Vector2Const.temp.copyFrom(this); 

    Vector2Const.temp.minusEq(point);
    
    Vector2Const.temp.rotate(angle, useRadians);
    
    Vector2Const.temp.plusEq(point);
    
    this.copyFrom(Vector2Const.temp);
    
  }, 
  
  isMagLessThan : function (distance) {
    return(this.magnitudeSquared()<distance*distance);
  },
  
  isMagGreaterThan : function (distance) {
    return(this.magnitudeSquared()>distance*distance);
  }
  
  
  

};

Vector2Const = {
  TO_DEGREES : 180 / Math.PI,    
  TO_RADIANS : Math.PI / 180,
  temp : new Vector2()
  };
(function () {

var spareBullets = [];

window.Bullet = function (ctx, x, y, angle) {
  if (this === window) {
    if (spareBullets.length) {
      var bullet = spareBullets.pop();
      bullet.init(x, y, angle);
      bullet.fresh = false;
      return bullet;
    } else {
      return new Bullet(ctx, x, y, angle);
    }
  }
  
  this.ctx = ctx;

  // byrjar
  this.init(x, y, angle);
  return this;
};

Bullet.prototype = {
  init: function (x, y, angle) {
    this.fresh = true;
    this.pos = new Vector2(x,y);
    this.vel = new Vector2(Bullet.speed,0);

    this.vel.rotate(angle);

    this.enabled = true;    

    // 15 er lengd skipsins
    this.pos.plusEq(this.vel.clone().normalise().multiplyEq(15));    
  },
  
  checkEnabled: function ()  {
    var ctx = this.ctx;
    
    if (this.enabled == false) {
      return;
    }
    
    if (this.pos.x < 0 || this.pos.x > ctx.canvas.width) this.enabled = false;

    if (this.pos.y < 0 || this.pos.y > ctx.canvas.height) this.enabled = false;
    
    if (this.enabled == false) {
      spareBullets.push(this);
    }
  },
  
  update: function () {
    this.pos.plusEq(this.vel);     
    this.checkEnabled();
    return this;    
  },
  
  draw: function () {
    var ctx = this.ctx,
        pos = this.pos;
        
    ctx.save();
    ctx.lineWidth = 2; 
    ctx.strokeStyle = "#fff"; 
    ctx.beginPath(); 
    ctx.arc(pos.x, pos.y, 2, 0, Math.PI*2, true); 
    ctx.stroke();
    ctx.restore();
    return this;    
  }
};

// static
Bullet.speed = 10;

})();


Asteroid = function (x,y,radius)
{
  this.pos = new Vector2(x,y); 
  this.vel = new Vector2(0,0); 
  
  this.points; 
  

  this.enabled = true; 
  
  
  // tempvigur til að reikna fjarlægð frá hring í hitTest
  this.diff = new Vector2(0,0); 
  
  this.reset = function (radius) {
    this.points = []; 
    this.radius = radius; 
    
    var temp = new Vector2(radius, 0);
    
    for (var angle = 0; angle<360; angle+= random(0, 45)) {
      temp.reset(random(radius / 2, radius),0); 
      temp.rotate(angle);
      
      this.points.push(temp.clone()); 
    }
  
    
  };
  
  this.reset(radius); 
  
  this.update = function(canvas) {
    
    this.pos.plusEq(this.vel); 

    if(this.pos.x+this.radius < 0) this.pos.x = canvas.width+this.radius; 
    else if (this.pos.x-this.radius > canvas.width) this.pos.x = -this.radius; 
      
    if(this.pos.y+this.radius < 0) this.pos.y = canvas.height+this.radius; 
    else if (this.pos.y-this.radius > canvas.height) this.pos.y = -this.radius; 
        
  };
  
  this.draw = function(ctx) {
    ctx.save(); 
    ctx.translate(this.pos.x, this.pos.y); 
    ctx.strokeStyle = "#8300ff";
    ctx.fillStyle = '#000';
    ctx.lineWidth = 2; 
    ctx.beginPath(); 
  
    for(var i = 0; i<this.points.length; i++) {
      
      var p = this.points[i % this.points.length]; 
      ctx.lineTo(p.x, p.y); 
      
    }
    
    ctx.closePath(); 
    ctx.fill();
    ctx.stroke();
    ctx.restore(); 
  };
  
  this.hitTest = function(x,y) {
    
    this.diff.copyFrom(this.pos); 
    this.diff.x-=x; 
    this.diff.y-=y; 
    
    var distanceSq = (this.diff.x * this.diff.x) + (this.diff.y*this.diff.y);
    return distanceSq < (this.radius * this.radius);
    
  };
  
};

ShipMoving = function(x,y) {
  this.pos = new Vector2(x,y); 
  this.angle = 0; 
  this.vel = new Vector2(0,0); 
  this.temp = new Vector2(0,0); 
  
  this.thrustPower = 0.1; 
  this.rotateSpeed = 5; 
  
  this.thrusting = false;
  this.invulnerable = false;
  this.thrustAmount = 0;
  
  this.dead = [];  

  this.update = function() {
    this.pos.plusEq(this.vel); 
  };
  
  this.thrust = function() {
    this.temp.reset(this.thrustPower,0); 

    this.temp.rotate(this.angle); 
    this.vel.plusEq(this.temp); 
  };
  
  this.rotateLeft = function() {
    this.angle -= this.rotateSpeed; 
  };
  
  this.rotateRight = function() {
    this.angle += this.rotateSpeed; 
  };
  
  this.hit = function () {
    var n = 20;
    while (n--) {
      this.dead.push(new Vector2(random(3, 6), 0));
      this.dead[this.dead.length - 1].rotate(Math.random() * Math.PI * 2, true);
    }
  };
  
  this.isdead = function () {
    
    return !!this.dead.length;
  };
  
  this.draw = function(c) {    
    c.save();
    c.translate(this.pos.x, this.pos.y); 
    c.rotate(this.angle * Vector2Const.TO_RADIANS);

    if (this.invulnerable == false && !this.isdead()) {
      c.lineWidth = 4; 

      if (this.thrustAmount) {
        c.beginPath();
        c.moveTo(-11, -3);
        c.lineTo(-11, 3);
        c.lineTo(-12 -this.thrustAmount, 0);
        c.closePath(); 
        c.fillStyle = 'hsla(3, 100%, 50%, 0.9)';
        c.fill();      
        c.strokeStyle = 'hsla(32, 100%, 50%, 0.7)';
        c.stroke();
      }
    
      c.lineWidth = 2; 
      c.strokeStyle = "#ff0303"; 
    
      c.beginPath();
      c.moveTo(-10, -10);
      c.lineTo(-10, 10);
      c.lineTo(14, 0);
      c.closePath(); 
      c.stroke();      
    } else if (this.dead.length) {
      var i = this.dead.length;
      c.lineWidth = 2; 
      c.fillStyle = 'hsla(1, 100%, 50%, 0.75)'; 
      while (i--) {
        this.dead[i].multiplyEq(1.05);

        c.beginPath();
        c.arc(this.dead[i].x, this.dead[i].y, 2, 0, Math.PI * 2, true);
        c.closePath(); 
        c.fill();
      }
    }
    
    if (this.thrusting && this.thrustAmount < 10) {
      this.thrustAmount++;
    } else if (this.thrustAmount > 0) {
      this.thrustAmount--;
    }
    
    c.restore();
  };
}; 
// canvas element og 2D context

var canvas = document.createElement('canvas'),
  c = canvas.getContext('2d'),
  touch = 'createTouch' in document;

canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 
document.body.appendChild(canvas);

c.strokeStyle = "#ffffff";

var mouseX, mouseY, 
  halfWidth = canvas.width/2, 
  halfHeight = canvas.height/2,
  bullets = [],
  spareAsteroids = [],
  ship = new ShipMoving(halfWidth, halfHeight),
  thrusting = false,
  rotateLeft = false, 
  rotateRight = false,
  grad = c.createLinearGradient(0, 0, 0, canvas.height),
  asteroids = [],
  trail = 0.85;
  

grad.addColorStop(0, 'hsla(240,80%,2%,' + trail + ')');
grad.addColorStop(1, 'hsla(240,100%,15%,' + trail + ')');

timer = setInterval(draw, 1000/35); 

for (var i = 0; i < (touch ? 5 : 10); i++) {
  asteroids.push(new Asteroid(random(0, canvas.width), random(0, canvas.height), 50));
  asteroids[i].vel.reset(1,0).rotate(random(0,360));
}


function draw() {
  c.fillStyle = '#000'; //gradientið;
  c.fillRect(0,0,canvas.width, canvas.height); 
  
  var bullet;
  for (var i=0; i<bullets.length; i++) {
    bullet = bullets[i];
    if (bullet.enabled) {
      bullet.update();
      bullet.draw();
    }
  }

  for (i = 0; i < asteroids.length; i++) {  
    var asteroid = asteroids[i], 
        hit = false;
    
    if (!ship.invulnerable && !ship.isdead() && asteroid.hitTest(ship.pos.x, ship.pos.y)) {
      // þú tapaðir!
      ship.hit();
    }
    
    if(!asteroid.enabled) continue; 
    
    if (!ship.isdead()) {
      for (var j = 0; j < bullets.length; j++) {
        if (bullets[j].enabled) {
          hit = asteroid.hitTest(bullets[j].pos.x, bullets[j].pos.y);
          if (hit) {
            bullets[j].enabled = false;
            break;
          }        
        }
      }      
    }
    
    if (hit) {
      if (asteroid.radius < 15) {
        asteroid.enabled = false; 
      } else {
        asteroid.reset(asteroid.radius/2);
        asteroid.vel.reset(random(-5,5),random(-5,5));
        add1()
        makenyrloftsteinn(asteroid.pos.x, asteroid.pos.y, asteroid.radius).vel.reset(random(-5,5),random(-5,5));
        makenyrloftsteinn(asteroid.pos.x, asteroid.pos.y, asteroid.radius).vel.reset(random(-5,5),random(-5,5));
      }
    } else {
      asteroid.update(canvas);
      asteroid.draw(c); 
    }
  }

  if (ship.thrusting) ship.thrust(); 
  if (rotateLeft) ship.rotateLeft(); 
  if (rotateRight) ship.rotateRight(); 

  ship.update(); 

  if (ship.pos.x<0) ship.pos.x = canvas.width; 
  else if (ship.pos.x>canvas.width) ship.pos.x = 0;

  if (ship.pos.y<0) ship.pos.y = canvas.height; 
  else if (ship.pos.y>canvas.height) ship.pos.y = 0; 

  ship.draw(c);
}
var score = 0;
document.getElementById("stig").innerHTML = +score;
function add1() {
    score += 5;
    document.getElementById("stig").innerHTML = +score;

    };
function makenyrloftsteinn(x, y, radius) {
  var nyrloftsteinn; 
  
  if (spareAsteroids.length > 0) {
    nyrloftsteinn = spareAsteroids.pop(); 
    nyrloftsteinn.pos.set(x, y); 
    nyrloftsteinn.radius = radius;   
  } else {
    nyrloftsteinn = new Asteroid(x, y, radius); 
    asteroids.push(nyrloftsteinn); 
  }
  
  return nyrloftsteinn;
}

function fire() {
  if (ship.isdead()) {
    return;
  }
  
  // leifir bara n bullets
  var limit = 5,
      i = bullets.length;
  
  while (i--) {
    if (bullets[i].enabled) {
      limit--;
    }
  }
  
  if (limit !== 0) {
    var bullet = Bullet(c, ship.pos.x, ship.pos.y, ship.angle);
    if (bullet.fresh) bullets.push(bullet);    
  }  
}

canvas.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );

document.addEventListener( 'touchstart', onTouchStart, false );
document.addEventListener( 'touchmove', onTouchMove, false );
document.addEventListener( 'touchend', onTouchEnd, false );

var swipe = [];

if (touch) {
  ship.thrustPower = 0.5;
}

function onTouchStart(e) {
  swipe = [];
  
  if (e.touches.length == 1) {
    // snúa & skjóta
    var v = new Vector2(e.touches[0].pageX-canvas.width/2, e.touches[0].pageY-canvas.height/2);
    ship.angle = v.angle();
    fire();
  } else if (e.touches.length == 2) {
    ship.thrusting = true;
    ship.thrust();
  } else if (e.touches.length == 3) {
    ship.invulnerable = true;
  }
}

function onTouchMove(e) {
  e.preventDefault();
} 



function onTouchEnd(e) { 
  ship.thrusting = false;
  ship.invulnerable = false;
} 

function onKeyDown(e) {  
  if(e.keyCode == 38) ship.thrusting = true;
  else if (e.keyCode == 40) ship.invulnerable = true;
  else if(e.keyCode == 37) rotateLeft = true; 
  else if (e.keyCode == 39) rotateRight = true;
  else if (e.which == 32) fire();
}
function onKeyUp(e) {
  if (e.keyCode == 38) ship.thrusting = false;
  else if (e.keyCode == 40) ship.invulnerable = false;
  else if(e.keyCode == 37) rotateLeft = false; 
  else if (e.keyCode == 39) rotateRight = false;
}

function onMouseMove(event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
}

function random(v1, v2){
  return ((Math.random()*(v2-v1))+v1);  
}

setTimeout(function () {
  window.scrollTo(1, 0);
}, 1000);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
