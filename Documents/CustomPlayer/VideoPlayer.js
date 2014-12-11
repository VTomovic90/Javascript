window.onload = onloadFunction;


var Player = function(div,i){
	
				this.i = i;
	
			/**
				Creating video element
			*/
				var video = this.Video.create("test",this.i);
				div.appendChild(video);
			
				this.video = video;
			/**
				Creating controls div (array specifies what elements will div contain)
				This is array when every element is called:
					arr = ["Toggle","Slider","Current","Duration","Vol","Full"];
			*/
				var ctrlElements = ["Toggle","Slider","Current","Duration","Vol","Full"];
				var controls = this.Controls.create(ctrlElements,this.video,i);
				div.appendChild(controls);
				
				this.controls = controls;
				
				
			/**
				Assigning EventListeners to video element
			*/
				Player.prototype.assignListeners(this.video,this.videoEvents);	
				
				this.toggle = this.Controls.toggle;
				this.slider = this.Controls.slider;
				this.current = this.Controls.duration;
				this.duration = this.Controls.duration;
				this.vol = this.Controls.vol;
				this.full = this.Controls.full;		

		};
		
		Player.prototype = {
				
				controls: null,
				toggle: null,
				slider: null,
				vol: null,
				current: null,
				duration: null,
				full: null,
				video: null,
				i: null,

				
				videoEvents: ["click",
							"dblclick",
							"mouseover",
							"mouseout",
							"keydown",
							"load",
							"abort",
							"canplay",
							"canplaythrough",
							"change",
							"durationchange",
							"emptied",
							"ended",
							"error",
							"loadeddata",
							"loadedmetadata",
							"loadstart",
							"pause",
							"play",
							"playing",
							"progress",
							"ratechange",
							"seeked",
							"seeking",
							"stalled",
							"suspend",
							"timeupdate",
							"volumechange",
							"waiting"],	
				
				
		init: function(div,i){
			
			return this;
		},
		
		play: function(id){
			
			var video = Players.getPlayer[id].video;
			var toggle = Players.getPlayer[id].toggle;
			
			if(video.paused){
				video.play();
				toggle.innerHTML = "pause";
			}else{
				console.log("Player is already playing!");
			}
			
		},
		
		pause: function(id){
			
			var video = Players.getPlayer[id].video;
			var toggle = Players.getPlayer[id].toggle;
			
			if(!video.paused){
				video.pause();
				toggle.innerHTML = "play";
			}else{
				console.log("Player is already paused!");
			}
		},
		
		fullscreen: function(id){
			
			var vid = Players.getPlayer[id].video;
			
			if (vid.mozRequestFullScreen) {
				vid.mozRequestFullScreen();
			} else if (vid.webkitRequestFullScreen) {
				vid.webkitRequestFullScreen();
			}
		},
		
		
		/**
			Assigning event listeners to element
		*/
		assignListeners: function(element,eventArr){
		
			for(var j in eventArr){
				element.addEventListener(eventArr[j], Player.prototype.Events.callEvent);
			}
		},
		
		
		/**
			When event occurs Events.callEvent
		*/
		Events : {
	
		/**
			Calls function depending on event that has occurred
		*/
			callEvent : function(e){

				try{
					Player.prototype.Events["video_"+e.type].call(this, e);
				}catch(err){
					//console.error(e.type);
				}
	
			},
	
			/**
				What happens when double click occurs
			*/
			video_dblclick : function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				
				Player.prototype.fullscreen(id);
			},
			
			/**
				What happens when click occurs
			*/
			
			//for video
			video_click : function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				
					if(this.paused){
						Player.prototype.play(id);
					}else{
						Player.prototype.pause(id);
					}
			},
			
			//for toggle button	
			toggle_click: function(e){
				
				var id = parseInt(this.getAttribute("data-id"));

				var video = Players.getPlayer[id].video;
				
					if (video.paused){ 
						Player.prototype.play(id); 
					}else{ 
						Player.prototype.pause(id); 
					}
				
			},
			
			//for full screen button	
			full_click : function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				
				Player.prototype.fullscreen(id);
			},
			/**
				What happens when change event occurs
			*/
			range_change : function(e){
			
				var id = parseInt(this.getAttribute("data-id"));
				
				var vid = Players.getPlayer[id].video;
				var seekto = vid.duration * (this.value/100);
				vid.currentTime = seekto;
			},
			
			vol_change: function(e){
				
				var id = parseInt(this.getAttribute("data-id"));
				
				var vid = Players.getPlayer[id].video;
				vid.volume = this.value/100;	
			},
			
			/**
				What happens when time update occurs
			*/
			video_timeupdate : function(e){
			
				var id = parseInt(this.getAttribute("data-id"));
				
				var time = this.currentTime * (100/this.duration);
				var slider = Players.getPlayer[id].slider;
				slider.value = Math.round(time);
				var curTime = Players.getPlayer[id].current;
				var durTime = Players.getPlayer[id].duration;
					
					var minsC = Math.floor(this.currentTime/60);
					var secsC = Math.floor(this.currentTime - minsC * 60);
					
					var minsD = Math.floor(this.duration/60);
					var secsD = Math.round(this.duration - minsD * 60);
					
					if(secsC < 10){
						secsC = "0" + secsC;
					}
					if(secsD < 10){
						secsD = "0" + secsD;
					}
					curTime.innerHTML = minsC + ":" + secsC + "  -  ";
					durTime.innerHTML = minsD + ":" + secsD;
			}
		},

		Video: {

			
			create: function(name,id){
				
				var video = document.createElement("video");
				video.width = 500;
				video.height = 210;
				video.setAttribute("data-id",id);
				video.id = "video"+id;
				
						
				var source1 = document.createElement("source");
				source1.src = name+".mp4";
				source1.type = "video/mp4";
				video.appendChild(source1);
						
				var source2 = document.createElement("source");
				source2.src = name+".ogg";
				source2.type = "video/ogg";
				video.appendChild(source2);

				Player.prototype.video = video;	
				
				return video;
			}
		
		},	

		/**
			Div with all controls for video
		*/
		Controls: {

			video: null,
			toggle: null,
			slider: null,
			vol: null,
			current: null,
			duration: null,
			full: null,
			i: null,

			/**
				Method that creates div
			*/
			create: function(arr,vid,i){
				
				this.video = vid;
				this.i = i;
				
				var controls = document.createElement("div");
				
				controls.id = "controls"+i;
				controls.setAttribute("style","background-color: #ccc; width: 500px;");
				Player.prototype.controls = controls;
				
				for(var j=0; j<arr.length; j++){
					Player.prototype.Controls["add"+arr[j]].call(this);
				}
				
				
				return controls;
			},		
			
			
			addToggle: function(){
				
				
				var toggle = this.Button.create();
				toggle.id = "toggle"+this.i;
				toggle.setAttribute("data-id",this.i);
				Player.prototype.controls.appendChild(toggle);
				toggle.innerHTML = "play";
				toggle.addEventListener("click",Player.prototype.Events.toggle_click);
				this.toggle = toggle;
			},
			
			addSlider: function(){
					
				var slider = this.Input.create("range");
				slider.id ="slider"+this.i;
				slider.min = 0;
				slider.max = 100;
				slider.style.width = "150px";
				slider.value = 0;
				slider.setAttribute("data-id",this.i);
				slider.step = 1;
				slider.setAttribute("style","color: black");
				slider.addEventListener("change",Player.prototype.Events.range_change);
				Player.prototype.controls.appendChild(slider);
				this.slider = slider;
			},

			addCurrent: function(){
				
				current = this.Span.create();
				current.id = "current"+this.i;
				current.setAttribute("data-id",this.i);
				Player.prototype.controls.appendChild(current);
				current.innerHTML = "0:00  -  ";
				this.current = current;
			},
				
			addDuration: function(){
				
				var duration = this.Span.create();
				duration.id ="duration"+this.i;
				duration.setAttribute("data-id",this.i);
				Player.prototype.controls.appendChild(duration);
				duration.innerHTML = "0:00";
				this.duration = duration;
			},

			addVol: function(){
				var vol = this.Input.create("range");
				vol.id ="volume"+this.i;
				vol.setAttribute("data-id",this.i);
				vol.type = "range";
				vol.min = 0;
				vol.max = 100;
				vol.value = 100;
				vol.step = 1;
				vol.style.width = "50px";
				vol.addEventListener("change",Player.prototype.Events.vol_change);
				Player.prototype.controls.appendChild(vol);
				this.vol = vol;
			},
			
			addFull: function(){
			
				var full = this.Button.create();
				full.id = "full"+this.i;
				full.setAttribute("data-id",this.i);
				full.innerHTML = "[  ]";
				Player.prototype.controls.appendChild(full);
				full.addEventListener("click",Player.prototype.Events.full_click);
				this.full = full;
			},


			/**
				All Elements/Objects that MenuObj uses
			*/
			Button: {
				
				create: function(){

					var button = document.createElement("button");
					return button;
				}
			},
			
			Input: {
				
				create: function(Itype){
					var input = document.createElement("input");
					input.type = Itype;
					
					return input;
				}
			},
			
			Span: {
			
				create: function(){
					var span = document.createElement("span");
					return span;
				}
			}

			
		}
			
}

		
Players = {
		
		getPlayer: [],
		
		
		init: function(){
			
			var n = this.findAllPlayers();

			for(var i=0; i<n.length; i++){

				this.getPlayer[i] = new Player(n[i], i).init();
				
			}

		},

		
		findAllPlayers: function(){
			
			var n = Element.byClass("player");
			
			return n;
		}
}



/**
object with functions for getting elements 
*/
var Element = {
	byClass: function(className){
		return document.getElementsByClassName(className);
	},
	
	byId: function(id){
		return document.getElementById(id);
	},
	
	byTag: function(tag){
		return document.getElementsByTagName(tag);
	}
}

/**
	Function that specifies what will happen when page is loaded
*/
function onloadFunction(){
	
	Players.init();
}