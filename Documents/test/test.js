window.onload = onloadFunction;


var Player = {
		
		players: null,
		
		videoEvents: [	"click",
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
		
		init: function(){
		
			this.players = this.findAllPlayers();

			for(var i=0; i<this.players.length; i++){
			
			/**
				Creating video element
			*/
				var Video = this.VideoObj.create("test",i);
				this.players[i].appendChild(Video);
				
			/**
				Creating controls div (array specifies what elements will div contain)
				This is array when every element is called:
					arr = ["Toggle","Slider","Current","Duration","Vol","Full"];
			*/
				var arr = ["Toggle","Slider","Current","Duration","Vol","Full"];
				var controls = this.ControlsObj.create(i,arr);
				this.players[i].appendChild(controls);
			
			/**
				Assigning EventListeners to video element
			*/
				this.assignListeners(Video,this.videoEvents);

			}
		},
		
	/**
		Assigning event listeners to element
	*/
		assignListeners: function(element,eventArr){
		
			for(var j in eventArr){
				element.addEventListener(eventArr[j], Player.Events.callEvent);
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
				Player.Events["video_"+e.type].call(this, e);
			}catch(err){
				//console.error(e.type);
			}

		},

		/**
			What happens when double click occurs
		*/
		video_dblclick : function(e){

				if (this.mozRequestFullScreen) {
					  this.mozRequestFullScreen();
					} else if (this.webkitRequestFullScreen) {
					  this.webkitRequestFullScreen();
				   }
		},
		
		/**
			What happens when click occurs
		*/
		
		//for video
		video_click : function(e){

			var toggle = Element.byId("toggle"+this.getAttribute("data-id"));
		
				if(this.paused){
					this.play();
					toggle.innerHTML = "pause";
				}else{
					this.pause();
					toggle.innerHTML = "play";
				}
		},
		
		//for toggle button	
		toggle_click: function(e){

			var vid = Element.byId("video"+this.getAttribute("data-id"));
				if (vid.paused){ 
					vid.play(); 
					this.innerHTML = "pause";
				}else{ 
					vid.pause(); 
					this.innerHTML = "play";
				}
			
		},
		
		//for full screen button	
		full_click : function(e){
			
			var vid = this.parentNode.parentNode.children[0];
				if (vid.mozRequestFullScreen) {
					vid.mozRequestFullScreen();
				} else if (vid.webkitRequestFullScreen) {
					vid.webkitRequestFullScreen();
			}
		},
		/**
			What happens when change event occurs
		*/
		range_change : function(e){
		
				var vid = Element.byId("video"+this.getAttribute("data-id"));
				var seekto = vid.duration * (this.value/100);
				vid.currentTime = seekto;
		},
		
		vol_change: function(e){

			this.parentNode.parentNode.children[0].volume = this.value/100;	
		},
		
		/**
			What happens when time update occurs
		*/
		video_timeupdate : function(e){
		
			var i = this.getAttribute("data-id");
			var time = this.currentTime * (100/this.duration);
			Element.byId("slider"+i).value = time;
			
			var curTime = Element.byId("current"+i);
			var durTime = Element.byId("duration"+i);
				
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
	
	/**
		Finds all divs where class = player
	*/
	findAllPlayers: function(){
		
			var n = Element.byClass("player");
			
			for(var i=0; i<n.length; i++){
				var players = n[i];
			}
			return n;
	},
	

/**
Objects for all elements of player
*/

	VideoObj: {

		create: function(name,i){
			
			var video = document.createElement("video");
			video.width = 500;
			video.height = 210;
			video.setAttribute("data-id",i);
			video.id = "video"+i;
					
			var source1 = document.createElement("source");
			source1.src = name+".mp4";
			source1.type = "video/mp4";
			video.appendChild(source1);
					
			var source2 = document.createElement("source");
			source2.src = name+".ogg";
			source2.type = "video/ogg";
			video.appendChild(source2);
					
			return video;
		}
	},	

	/**
		Div with all controls for video
	*/
	ControlsObj: {
	
		i: null,
		toggle: null,
		slider: null,
		current: null,
		duration: null,
		vol: null,
		full: null,
		controls: null,

		/**
			Method that creates div
		*/
		create: function(i,arr){
			
			this.i = i;
			
			var controls = document.createElement("div");
			this.controls = controls;
			controls.id = "controls-"+this.i;
			controls.setAttribute("style","background-color: #ccc; width: 500px;");
			
			for(var j=0; j<arr.length; j++){
				Player.ControlsObj["add"+arr[j]].call(this);
			}
			
			return controls;
		},		
		
		
		addToggle: function(){
			
			var toggle = this.ButtonObj.create();
			toggle.id = "toggle"+this.i;
			toggle.style.align = "left";
			toggle.setAttribute("data-id",this.i);
			this.controls.appendChild(toggle);
			toggle.innerHTML = "play";
			toggle.addEventListener("click",Player.Events.toggle_click);
			this.toggle = toggle;
		},
		
		addSlider: function(){
				
			var slider = this.InputObj.create("range");
			slider.id ="slider"+this.i;
			slider.min = 0;
			slider.max = 100;
			slider.style.width = "150px";
			slider.value = 0;
			slider.step = 1;
			slider.setAttribute("style","color: black");
			slider.setAttribute("data-id",this.i);
			slider.addEventListener("change",Player.Events.range_change);
			slider.addEventListener("timeupdate",Player.Events.video_timeupdate);
			this.controls.appendChild(slider);
			this.slider = slider;
			
		},

		addCurrent: function(){
			
			current = this.SpanObj.create();
			current.id = "current"+this.i;
			current.setAttribute("data-id",this.i);
			this.controls.appendChild(current);
			current.innerHTML = "0:00  -  ";
			this.current = current;
		},
			
		addDuration: function(){
			
			var duration = this.SpanObj.create();
			duration.id ="duration"+this.i;
			duration.setAttribute("data-id",this.i);
			this.controls.appendChild(duration);
			duration.innerHTML = "0:00";
			this.duration = duration;
		},

		addVol: function(){
			
			var vol = this.InputObj.create("range");
			vol.id ="volume"+this.i;
			vol.type = "range";
			vol.min = 0;
			vol.max = 100;
			vol.value = 100;
			vol.step = 1;
			vol.setAttribute("data-id",this.i);
			vol.style.width = "50px";
			vol.addEventListener("change",Player.Events.vol_change);
			this.controls.appendChild(vol);
			this.vol = vol;
		},
		
		addFull: function(){
		
			var full = this.ButtonObj.create();
			full.id = "full"+this.i;
			full.innerHTML = "[  ]";
			this.controls.appendChild(full);
			full.addEventListener("click",Player.Events.full_click);
			this.full = full;
		},


		/**
			All Elements/Objects that MenuObj uses
		*/
		
		ButtonObj: {
			
			create: function(){

				var button = document.createElement("button");
				return button;
			}
		},
		
		InputObj: {
			
			create: function(Itype){
				var input = document.createElement("input");
				input.type = Itype;
				
				return input;
			}
		},
		
		SpanObj: {
		
			create: function(){
				var span = document.createElement("span");
				return span;
			}
		}
		
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
	
	Player.init();
}