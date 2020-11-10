//global variables
var trex;
var trex_running;
var ground;
var groundimage;
var invisibleground;
var cloudimage;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var obstacleGroup, cloudGroup;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var trex_collided;
var gameover;
var restart;
var gameoverimage;
var restartimage;
var jumpsound,diesound,checkpointsound;
//preload funcion to load all the images and animation
function preload()
{
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  groundimage  = loadAnimation("ground2.png");
  cloudimage= loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  checkpointsound = loadSound("checkPoint.mp3");
}
//setup function where all the sprites can be created
function setup()
{
  createCanvas(600,200);
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.X = 50;
  //collision radius
  trex.debug = false;
  trex.setCollider("circle",0,0,40);
//adding artificial intelligence
//trex.setCollider("rectangle",0,0,400,trex.height);
  
  ground = createSprite(200,180,400,20);
  ground.addAnimation("ground", groundimage);
  ground.x = ground.width/2;
  edges = createEdgeSprites();
  
  invisibleground = createSprite(200,195,400,20);
  invisibleground.visible= false;
  //GROUP() predefined class in p5
  obstacleGroup = new Group();
  cloudGroup = new Group(); 
  
  restart = createSprite(300,150,20,20);
  restart.addImage("restart",restartimage);
  restart.scale = 0.5
  gameover = createSprite(300,100,20,20);
  gameover.addImage("gameover",gameoverimage)
  gameover.scale = 0.5;
}
//draw function where we give all the conditions to play the game
function draw()
{
  background('yellow');
  
  //score
  text("score: "+score,500,20);
  
  if(gamestate == PLAY)
    {
      gameover.visible=false;
      restart.visible=false;
      ground.velocityX = -2;
      score=score+Math.round(getFrameRate()/60);
      //ground reset
      if(ground.x<0)
     {
    ground.x = ground.width / 2; 
     }
      //trex jump
      if(keyDown("space")&& trex.y>=100)
     {
     trex.velocityY = -8;
     jumpsound.play();
    }
      //trexgravity
  trex.velocityY = trex.velocityY + 0.5;
      //calling generateclouds function
  generateclouds();
      //calling generate obstacles function
  generateObstacles();
      
      //trex touches obstacle
      if(obstacleGroup.isTouching(trex))
        {
          //adding AI to trex
          //trex.velocityY = -8;
          //jumpsound.play();
          diesound.play();
          gamestate = END;
        }
      
//checkpoint sound
      if(score>0 && score%100===0){
        checkpointsound.play();
      }
    }
  else if(gamestate== END)
    {
      ground.velocityX = 0;
      trex.changeAnimation("collided",trex_collided);
      obstacleGroup.setVelocityXEach(0);
      cloudGroup.setVelocityXEach(0); 
      obstacleGroup.setLifetimeEach(-1);
      cloudGroup.setLifetimeEach(-1);
      trex.velocityY=0;
      gameover.visible=true;
      restart.visible=true;
       if(mousePressedOver(restart)){
    reset();
  }
    }
  
  
  trex.collide(invisibleground);

 drawSprites();
}

//reset function

function reset(){
  gamestate = PLAY;
  gameover.visible=false;
  restart.visible=false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
  
}

//function to generate clouds
function generateclouds()
{
 if(frameCount % 60== 0)
   {
 cloud= createSprite(600,100,40,10);  
  cloud.velocityX= -2;
  cloud.addImage(cloudimage);
  cloud.scale=0.5;
  //calculate lifetime (time = distance / speed)
  cloud.lifetime=300;
 //console.log
 //console.log(cloud.depth);
     cloud.y=Math.round(random(10,60));
   //adjust the depth
     cloud.depth=trex.depth;
     trex.depth=trex.depth+1;
     cloudGroup.add(cloud);
   }
}
//function to generate obstacles
function generateObstacles(){
  if(frameCount%80==0){
    //local variable
 var obstacle= createSprite(600,165,10,40);
  obstacle.velocityX=-(4+score/500);
  obstacle.scale=0.5;
  obstacle.lifetime = 300;
    obstacleGroup.add(obstacle);
  //generating random obstacles using swicth 
    //local variables
var rand = Math.round(random(1,6));
switch(rand)
  {
    case 1: obstacle.addImage(obstacle1);
    break;
    case 2: obstacle.addImage(obstacle2);
    break;
    case 3: obstacle.addImage(obstacle3);
    break;
    case 4: obstacle.addImage(obstacle4);
    break;
    case 5: obstacle.addImage(obstacle5);
    break;
    case 6: obstacle.addImage(obstacle6);
    break;
    default: break;
  }
}
}
