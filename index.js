var M_WIDTH=800, M_HEIGHT=450,SERV_TM_DELTA=0;
var app ={stage:{},renderer:{}},assets={},serv_tm, objects={}, state='',game_tick=0, game_id=0, connected = 1, h_state=0, game_platform='',hidden_state_start = 0,fbs,room_name = '', pending_player='', opponent = {}, my_data={opp_id : ''},client_id, opp_data={}, some_process = {}, git_src = '', WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2, MY_TURN = 1, OPP_TURN = 2, turn = 0,game_name='durak';
const MAX_NO_AUTH_RATING=1950;
const MAX_NO_REP_RATING=1900;
const MAX_NO_CONF_RATING=1950;

cards_styles={

	0:{
		symbols_asset:'cards_symbols0',
		shirt_asset:'cards_shirt0',
		bcg_asset:{h:'cards_bcg0',d:'cards_bcg0',s:'cards_bcg0',c:'cards_bcg0'},
		tint:{h:0xff0000,d:0xff0000,s:0x000000,c:0x000000},
		black_suits_tint:0x000000,
		red_suits_tint:0xff0000,
		elems_data:[
			{x:0,y:-22,size:70,alpha:0.7,visible:true,type:'val'},
			{x:0,y:27,size:70,alpha:0.7,visible:true,type:'suit'},
			{x:10,y:20,size:10,alpha:0.7,visible:false,type:'val'}
		]
	},
	1:{
		symbols_asset:'cards_symbols0',
		shirt_asset:'cards_shirt1',
		bcg_asset:{h:'cards_bcg0',d:'cards_bcg0',s:'cards_bcg0',c:'cards_bcg0'},
		tint:{h:0xff0000,d:0xff0000,s:0x000000,c:0x000000},
		elems_data:[
			{x:0,y:-22,size:70,alpha:0.7,visible:true,type:'val'},
			{x:0,y:27,size:70,alpha:0.7,visible:true,type:'suit'},
			{x:10,y:20,size:10,alpha:0.7,visible:false,type:'val'}
		]
	},
	2:{
		symbols_asset:'cards_symbols0',
		shirt_asset:'cards_shirt2',
		bcg_asset:{h:'cards_bcg2',d:'cards_bcg2',s:'cards_bcg2',c:'cards_bcg2'},
		tint:{h:0xff0000,d:0xff0000,s:0x000000,c:0x000000},
		elems_data:[
			{x:0,y:-22,size:70,alpha:0.7,visible:true,type:'val'},
			{x:0,y:27,size:70,alpha:0.7,visible:true,type:'suit'},
			{x:10,y:20,size:10,alpha:0.7,visible:false,type:'val'}
		]
	},
	3:{
		symbols_asset:'cards_symbols0',
		shirt_asset:'cards_shirt3',
		bcg_asset:{h:'cards_bcg2',d:'cards_bcg2',s:'cards_bcg2',c:'cards_bcg2'},
		tint:{h:0xff0000,d:0xff0000,s:0x000000,c:0x000000},
		elems_data:[
			{x:0,y:-22,size:70,alpha:0.7,visible:true,type:'val'},
			{x:0,y:27,size:70,alpha:0.7,visible:true,type:'suit'},
			{x:10,y:20,size:10,alpha:0.7,visible:false,type:'val'}
		]
	},
	4:{
		symbols_asset:'cards_symbols0',
		shirt_asset:'cards_shirt4',
		bcg_asset:{h:'cards_bcg2',d:'cards_bcg2',s:'cards_bcg2',c:'cards_bcg2'},
		tint:{h:0xff0000,d:0xff0000,s:0x000000,c:0x000000},
		elems_data:[
			{x:0,y:-22,size:70,alpha:0.7,visible:true,type:'val'},
			{x:0,y:27,size:70,alpha:0.7,visible:true,type:'suit'},
			{x:10,y:20,size:10,alpha:0.7,visible:false,type:'val'}
		]
	},
	5:{
		//спорт
		symbols_asset:'cards_symbols0',
		shirt_asset:'cards_shirt5',
		bcg_asset:{h:'cards_bcg5_2',d:'cards_bcg5_2',s:'cards_bcg5_1',c:'cards_bcg5_1'},
		tint:{h:0xF2F2F2,d:0xF2F2F2,s:0x000000,c:0x000000},
		elems_data:[
			{x:-21,y:36,size:41,alpha:0.6,visible:true,type:'val'},
			{x:4,y:-25,size:75,alpha:0.6,visible:true,type:'suit'},
			{x:10,y:20,size:10,alpha:0.7,visible:false,type:'val'}
		]

	},
	6:{
		//неон
		symbols_asset:'cards_symbols4',
		shirt_asset:'cards_shirt6',
		bcg_asset:{h:'cards_bcg6_2',d:'cards_bcg6_2',s:'cards_bcg6_1',c:'cards_bcg6_1'},
		tint:{h:0xFFC000,d:0xFFC000,s:0xBDD7EE,c:0xBDD7EE},
		elems_data:[
			{x:-13,y:30,size:60,alpha:0.8,visible:true,type:'val'},
			{x:5,y:-23,size:72,alpha:0.8,visible:true,type:'suit'},
			{x:22,y:37,size:37.8,alpha:1,visible:false,type:'val'}
		]
	},
	7:{
		//4 цвета
		symbols_asset:'cards_symbols1',
		shirt_asset:'cards_shirt7',
		bcg_asset:{h:'cards_bcg7',d:'cards_bcg7',s:'cards_bcg7',c:'cards_bcg7'},
		tint:{h:0xFFFFFF,d:0xFFFF00,s:0xF2AA84,c:0x61CBF4},
		elems_data:[
			{x:-18,y:-35,size:40,alpha:0.9,visible:true,type:'val'},
			{x:0,y:0,size:55,alpha:0.9,visible:true,type:'suit'},
			{x:18,y:37,size:40,alpha:0.9,visible:true,type:'val'}
		]
	},
	8:{
		//земля космос
		symbols_asset:'cards_symbols2',
		shirt_asset:'cards_shirt8',
		bcg_asset:{h:'cards_bcg8_1',d:'cards_bcg8_1',s:'cards_bcg8_2',c:'cards_bcg8_2'},
		tint:{h:0xffbbbb,d:0xffbbbb,s:0xbbbbff,c:0xbbbbff},
		elems_data:[
			{x:-15,y:-30,size:50,alpha:1,visible:true,type:'val'},
			{x:5,y:20,size:67,alpha:1,visible:true,type:'suit'},
			{x:22,y:37,size:37.8,alpha:1,visible:false,type:'val'}
		]
	},
	9:{
		symbols_asset:'cards_symbols3',
		shirt_asset:'cards_shirt9',
		bcg_asset:{h:'cards_bcg9_1',d:'cards_bcg9_1',s:'cards_bcg9_2',c:'cards_bcg9_2'},
		tint:{h:0xffffff,d:0xffffff,s:0xffffff,c:0xffffff},
		elems_data:[
			{x:-22,y:-37,size:37.8,alpha:1,visible:true,type:'val'},
			{x:0,y:0,size:67,alpha:1,visible:true,type:'suit'},
			{x:22,y:37,size:37.8,alpha:1,visible:true,type:'val'}
		]
	},

}

fbs_once=async function(path){
	let info=await fbs.ref(path).get();
	return info.val();
}

irnd = function(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = 'single';
		this.x=x;
		this.y=y;


		this.bcg=new PIXI.Sprite(assets.mini_player_card);
		this.bcg.width=200;
		this.bcg.height=90;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};

		this.table_rating_hl=new PIXI.Sprite(assets.table_rating_hl);
		this.table_rating_hl.width=200;
		this.table_rating_hl.height=90;

		this.avatar=new PIXI.Graphics();
		this.avatar.x=16;
		this.avatar.y=16;
		this.avatar.w=this.avatar.h=58.2;

		this.avatar_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.x=16-11.64;
		this.avatar_frame.y=16-11.64;
		this.avatar_frame.width=this.avatar_frame.height=81.48;

		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 23,align: 'center'});
		this.name_text.anchor.set(1,0);
		this.name_text.x=180;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(1,0.5);
		this.rating_text.x=180;
		this.rating_text.y=60;
		this.rating_text.tint=0xffff00;

		//аватар первого игрока
		this.avatar1=new PIXI.Graphics();
		this.avatar1.x=19;
		this.avatar1.y=16;
		this.avatar1.w=this.avatar1.h=58.2;

		this.avatar1_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar1_frame.x=this.avatar1.x-11.64;
		this.avatar1_frame.y=this.avatar1.y-11.64;
		this.avatar1_frame.width=this.avatar1_frame.height=81.48;



		//аватар второго игрока
		this.avatar2=new PIXI.Graphics();
		this.avatar2.x=121;
		this.avatar2.y=16;
		this.avatar2.w=this.avatar2.h=58.2;

		this.avatar2_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar2_frame.x=this.avatar2.x-11.64;
		this.avatar2_frame.y=this.avatar2.y-11.64;
		this.avatar2_frame.width=this.avatar2_frame.height=81.48;


		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=48.1;
		this.rating_text1.y=56;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150.1;
		this.rating_text2.y=56;

		this.t_country=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.t_country.tint=0xffff00;
		this.t_country.anchor.set(1,0.5);
		this.t_country.x=100;
		this.t_country.y=60;
		this.t_country.tint=0xaaaa99;

		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar,this.avatar_frame,this.avatar1, this.avatar1_frame, this.avatar2,this.avatar2_frame,this.rating_text,this.table_rating_hl,this.rating_text1,this.rating_text2, this.name_text,this.t_country);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(assets.lb_player_card_bcg)
		this.bcg.interactive=true
		this.bcg.pointerover=function(){this.tint=0x55ffff}
		this.bcg.pointerout=function(){this.tint=0xffffff}
		this.bcg.width = 370
		this.bcg.height = 70

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'})
		this.place.tint=0xffffff
		this.place.x=20
		this.place.y=22

		this.avatar=new PIXI.Graphics()
		this.avatar.x=43
		this.avatar.y=13
		this.avatar.w=this.avatar.h=44
		this.avatar.width=this.avatar.height=44

		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'})
		this.name.tint=0xcceeff
		this.name.x=105
		this.name.y=22

		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'})
		this.rating.x=298
		this.rating.tint=0xFFFF00
		this.rating.y=22

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating)
	}


}

class playing_cards_class extends PIXI.Container {

	constructor(id) {

		super();
		this.id=id;
		this.value = Math.floor(id%9);
		this.visible = false;

		this.trump_hl = new PIXI.Sprite(assets.trump_hl);
		this.trump_hl.visible = false;
		this.trump_hl.anchor.set(0.5,0.5);


		this.bcg = new PIXI.Sprite(assets.cards_bcg0);
		this.bcg.anchor.set(0.5,0.5);
		this.interactive = true;
		this.buttonMode = true;
		this.pointerdown = function(){table.card_down(this)};


		//значение карты
		this.suit = ['h','d','s','c','h','h','h','h'][Math.floor(id/9)];
		this.val = ['6','7','8','9','10','J','Q','K','T'][id%9];

		//элементы фронта
		this.elem=[];
		for (let i=0;i<3;i++){
			this.elem[i]=new PIXI.Sprite();
			this.elem[i].anchor.set(0.5,0.5);
		}

		//this.scale_xy=0.3;
		this.addChild( this.bcg, this.trump_hl, ...this.elem);
	}

	set(suit, value) {
		this.suit = suit;
		this.val=value.toString();
	}

	set_shirt (style_id) {
		const style=style_id === 0 ? cards_styles[0] : cards_styles[style_id || my_data.cards_style_id];
		this.elem.forEach(e=>e.visible=false);
		this.bcg.texture = assets[style.shirt_asset||'cards_bcg0'];
	}

	unshirt (style_id) {

		const style=style_id === 0 ? cards_styles[0] : cards_styles[style_id || my_data.cards_style_id];
		for (let i=0;i<3;i++){
			const e=this.elem[i];
			const e_data=style.elems_data[i];
			e.visible=e_data.visible;
			e.alpha=e_data.alpha;
			e.x=e_data.x;
			e.y=e_data.y;
			e.angle=e_data.angle||0;
			e.width=e.height=e_data.size;
			if (e_data.type==='val')
				e.texture=assets[style.symbols_asset][this.val]
			else
				e.texture=assets[style.symbols_asset][this.suit]
		}

		const tint=style.tint[this.suit];
		this.elem.forEach(e=>e.tint=tint);
		this.bcg.texture = assets[style.bcg_asset[this.suit]];
	}


}

class chat_record_class extends PIXI.Container {

	constructor() {

		super();

		this.tm=0;
		this.uid='';



		this.avatar = new PIXI.Graphics();
		this.avatar.w=50;
		this.avatar.h=50;
		this.avatar.x=30;
		this.avatar.y=13;

		this.avatar_bcg = new PIXI.Sprite(assets.chat_avatar_bcg_img);
		this.avatar_bcg.width=70;
		this.avatar_bcg.height=70;
		this.avatar_bcg.x=this.avatar.x-10;
		this.avatar_bcg.y=this.avatar.y-10;
		this.avatar_bcg.interactive=true;
		this.avatar_bcg.pointerdown=()=>chat.avatar_down(this);

		this.avatar_frame = new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.width=70;
		this.avatar_frame.height=70;
		this.avatar_frame.x=this.avatar.x-10;
		this.avatar_frame.y=this.avatar.y-10;

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 17});
		this.name.anchor.set(0,0.5);
		this.name.x=this.avatar.x+72;
		this.name.y=this.avatar.y-1;
		this.name.tint=0xFBE5D6;

		this.gif=new PIXI.Sprite();
		this.gif.x=this.avatar.x+65;
		this.gif.y=22;

		this.gif_bcg=new PIXI.Graphics();
		this.gif_bcg.beginFill(0x111111)
		this.gif_bcg.drawRect(0,0,1,1);
		this.gif_bcg.x=this.gif.x+3;
		this.gif_bcg.y=this.gif.y+3;
		this.gif_bcg.alpha=0.5;



		this.msg_bcg = new PIXI.NineSlicePlane(assets.msg_bcg,50,18,50,28);
		//this.msg_bcg.width=160;
		//this.msg_bcg.height=65;
		this.msg_bcg.scale_xy=0.66666;
		this.msg_bcg.x=this.avatar.x+45;
		this.msg_bcg.y=this.avatar.y+2;

		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: 19,lineSpacing:55,align: 'left'});
		this.msg.x=this.avatar.x+75;
		this.msg.y=this.avatar.y+30;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0xffffff;

		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont',fontSize: 15});
		this.msg_tm.tint=0x999999;
		this.msg_tm.anchor.set(1,0);

		this.visible = false;
		this.addChild(this.msg_bcg,this.gif_bcg,this.gif,this.avatar_bcg,this.avatar,this.avatar_frame,this.name,this.msg,this.msg_tm);

	}

	nameToColor(name) {
		  // Create a hash from the name
		  let hash = 0;
		  for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
			hash = hash & hash; // Convert to 32bit integer
		  }

		  // Generate a color from the hash
		  let color = ((hash >> 24) & 0xFF).toString(16) +
					  ((hash >> 16) & 0xFF).toString(16) +
					  ((hash >> 8) & 0xFF).toString(16) +
					  (hash & 0xFF).toString(16);

		  // Ensure the color is 6 characters long
		  color = ('000000' + color).slice(-6);

		  // Convert the hex color to an RGB value
		  let r = parseInt(color.slice(0, 2), 16);
		  let g = parseInt(color.slice(2, 4), 16);
		  let b = parseInt(color.slice(4, 6), 16);

		  // Ensure the color is bright enough for a black background
		  // by normalizing the brightness.
		  if ((r * 0.299 + g * 0.587 + b * 0.114) < 128) {
			r = Math.min(r + 128, 255);
			g = Math.min(g + 128, 255);
			b = Math.min(b + 128, 255);
		  }

		  return (r << 16) + (g << 8) + b;
	}

	async update_avatar(uid, tar_sprite) {

		//определяем pic_url
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		tar_sprite.set_texture(players_cache.players[uid].texture);
	}

	async set(msg_data) {

		//получаем pic_url из фб
		this.avatar.set_texture(PIXI.Texture.WHITE);

		if (msg_data.uid==='admin'){
			this.msg_bcg.tint=0x55ff55;
			this.avatar.set_texture(assets.pc_icon);
		}else{
			this.msg_bcg.tint=0xffffff;
			await this.update_avatar(msg_data.uid, this.avatar);
		}

		this.uid=msg_data.uid;
		this.tm = msg_data.tm;


		this.name.set2(msg_data.name,150);
		this.name.tint=this.nameToColor(msg_data.name);
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		this.msg.text=msg_data.msg;
		this.visible = true;

		if (msg_data.msg.startsWith('GIF')){

			const mp4BaseT=await new Promise((resolve, reject)=>{
				const url='https://akukamil.github.io/common/gifs/'+msg_data.msg+'.mp4';
				if(PIXI.utils.BaseTextureCache[url]&&!PIXI.utils.BaseTextureCache[url].valid) resolve(0);
				const baseTexture = PIXI.BaseTexture.from(url);
				if (baseTexture.width>1) resolve(baseTexture);
				baseTexture.on('loaded', () => resolve(baseTexture));
				baseTexture.on('error', (error) => resolve(null));
			});

			if (!mp4BaseT) {
				this.visible=false;
				return 0;
			}

			mp4BaseT.resource.source.play();
			mp4BaseT.resource.source.loop=true;

			this.gif.texture=PIXI.Texture.from(mp4BaseT);
			this.gif.visible=true;
			const aspect_ratio=mp4BaseT.width/mp4BaseT.height;
			this.gif.height=90;
			this.gif.width=this.gif.height*aspect_ratio;
			this.msg_bcg.visible=false;
			this.msg.visible=false;
			this.msg_tm.anchor.set(0,0);
			this.msg_tm.y=this.gif.height+9;
			this.msg_tm.x=this.gif.width+102;

			this.gif_bcg.visible=true;
			this.gif_bcg.height=this.gif.height;
			this.gif_bcg.width=	this.gif.width;
			return this.gif.height+30;

		}else{

			this.gif_bcg.visible=false;
			this.gif.visible=false;
			this.msg_bcg.visible=true;
			this.msg.visible=true;

			//бэкграунд сообщения в зависимости от длины
			const msg_bcg_width=Math.max(this.msg.width,100)+100;
			this.msg_bcg.width=msg_bcg_width*1.5;

			if (msg_bcg_width>300){
				this.msg_tm.anchor.set(1,0);
				this.msg_tm.y=this.avatar.y+52;
				this.msg_tm.x=msg_bcg_width+55;
			}else{
				this.msg_tm.anchor.set(0,0);
				this.msg_tm.y=this.avatar.y+37;
				this.msg_tm.x=msg_bcg_width+62;
			}

			return 70;
		}
	}

}

class feedback_record_class extends PIXI.Container {

	constructor() {

		super();
		this.text=new PIXI.BitmapText('Николай: хорошая игра', {fontName: 'mfont',fontSize: 23,align: 'left',lineSpacing:42});
		this.text.maxWidth=290;
		this.text.tint=0xFFFF00;

		this.name_text=new PIXI.BitmapText('Николай:', {fontName: 'mfont',fontSize: 23,align: 'left'});
		this.name_text.tint=0xFFFFFF;


		this.addChild(this.text,this.name_text)
	}

	set(name, feedback_text){
		this.text.text=name+': '+feedback_text;
		this.name_text.text=name+':';

	}


}

chat={

	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	drag_chat:false,
	drag_sx:0,
	drag_sy:-999,
	recent_msg:[],
	moderation_mode:0,
	block_next_click:0,
	kill_next_click:0,
	delete_message_mode:0,
	games_to_chat:200,
	payments:0,
	processing:0,

	activate() {

		anim2.add(objects.chat_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		objects.bcg.texture=assets.bcg;
		objects.chat_enter_button.visible=my_data.games>=this.games_to_chat;

		if(my_data.blocked)
			objects.chat_enter_button.texture=assets.chat_blocked_img;
		else
			objects.chat_enter_button.texture=assets.chat_enter_img;

		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		if(my_data.blocked) objects.chat_rules.text='Вы не можете писать в чат, так как вы находитесь в черном списке';

		//вопроизводитим гифки
		objects.chat_records.forEach(r=>{
			if(r.visible&&r.gif.texture.baseTexture.resource&&r.gif.visible)
				r.gif.texture.baseTexture.resource.source.play();
		})
	},

	async init(){

		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;
		objects.bcg.interactive=true;
		objects.bcg.pointermove=this.pointer_move.bind(this);
		objects.bcg.pointerdown=this.pointer_down.bind(this);
		objects.bcg.pointerup=this.pointer_up.bind(this);
		objects.bcg.pointerupoutside=this.pointer_up.bind(this);

		for(let rec of objects.chat_records) {
			rec.visible = false;
			rec.msg_id = -1;
			rec.tm=0;
		}

		this.init_yandex_payments();

		await my_ws.init();

		//загружаем чат
		const chat_data=await my_ws.get('chat',25);

		await this.chat_load(chat_data);

		//подписываемся на новые сообщения
		my_ws.ss_child_added('chat',chat.chat_updated.bind(chat))

		console.log('Чат загружен!')
	},

	init_yandex_payments(){

		if (game_platform!=='YANDEX') return;

		if(this.payments) return;

		ysdk.getPayments({ signed: true }).then(_payments => {
			chat.payments = _payments;
		}).catch(err => {})

	},

	fix_name(uid){

		fbs.ref('players/'+uid+'/name').set(auth.get_random_name(uid));
		fbs.ref('players/'+uid+'/nick_tm').set(2728556930444);

	},

	get_oldest_index () {

		let oldest = {tm:9671801786406 ,visible:true};
		for(let rec of objects.chat_records)
			if (rec.tm < oldest.tm)
				oldest = rec;
		return oldest.index;

	},

	get_oldest_or_free_msg () {

		//проверяем пустые записи чата
		for(let rec of objects.chat_records)
			if (!rec.visible)
				return rec;

		//если пустых нет то выбираем самое старое
		let oldest = {tm:9671801786406};
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;
		return oldest;

	},

	async block_player(uid){

		fbs.ref('blocked/'+uid).set(Date.now());
		fbs.ref('inbox/'+uid).set({message:'CHAT_BLOCK',tm:Date.now()});
		const name=await fbs_once(`players/${uid}/name`);
		const msg=`Игрок ${name} занесен в черный список.`;
		my_ws.socket.send(JSON.stringify({cmd:'push',path:'chat',val:{uid:'admin',name:'Админ',msg,tm:'TMS'}}));

		//увеличиваем количество блокировок
		fbs.ref('players/'+uid+'/block_num').transaction(val=> {return (val || 0) + 1});

	},

	async chat_load(data) {

		if (data === null) return;

		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);

		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});

		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c,true);

	},

	async chat_updated(data, first_load) {

		//console.log('receive message',data)
		if(data===undefined||!data.msg||!data.name||!data.uid) return;

		//ждем пока процессинг пройдет
		for (let i=0;i<10;i++){
			if (this.processing)
				await new Promise(resolve => setTimeout(resolve, 250));
			else
				break;
		}
		if (this.processing) return;

		this.processing=1;

		//выбираем номер сообщения
		const new_rec=this.get_oldest_or_free_msg();
		const y_shift=await new_rec.set(data);
		new_rec.y=this.last_record_end;

		this.last_record_end += y_shift;

		if (!first_load)
			lobby.inst_message(data);

		//смещаем на одно сообщение (если чат не видим то без твина)
		if (objects.chat_cont.visible)
			await anim2.add(objects.chat_msg_cont,{y:[objects.chat_msg_cont.y,objects.chat_msg_cont.y-y_shift]},true, 0.05,'linear');
		else
			objects.chat_msg_cont.y-=y_shift

		this.processing=0;

	},

	avatar_down(player_data){

		if (player_data.uid==='admin')
			return;

		if (this.moderation_mode){
			console.log(player_data.index,player_data.uid,player_data.name.text,player_data.msg.text);
			fbs_once('players/'+player_data.uid+'/games').then((data)=>{
				console.log('сыграно игр: ',data)
			})
		}

		if (this.block_next_click){
			this.block_player(player_data.uid);
			console.log('Игрок заблокирован: ',player_data.uid);
			this.block_next_click=0;
		}

		if (this.kill_next_click){
			fbs.ref('inbox/'+player_data.uid).set({message:'CLIEND_ID',tm:Date.now(),client_id:999999});
			console.log('Игрок убит: ',player_data.uid);
			this.kill_next_click=0;
		}

		if(this.delete_message_mode){
			fbs.ref(`${chat_path}/${player_data.index}`).remove();
			console.log(`сообщение ${player_data.index} удалено`)
		}


		if(this.moderation_mode||this.block_next_click||this.kill_next_click||this.delete_message_mode) return;

		if (objects.chat_keyboard_cont.visible)
			keyboard.response_message(player_data.uid,player_data.name.text);
		else
			lobby.show_invite_dlg_from_chat(player_data.uid);


	},

	get_abs_top_bottom(){

		let top_y=999999;
		let bot_y=-999999
		for(let rec of objects.chat_records){
			if (rec.visible===true){
				const cur_abs_top=objects.chat_msg_cont.y+rec.y;
				const cur_abs_bot=objects.chat_msg_cont.y+rec.y+rec.height;
				if (cur_abs_top<top_y) top_y=cur_abs_top;
				if (cur_abs_bot>bot_y) bot_y=cur_abs_bot;
			}
		}

		return [top_y,bot_y];

	},

	back_button_down(){

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		this.close();
		lobby.activate();

	},

	pointer_move(e){

		if (!this.drag_chat) return;
		const mx = e.data.global.x/app.stage.scale.x;
		const my = e.data.global.y/app.stage.scale.y;

		const dy=my-this.drag_sy;
		this.drag_sy=my;

		this.shift(dy);

	},

	pointer_down(e){

		const px=e.data.global.x/app.stage.scale.x;
		this.drag_sy=e.data.global.y/app.stage.scale.y;

		this.drag_chat=true;
		objects.chat_cont.by=objects.chat_cont.y;

	},

	pointer_up(){

		this.drag_chat=false;

	},

	shift(dy) {

		const [top_y,bot_y]=this.get_abs_top_bottom();

		//проверяем движение чата вверх
		if (dy<0){
			const new_bottom=bot_y+dy;
			const overlap=435-new_bottom;
			if (new_bottom<435) dy+=overlap;
		}

		//проверяем движение чата вниз
		if (dy>0){
			const new_top=top_y+dy;
			if (new_top>50)
				return;
		}

		objects.chat_msg_cont.y+=dy;

	},

	wheel_event(delta) {

		objects.chat_msg_cont.y-=delta*50;
		const chat_bottom = this.last_record_end;
		const chat_top = this.last_record_end - objects.chat_records.filter(obj => obj.visible === true).length*70;

		if (objects.chat_msg_cont.y+chat_bottom<430)
			objects.chat_msg_cont.y = 430-chat_bottom;

		if (objects.chat_msg_cont.y+chat_top>0)
			objects.chat_msg_cont.y=-chat_top;

	},

	async write_button_down(){

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};


		//оплата разблокировки чата
		if (my_data.blocked){

			let block_num=await fbs_once('players/'+my_data.uid+'/block_num');
			block_num=block_num||1;
			block_num=Math.min(6,block_num);

			if(game_platform==='YANDEX'){

				this.payments.purchase({ id: 'unblock'+block_num}).then(purchase => {
					this.unblock_chat(block_num);
				}).catch(err => {
					message.add('Ошибка при покупке!');
				})
			}

			if (game_platform==='VK') {

				vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: 'unblock'+block_num}).then(data =>{
					this.unblock_chat(block_num);
				}).catch((err) => {
					message.add('Ошибка при покупке!');
				});

			};

			return;
		}


		sound.play('click');

		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);

		if (this.recent_msg.length>3){
			message.add('Подождите 1 минуту')
			return;
		}

		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());

		//пишем сообщение в чат и отправляем его
		const msg = await keyboard.read(70);
		if (msg) {
			const index=irnd(1,999);
			my_ws.socket.send(JSON.stringify({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg,tm:'TMS'}}))
		}

	},

	unblock_chat(block_num){
		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		objects.chat_enter_button.texture=assets.chat_enter_img;
		fbs.ref('blocked/'+my_data.uid).remove();
		my_data.blocked=0;

		message.add('Вы разблокировали чат');
		sound.play('mini_dialog');

		//отправляем на сервер
		my_ws.safe_send({cmd:'log_inst',logger:'payments',data:{game_name,uid:my_data.uid,name:my_data.name,block_num}});


	},

	close() {

		anim2.add(objects.chat_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		if (objects.chat_keyboard_cont.visible)
			keyboard.close();
	}

}

dialog={

	vk_invite:0,
	vk_share:0,

	show(type){


		objects.dialog_no.pointerdown=function(){};
		objects.dialog_ok.pointerdown=function(){};

		if(type==='ad_break'){
			anim2.add(objects.dialog_cont,{alpha:[0, 1]},true,0.4,'linear');
			objects.dialog_card.texture=assets.ad_break_img;
			objects.dialog_no.visible=false;
			objects.dialog_ok.visible=false;
			setTimeout(function(){dialog.close()},3000);
			return new Promise(resolver=>{
				objects.dialog_card.resolver=resolver;
			})

		}

		if(type==='share'){
			this.vk_share=1;
			anim2.add(objects.dialog_cont,{alpha:[0, 1]},true,0.4,'linear');
			objects.dialog_card.texture=assets.share_img;
			objects.dialog_card.resolver=function(){};
			objects.dialog_no.visible=true;
			objects.dialog_ok.visible=true;

			objects.dialog_ok.pointerdown=function(){
				if(anim2.any_on())return;

				my_data.vk_share=Date.now();
				fbs.ref("players/"+my_data.uid+"/vk_share").set(my_data.vk_share);
				dialog.close();
				sound.play('click');
				vkBridge.send('VKWebAppShowWallPostBox', { message: 'Я играю в Дурака и мне нравится!',attachments: 'https://vk.com/app51395017_39099558'})
				objects.dialog_card.resolver();

			};
			objects.dialog_no.pointerdown=function(){
				if(anim2.any_on())return;
				objects.dialog_no.visible=false;
				objects.dialog_ok.visible=false;
				objects.dialog_card.texture=assets.thanks_img;
				dialog.close_delayed();
				sound.play('click');


			};
			return new Promise(resolver=>{
				objects.dialog_card.resolver=resolver;
			})
		}

		if(type==='invite_friends'){
			this.vk_invite=1;
			anim2.add(objects.dialog_cont,{alpha:[0, 1]},true,0.4,'linear');
			objects.dialog_card.texture=assets.invite_friends_img;
			objects.dialog_card.resolver=function(){};
			objects.dialog_no.visible=true;
			objects.dialog_ok.visible=true;

			objects.dialog_ok.pointerdown=function(){
				if(anim2.any_on())return;

				my_data.vk_invite=Date.now();
				fbs.ref("players/"+my_data.uid+"/vk_invite").set(my_data.vk_invite);
				dialog.close();
				sound.play('click');
				vkBridge.send('VKWebAppShowInviteBox');
				objects.dialog_card.resolver();

			};
			objects.dialog_no.pointerdown=function(){
				if(anim2.any_on())return;
				objects.dialog_no.visible=false;
				objects.dialog_ok.visible=false;
				objects.dialog_card.texture=assets.thanks_img;
				dialog.close_delayed();
				sound.play('click');

			};
			return new Promise(resolver=>{
				objects.dialog_card.resolver=resolver;
			})
		}


	},

	close(){
		if(objects.dialog_card.resolver && typeof objects.dialog_card.resolver === 'function')
			objects.dialog_card.resolver();
		anim2.add(objects.dialog_cont,{alpha:[1, 0]},false,0.3,'linear');

	},

	close_delayed(){

		setTimeout(function(){objects.dialog_card.resolver();dialog.close()},2000);

	}

}

class deck_class {

	constructor(type) {

		//массив карт
		this.cards = [];
		this.size = 0;
		this.type = type;

	}

	* get_random_num (seed) {

		let value = seed;
		while(true) {
			value = value * 16807 % 2147483647
			yield value;
		}

	}

	init_big (shuffle_seed) {

		let context = this;
		let generator = this.get_random_num(shuffle_seed);

		objects.pcards.forEach (c => {
			c.rnum = generator.next().value;
			c.trump_hl.visible = false;
			context.push(c);
		});

	}

	push (card) {

		//добавляем карту в колоду
		if (this.type === 'my' || this.type === 'opp')
			card.visible = true;

		if (this.type === 'opp')
			card.set_shirt();

		if (this.type === 'my')
			card.unshirt();

		this.cards.push(card);
		this.size++;
	}

	pop (card) {

		if (this.size === 0)
			alert('Колода пустая!!! 246')

		//если карта не указана возвращаем последнюю в колоде
		if (card === undefined) {
			this.size--;
			return this.cards.pop();
		}

		//получаем айди карты
		let card_id = card.id;

		//возвращаем ее по айди
		return this.pop_by_id(card_id);

	}

	pop_by_id (card_id) {

		if (this.size === 0)
			alert('Колода пустая!!! 265')

		//убираем карту из колоды и возвращаем ее

		let index = this.cards.findIndex(x => x.id === card_id);
		if (index === -1) {
			alert('Не нашли индекс в колоде!!!' + card_id)
			throw Error()
		}

		this.size--;
		return this.cards.splice(index, 1)[0];

	}

	include_card (card) {

		if (this.cards.find( c => c.id === card.id) === undefined)
			return false;

		return true;
	}

	include_value (value) {

		if (this.cards.find( c => c.value === value) === undefined)
			return false;

		return true;

	}

	make_empty () {

		this.cards = [];
		this.size = 0;

	}

	shuffle () {

		this.cards = this.cards.sort(function(a, b) {return a.rnum - b.rnum});

	}

	get_last_card () {


		if (this.size === 0)
			alert('get_last_card - нету карт!!!')

		return this.cards[this.size - 1];

	}

	get_last_card_pos_x () {


		if (this.size === 0)	return 340;
		return this.cards[this.size - 1].x;

	}

	get_first_card () {

		return this.cards[0];

	}

	organize () {

		if (this.size === 0) return;

		//положение карт по вертикали
		let tar_y = this.type === 'my' ? 400 : 50;

		let tar_card_width = 73.5;
		let interval = 73.5;

		if (this.size < 11) {
			tar_card_width = 73.5;
			interval = 68;
		}

		if (this.size >= 11 && this.size < 15) {
			tar_card_width = 65;
			interval = 53;
		}

		if (this.size >= 15 && this.size < 23) {
			tar_card_width = 45;
			interval = 35;
		}

		if (this.size >= 23) {
			tar_card_width = 35;
			interval = 28;
		}

		if (this.size >= 25) {
			tar_card_width = 35;
			interval = 22;
		}

		let tar_card_scale = tar_card_width / 105;

		this.cards.forEach(c=> c.scale_xy = tar_card_scale);

		//сортируем карты по возрастанию для удобства работы с ними
		this.cards.sort(function(a, b) {return a.id - b.id});

		//let card_width = this.cards[0].width * 0.8;
		let deck_width = tar_card_width * this.size;
		let deck_start = 0;

		if (this.size === 1) deck_start = 400;

		if (this.size > 1) {
			deck_width = interval * (this.size);
			deck_start = 400 - deck_width / 2 + tar_card_width / 2;
		}

		this.cards.forEach((c,i)=> {
			if (this.type === 'my' && c.suit === table.trump.suit)
				c.trump_hl.visible = true;
			c.y = tar_y;
			let tar_x = deck_start + i * interval;
			anim2.add(c,{x:[c.x, tar_x]}, true, 0.25,'easeInOutCubic');
		})

	}

}

confirm_dialog = {

	p_resolve : 0,

	show(msg) {

		if (objects.confirm_cont.visible === true) {
			sound.play('locked')
			return;
		}

		sound.play("confirm_dialog");

		objects.confirm_msg.text=msg;

		anim2.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');

		return new Promise(function(resolve, reject){
			confirm_dialog.p_resolve = resolve;
		});
	},

	button_down(res) {

		if (objects.confirm_cont.ready===false)
			return;

		sound.play('click')

		this.close();
		this.p_resolve(res);

	},

	close() {

		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450]}, false, 0.4,'easeInBack');

	}

}

anim2 = {

	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0, visible:false, ready:true, alpha:0},

	slot: Array(30).fill(null),


	any_on() {
		for (let s of this.slot)
			if (s !== null&&s.block)
				return true
		return false;
	},

	linear(x) {
		return x
	},

	kill_anim(obj) {

		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj){
					this.slot[i].p_resolve('finished');
					this.slot[i].obj.ready=true;
					this.slot[i]=null;
				}

	},

	flick(x){

		return Math.abs(Math.sin(x*6.5*3.141593));

	},

	easeBridge(x){

		if(x<0.1)
			return x*10;
		if(x>0.9)
			return (1-x)*10;
		return 1
	},

	ease3peaks(x){

		if (x < 0.16666) {
			return x / 0.16666;
		} else if (x < 0.33326) {
			return 1-(x - 0.16666) / 0.16666;
		} else if (x < 0.49986) {
			return (x - 0.3326) / 0.16666;
		} else if (x < 0.66646) {
			return 1-(x - 0.49986) / 0.16666;
		} else if (x < 0.83306) {
			return (x - 0.6649) / 0.16666;
		} else if (x >= 0.83306) {
			return 1-(x - 0.83306) / 0.16666;
		}
	},

	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},

	easeOutBack2(x) {
		return -5.875*Math.pow(x, 2)+6.875*x;
	},

	easeOutElastic(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},

	easeOutSine(x) {
		return Math.sin( x * Math.PI * 0.5);
	},

	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},

	easeInBack(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},

	easeInQuad(x) {
		return x * x;
	},

	easeOutBounce(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},

	easeInCubic(x) {
		return x * x * x;
	},

	ease2back(x) {
		return Math.sin(x*Math.PI);
	},

	easeInOutCubic(x) {

		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},

	shake(x) {

		return Math.sin(x*2 * Math.PI);

	},

	add (obj, params, vis_on_end, time, func, block=true) {

		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];
					obj[key]=params[key][0];
				}

				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back' || func === 'shake' || func === 'ease3peaks')
					for (let key in params)
						params[key][1]=params[key][0];

				this.slot[i] = {
					obj,
					block,
					params,
					vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}

		if (f===0) {
			console.log("Кончились слоты анимации");


			//сразу записываем конечные параметры анимации
			for (let key in params)
				obj[key]=params[key][1];
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;


			return new Promise(function(resolve, reject){
			  resolve();
			});
		}
		else {
			return new Promise(function(resolve, reject){
			  anim2.slot[i].p_resolve = resolve;
			});

		}




	},

	process() {

		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {

				let s=this.slot[i];

				s.progress+=s.speed;

				for (let key in s.params)
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);

				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)
						s.obj[key]=s.params[key][1];

					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;

					s.obj.ready=true;
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}
		}

	},

	async wait(time) {

		await this.add(this.empty_spr,{x:[0, 1]}, false, time,'linear');

	}
}

sound={

	on : 1,

	play(snd_res,is_loop) {

		if (!this.on||document.hidden)
			return;

		if (!assets[snd_res])
			return;

		assets[snd_res].play({loop:is_loop||false});

	},

	play_delayed (snd_res, delay) {

		if (!this.on||document.hidden)
			return;

		if (!assets[snd_res])
			return;

		setTimeout(function(){assets[snd_res].play()}, delay);


	},

	switch(){

		if (this.on){
			this.on=0;
			objects.pref_info.text='Звуки отключены';

		} else{
			this.on=1;
			objects.pref_info.text='Звуки включены';
		}
		anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);

	}

}

message={

	promise_resolve :0,

	async add(text, timeout=3000,sound_name='message') {

		if (this.promise_resolve!==0)
			this.promise_resolve("forced");


		//воспроизводим звук
		sound.play(sound_name);

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 0.25,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, timeout)
			}
		);

		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{x:[objects.message_cont.sx, -200]}, false, 0.25,'easeInBack');
	},

	clicked() {

		message.promise_resolve();

	}

}

big_msg={

	p_resolve : 0,

	show(params) {

		objects.big_msg_t1.text=params.t1||''
		objects.big_msg_t2.text=params.t2||''
		objects.big_msg_t3.text=params.t3||''

		objects.big_msg_fb_btn.visible = (!my_data.blocked)&&params.fb
		anim2.add(objects.big_msg_cont,{y:[-180,objects.big_msg_cont.sy]}, true, 0.6,'easeOutBack');
		
		this.show_bonus_anim(objects.big_msg_lights,params.lights_bonus||0)
		this.show_bonus_anim(objects.big_msg_crystals,params.crystals_bonus||0)

		return new Promise(function(resolve, reject){
			big_msg.p_resolve = resolve;
		});

	},
	
	show_bonus_anim(text_obj,tar_val){
		
		if (tar_val===0){
			text_obj.text=0			
			return
		}
		
		let lights=0
		const t=setInterval(()=>{
			lights++
			text_obj.text='+'+lights
			if (lights===tar_val)
				clearInterval(t)
		},100)	
		
	},

	async fb_btn_down() {

		if (objects.big_msg_cont.ready===false) {
			sound.play('locked');
			return;
		}

		anim2.add(objects.big_msg_cont,{y:[objects.big_msg_cont.sy,450]}, false, 0.4,'easeInBack');

		//пишем отзыв и отправляем его
		const fb = await keyboard.read();
		if (fb.length>0) {
			const fb_id = irnd(0,50);
			await firebase.database().ref('fb/'+opp_data.uid+'/'+fb_id).set([fb, firebase.database.ServerValue.TIMESTAMP, my_data.name]);

		}
		this.p_resolve('close');

	},

	async close() {

		if (anim2.any_on()){
			sound.play('locked')
			return;			
		}

		sound.play('click');
		await anim2.add(objects.big_msg_cont,{y:[objects.big_msg_cont.y,-300]}, false, 0.4,'easeInBack');
		this.p_resolve("close");
	}

}

mp_game={

	name : 'online',
	start_time : 0,
	disconnect_time : 0,
	move_time_left : 0,
	move_time_start:0,
	time_for_move:0,
	me_conf_play : 0,
	opp_conf_play : 0,
	timer_id : 0,
	timer_prv_time:0,
	made_moves: 0,
	my_role : '',
	write_fb_timer:0,
	stickers_button_pos:[0,0,0],
	chat_button_pos:[0,0,0],
	giveup_button_pos:[0,0,0],
	NO_RATING_GAME:0,
	no_rating_msg_timer:0,
	last_opponents:[],
	unique_opps:{},
	blind_game_flag:0,

	calc_new_rating(old_rating, game_result) {

		if (game_result === NOSYNC)	return old_rating;

		const Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		const Sa = (game_result + 1) / 2;
		return Math.round(my_data.rating + 16 * (Sa - Ea));

	},

	async activate (role, seed, blind) {

		this.my_role = role;

		opponent = this;

		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();

		//если открыт чат то закрываем его
		if (objects.chat_cont.visible===true)
			chat.close();
		
		//игра в слепую
		this.blind_game_flag=blind?1:0

		//инициируем стол
		table.init(role, seed)

		//показыаем карточки
		anim2.add(objects.my_card_cont,{x:[-100,objects.my_card_cont.sx]}, true, 0.6,'easeOutBack');
		
		
		//заполняем и показываем карточку соперника
		const player_data=players_cache.players[opp_data.uid]
		opp_data.rating=player_data.rating
		objects.opp_card_name.set2(player_data.name,160)
		objects.opp_card_rating.text=player_data.rating
		objects.opp_avatar.texture=player_data.texture		
		anim2.add(objects.opp_card_cont,{x:[900,objects.opp_card_cont.sx]}, true, 0.6,'easeOutBack')


		objects.game_buttons.visible = true;

		//сколько сделано ходов
		this.made_moves = 0;

		//пока еще никто не подтвердил игру
		this.me_conf_play = 0;
		this.opp_conf_play = 0;


		//счетчик времени таймер
		this.timer_prv_time=Date.now();
		this.timer_id = setTimeout(function(){mp_game.timer_tick()}, 1000);
		objects.timer_text.tint=0xffffff;
		objects.timer_cont.visible = true;
		this.reset_timer(role === 'master' ? MY_TURN : OPP_TURN, 12);

		//фиксируем врему начала игры для статистики
		this.start_time = Date.now();

		//сколько игрок играл с этим соперником
		const prv_plays=this.count_in_arr(this.last_opponents,opp_data.uid);
		this.NO_RATING_GAME=(prv_plays>6&&my_data.rating>MAX_NO_REP_RATING)?1:0;
		if (this.NO_RATING_GAME)
			this.no_rating_msg_timer=setTimeout(()=>{message.add('Выбирайте разных соперников для получения и подтверждения рейтинга')},5000);

		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		const lose_rating = this.blind_game_flag?my_data.rating-20:this.calc_new_rating(my_data.rating, LOSE)
		if (lose_rating >100 && lose_rating<9999)
			fbs.ref('players/'+my_data.uid+'/rating').set(lose_rating);

		//устанавливаем локальный и удаленный статус
		set_state({state:'p'});

		opponent = this;

	},

	send_move (data) {

		if (data.message !== 'TOSS')
			this.reset_timer(OPP_TURN);

		this.me_conf_play = 1;

		this.made_moves++;


		//отправляем ход онайлн сопернику (с таймаутом)
		clearTimeout(this.write_fb_timer);
		this.write_fb_timer=setTimeout(function(){mp_game.stop('my_no_connection');}, 8000);
		const write_start=Date.now();
		fbs.ref('inbox/'+opp_data.uid).set(data).then(()=>{
			clearTimeout(this.write_fb_timer);
		});

	},

	read_last_opps(){
		try {
			const stored = localStorage.getItem(game_name+'_lo');
			this.last_opponents=stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error('Error parsing opponents from localStorage:', error);
			this.last_opponents=[];
		}
	},

	update_last_opps(opp_id){

		//уникальные соперники
		this.unique_opps[opp_id]=1;

		this.last_opponents.push(opp_id);
        if (this.last_opponents.length > 20)
            this.last_opponents = this.last_opponents.slice(-20);
		localStorage.setItem(game_name+'_lo', JSON.stringify(this.last_opponents));

	},

	timer_tick () {

		//проверка таймера
		const cur_time=Date.now();
		if (cur_time-this.timer_prv_time>5000||cur_time<this.timer_prv_time){
			this.stop('timer_error');
			fbs.ref('TIMER_ERRORS').push({uid:my_data.uid,cur_time,start_time:this.start_time,prv_time:this.timer_prv_time,h:window.location.href})
			return;
		}
		this.timer_prv_time=cur_time;

		//определяем сколько времени прошло
		this.move_time_left=this.time_for_move-~~((Date.now()-this.move_time_start)*0.001);

		if (this.move_time_left < 0 && turn === MY_TURN)	{

			if (this.me_conf_play||this.blind_game_flag)
				this.stop('my_timeout');
			else
				this.stop('my_no_sync');

			return;
		}

		if (this.move_time_left < -5 && turn === OPP_TURN) {

			if (this.opp_conf_play === 1)
				this.stop('opp_timeout');
			else
				this.stop('opp_no_sync');
			return;
		}

		if (connected === 0 && turn === OPP_TURN) {
			this.disconnect_time ++;
			if (this.disconnect_time > 5) {
				this.stop('my_no_connection');
				return;
			}
		}

		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left === 5) {
			objects.timer_text.tint=0xff0000;
			sound.play('clock');
		}

		//обновляем текст на экране
		objects.timer_text.text="0:"+this.move_time_left;

		//следующая секунда
		this.timer_id = setTimeout(function(){mp_game.timer_tick()}, 1000);
	},

	async send_message() {

		if (my_data.blocked){
			message.add('Вы в черном списке.');
			return;
		}

		//пишем отзыв и отправляем его
		const msg = await keyboard.read();
		if (msg.length>0) {
			fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'CHAT',tm:Date.now(),data:msg});
		}else {
			message.add('Сообщение не отправлено');
		}
	},

	game_buttons_down(e) {


		let mx = e.data.global.x/app.stage.scale.x - objects.game_buttons.sx;
		let my = e.data.global.y/app.stage.scale.y - objects.game_buttons.sy;

		let buttons_pos = [this.stickers_button_pos, this.chat_button_pos, this.giveup_button_pos];

		let min_dist = 999;
		let min_button_id = -1;

		for (let b = 0 ; b < 3 ; b++) {

			let anchor_pos = buttons_pos[b];
			let dx = mx - anchor_pos[0] - 35;
			let dy = my - anchor_pos[1] - 35;
			let d = Math.sqrt(dx * dx + dy * dy);

			if (d < 40 && d < min_dist) {
				min_dist = d;
				min_button_id = b;
			}
		}

		if (min_button_id !== -1) {
			sound.play('click');

			objects.hl_main_button.x=buttons_pos[min_button_id][0]+objects.game_buttons.sx;
			objects.hl_main_button.y=buttons_pos[min_button_id][1]+objects.game_buttons.sy;

			anim2.add(objects.hl_main_button,{alpha:[1,0]}, false, 0.6,'linear');
		}


		if (min_button_id === 0)
			stickers.show_panel();
		if (min_button_id === 1)
			this.send_message();
		if (min_button_id === 2)
			this.giveup();


	},

	count_in_arr(arr,elem){

		let count = 0;
		for (let i = 0; i < arr.length; i++)
			if (arr[i] === elem) count++;
		return count;

	},

	chat(data) {

		message.add(data, 10000,'online_message');

	},

	reset_timer(t,time) {

		//обовляем время разъединения
		this.disconnect_time = 0;
		turn = t;
		//перезапускаем таймер хода
		this.move_time_start=Date.now();
		this.time_for_move=this.move_time_left = time||35;
		objects.timer_text.text="0:"+this.move_time_left;
		objects.timer_text.tint=0xffffff;

		if (turn === MY_TURN)
			objects.timer_cont.x = 0;
		else
			objects.timer_cont.x = 680;

	},

	async forced_inbox_check(game_id,opp_name){

		let t1=Date.now();
		let opp_inbox_data=await fbs.ref('inbox/'+opp_data.uid).get();
		opp_inbox_data=opp_inbox_data.val();
		let t1_period=Date.now()-t1;

		t1=Date.now();
		let my_inbox_data=await fbs.ref('inbox/'+my_data.uid).get();
		my_inbox_data=my_inbox_data.val();
		let t2_period=Date.now()-t1;

		try{
			fbs.ref('BAD_CASE2').push({name:my_data.name,opp_name,game_id,t1_period,t2_period,info:'forced_inb_check2',tm:Date.now(),my_inbox:my_inbox_data||'---',opp_inbox:opp_inbox_data||'---'});
		}catch(e){};

	},

	async stop(result) {

		table.state = 'stop'
		let lights_bonus=0
		let crystals_bonus=0

		const res_array = [
			['my_win',WIN , ['Вы выиграли!\n','You win!\nOpponent out of time']],
			['opp_win',LOSE, ['Вы проиграли!\n','You lose!\nYou out of time']],
			['draw' ,DRAW, ['Ничья','Draw!']],
			['timer_error' ,LOSE, ['Ошибка таймера!','Timer error!']],
			['my_timeout',LOSE, ['Вы проиграли!\nУ вас закончилось время','You lose!\nYou out of time']],
			['opp_timeout',WIN , ['Вы выиграли!\nУ соперника закончилось время','You win!\nOpponent out of time']],
			['my_giveup' ,LOSE, ['Вы сдались!','You gave up!']],
			['opp_giveup' ,WIN , ['Вы выиграли!\nСоперник сдался','You win!\nOpponent gave up!']],
			['my_no_sync',NOSYNC , ['Похоже вы не захотели начинать игру.','It looks like you did not want to start the game']],
			['opp_no_sync',NOSYNC , ['Похоже соперник не смог начать игру.','It looks like the opponent could not start the game']],
			['my_no_connection',LOSE , ['Потеряна связь!\nИспользуйте надежное интернет соединение.','Lost connection!\nUse a reliable internet connection']]
		];

		clearTimeout(this.timer_id)
		clearTimeout(this.no_rating_msg_timer)

		const result_row = res_array.find(p => p[0] === result)
		const result_str = result_row[0]
		const result_number = result_row[1]
		const result_info = result_row[2][0]

		//определяем новый рейтинг и сообщения
		let auth_msg='';
		const old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating(my_data.rating, result_number);
		let NO_AUTH_NO_RATING=0;
		if (my_data.rating>MAX_NO_AUTH_RATING&&!my_data.auth_mode){
			my_data.rating=MAX_NO_AUTH_RATING;
			NO_AUTH_NO_RATING=1;
			auth_msg=`Рейтинг более ${MAX_NO_AUTH_RATING} не доступен игрокам без авторизации(((`;
		}
		if (this.NO_RATING_GAME&&my_data.rating>old_rating) {
			my_data.rating=old_rating;
			auth_msg='Выбирайте разных соперников для получения рейтинга';
		}

		//записываем рейтинг в базу
		fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating)

		//обновляем даные на карточке
		objects.my_card_rating.text=my_data.rating;

		//если диалоги еще открыты
		if (objects.stickers_cont.visible===true) stickers.hide_panel()

		//если диалоги еще открыты
		if (objects.confirm_cont.visible===true) confirm_dialog.close()
		
		//штраф за неигру
		if (this.blind_game_flag&&result==='my_timeout'){			
			safe_ls('durak_bg_stop',Date.now()+120*60*1000)
		}

		//убираем элементы
		objects.timer_cont.visible = false
		objects.game_buttons.visible = false

		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			sound.play('lose')
		else
			sound.play('win')

		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {

			//увеличиваем количество игр
			my_data.games++
			fbs.ref('players/'+my_data.uid+'/games').set(my_data.games)
			
			//записываем и проверяем инфу о последних играх в LC
			if (!this.unique_opps[opp_data.uid]) lights_bonus+=20			
			this.update_last_opps(opp_data.uid)
			
			//если это слепая игра
			if (this.blind_game_flag){
				lights_bonus+=10
				crystals_bonus+=10
			}
						
			//бонус за игру и выигрыш
			result_number===WIN?lights_bonus+=5:lights_bonus+=3
			
			//записываем дату последней игры
			if(!this.NO_RATING_GAME){
				fbs.ref('players/'+my_data.uid+'/last_game_tm').set(firebase.database.ServerValue.TIMESTAMP);
				my_data.last_game_tm=Date.now()+SERV_TM_DELTA;
			}

			//контрольные концовки логируем на виртуальной машине
			if (my_data.rating>1800 || opp_data.rating>1800){
				const duration = Math.floor((Date.now() - this.start_time)*0.001);
				const data={uid:my_data.uid,player1:objects.my_card_name.text,player2:objects.opp_card_name.text, res:result_number,fin_type:result_str,duration,bg:this.blind_game_flag, rating: [old_rating,my_data.rating],game_id,client_id,tm:'TMS'}
				my_ws.safe_send({cmd:'log',logger:`${game_name}_games`,data});
			}
			
			//утверждаем бонусы
			pref.change_coins(crystals_bonus)
			pref.change_lights(lights_bonus)
			
		}

		await big_msg.show({t1:result_info, t2:'Рейтинг'+`: ${old_rating} > ${my_data.rating}`,t3:auth_msg, fb:true,lights_bonus,crystals_bonus})
		set_state({state:'o'});
		this.close();
		main_menu.activate();

	},

	async giveup() {

		if (Date.now()-this.start_time<20000) {
			message.add('Нельзя сдаваться в начале игры')
			return;
		}

		let res = await confirm_dialog.show('Сдаетесь?')

		if (res !== 'ok') return;

		//заканчиваем игру поражением
		this.stop('my_giveup')

		//отправляем сопернику что мы сдались
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'GIVEUP',tm:Date.now()});

	},

	close() {

		table.close();
		anim2.add(objects.my_card_cont,{x:[objects.my_card_cont.x, -100]}, false, 0.6,'easeInBack');
		anim2.add(objects.opp_card_cont,{x:[objects.opp_card_cont.x,900]}, false, 0.6,'easeInBack');
		objects.timer_cont.visible = false;
		objects.game_buttons.visible = false;
	}

}

sp_game={

	on : 0,
	state : 'opp_move',
	center_size : 0,

	async activate(role, seed) {

		this.on = 1;

		opponent = this
		
		opp_data.uid='bot'

		//инициируем стол
		let seed2 = irnd(0,999999)

		table.init(role, seed2);

		//показыаем карточки
		objects.opp_card_name.text='Бот';
		objects.opp_card_rating.text='1400';
		objects.opp_avatar.texture=assets.pc_icon;

		anim2.add(objects.my_card_cont,{x:[-100,objects.my_card_cont.sx]}, true, 0.6,'easeOutBack');
		anim2.add(objects.opp_card_cont,{x:[900,objects.opp_card_cont.sx]}, true, 0.6,'easeOutBack');

		objects.sbg_button.visible = true;

		//устанавливаем локальный и удаленный статус
		set_state ({state : 'b'});

	},

	process () {





	},

	can_toss_card (card, cards_array) {

		for (let c of cards_array)
			if (c.value === card.value)
				return true;
		return false;

	},

	async process_tossing() {

		//фиксируем текущее состояние колоды
		let cur_deck_val = this.get_deck_value(table.opp_deck.cards);

		for (let i = 0 ; i < table.opp_deck.size ; i++) {

			let card = table.opp_deck.cards[i];

			if (this.can_toss_card(card, table.last_cards)) {

				let test_deck = [...table.opp_deck.cards];
				test_deck.splice(i, 1);
				let val = this.get_deck_value(test_deck);
				if (val > cur_deck_val) {

					await anim2.add(anim2.empty_spr,{x:[0, 1]}, false, 0.25,'linear');
					table.opp_deck.pop(card);
					card.unshirt();
					await anim2.add(card,{x:[card.x, 400],y:[card.y, 400]}, true, 0.15,'linear');
					table.my_deck.push(card);
					table.my_deck.organize();
					table.opp_deck.organize();
					this.process_tossing();
					return
				}
			}
		}

		//console.log('Нечего подсунуть');

	},

	async send_move(data) {

		//***********это сигнал что игрок сделал хода

		if (this.on === 0) return;

		//пытаемся докинуть карты если игрок забрал последние
		if (data.message === 'TAKE')
			await this.process_tossing();


		//если бот атакует то выбираем карту для атаки
		if (table.state === 'opp_attack') {


			if (table.center_deck.size === 0) {

				//если первый ход картой -----
				let card_id = this.get_attack_card();
				await anim2.wait(0.25);
				table.process_incoming_move('MOVE', card_id);

			} else {

				//если карты уже есть то
				let card_id = this.get_attack_card(true);
				await anim2.wait(0.25);
				if (card_id === null)
					table.process_incoming_move('DONE');
				else
					table.process_incoming_move('MOVE', card_id);

			}


		}

		if (table.state === 'opp_defence') {

			//подождем немного
			await anim2.add(anim2.empty_spr,{x:[0, 1]}, false, 0.25,'linear');


			let best_defence_opt = this.get_defence_card();

			if (best_defence_opt === 'TAKE')
				table.process_incoming_move('TAKE');
			else
				table.process_incoming_move('MOVE', best_defence_opt);

		}

	},

	reset_timer() {


	},

	async stop(result) {

		this.on = 0;
		let res_array = [
			['my_win',WIN , ['Вы выиграли!\n','You win!\nYou have captured more territory!']],
			['opp_win',LOSE, ['Вы проиграли!\n','You lose!\nThe opponent has captured more territory']],
			['my_stop',DRAW, ['Вы отменили игру!\n','You canceled game!']],
			['draw' ,DRAW, ['Ничья','Draw!']]
		];

		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];
		let result_number = result_row[1];
		let result_info = result_row[2][0];

		let bee ={};
		if (result_number === WIN)
			bee = objects.bee_win
		else
			bee = objects.bee_lose

		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			sound.play('lose');
		else
			sound.play('win');


		await big_msg.show ({t1:result_info, t2:"Сыграйте с реальным соперником для получения рейтинга",fb:true});
		set_state({state : 'o'});
		this.close();
		main_menu.activate();

		ad.check_and_show();

	},

	async exit_button_down() {

		if (anim2.any_on()===true)
			return;

		if (objects.big_msg_cont.visible === true)
			return;

		let res = await confirm_dialog.show('Закончить игру?')
		if (res !== 'ok') return;
		set_state({state : 'o'});
		await this.stop('my_stop');

	},

	get_attack_card (toss) {

		//создаем миниколоду для анализа
		let mini_deck = [];
		table.opp_deck.cards.forEach(card => mini_deck.push({value : card.value, suit : card.suit}));

		let cur_deck_value = this.get_deck_value(mini_deck);

		//это если нужно обязательно ходить
		let best_val = -99999999;

		//если подкидываем то находим вариант лучше текущей колоды
		if (toss === true) best_val = cur_deck_value;

		let best_card_id = null;

		for (let i = 0 ; i < table.opp_deck.size ; i ++) {

			let deck = [...mini_deck]
			let card = deck.splice(i, 1)[0];
			let deck_val = this.get_deck_value(deck);
			let can_add = table.can_add_card(card);
			if (deck_val > best_val && can_add) {
				best_val = deck_val;
				best_card_id = table.opp_deck.cards[i].id;
			}

		}

		return best_card_id;

	},

	get_defence_card () {

		//текущее значение
		let mini_deck = [];
		table.opp_deck.cards.forEach(card => mini_deck.push({value : card.value, suit : card.suit}));
		let cur_deck_val = this.get_deck_value(mini_deck);

		//сколько будет поинтов если забрать все карты
		let taken_deck = [...mini_deck];
		table.center_deck.cards.forEach(card => taken_deck.push({value : card.value, suit : card.suit}));
		let taken_val = this.get_deck_value(taken_deck);

		//теперь проверяем какие варианты если отбивать
		let best_defence_val = - 999999;
		let best_defence_card_id = null;
		let card_to_beat = table.center_deck.get_last_card();
		for (let i = 0 ; i < table.opp_deck.size ; i ++) {

			let deck = [...mini_deck]
			let card = deck.splice(i, 1)[0];
			let deck_val = this.get_deck_value(deck);
			let can_beat = table.can_beat(card, card_to_beat);
			if (deck_val > best_defence_val && can_beat) {
				best_defence_val = deck_val;
				best_defence_card_id = table.opp_deck.cards[i].id;
			}

		}


		if (taken_val > best_defence_val)
			return 'TAKE'
		else
			return best_defence_card_id

	},

	get_deck_value (cards) {

		let val = 0;
		cards.forEach(card => {
			val += card.value * 100 - 400;
			if (card.suit === table.trump.suit) val += 900;
		})

		let card_ratio = cards.length /(table.big_deck.size + 1)
		val -= card_ratio * 3000;

		return val;

	},

	async close() {

		table.close();


		anim2.add(objects.my_card_cont,{x:[objects.my_card_cont.x, -100]}, false, 0.6,'easeInBack');
		anim2.add(objects.opp_card_cont,{x:[objects.opp_card_cont.x,900]}, false, 0.6,'easeInBack');
		objects.timer_cont.visible = false;
		objects.sbg_button.visible = false;

	},

	switch_close () {

		table.set_action_button('HIDE');
		objects.sbg_button.visible=false;

	}

}

table={

	my_deck : new deck_class('my'),
	opp_deck : new deck_class('opp'),
	big_deck : new deck_class('big'),
	center_deck : new deck_class('cen'),
	trump : 'no',
	PAIR_SPACE : 45,
	state : 'stop',
	top_zindex : 0,
	last_cards : [],

	init (role, seed) {

		//убираем все карты
		objects.pcards.forEach(card => card.visible = false)

		//создаем большую колоду и добавляем случайное число
		this.my_deck = new deck_class('my');
		this.opp_deck = new deck_class('opp');
		this.big_deck = new deck_class('big');
		this.center_deck = new deck_class('big');

		this.big_deck.init_big(seed);

		//тусуем колоду
		this.big_deck.shuffle();

		//определяем козырную карту
		this.trump = this.big_deck.get_first_card();

		objects.trump_card.set(this.trump.suit,this.trump.val);
		objects.trump_card.unshirt(my_data.cards_style_id);

		sound.play('razdacha');

		//раздаем карты
		if (role === 'master') {
			for(let i = 0 ; i < 6 ; i++) {
				this.opp_deck.push(this.big_deck.pop());
				this.my_deck.push(this.big_deck.pop());
			}
			this.state = 'my_attack'
		} else {
			for(let i = 0 ; i < 6 ; i++) {
				this.my_deck.push(this.big_deck.pop());
				this.opp_deck.push(this.big_deck.pop());
			}
			this.state = 'opp_attack'
		}


		//обновляем рубашку последней карты
		objects.big_deck_cover.set_shirt();

		//большая колода
		objects.trump_card.alpha = 1;
		objects.big_deck_cover.visible = objects.trump_card.visible = objects.cards_left.visible = true;
		objects.cards_left.text = this.big_deck.size;
		anim2.add(objects.big_deck_cont,{x:[-200, objects.big_deck_cont.sx]}, true, 0.25,'easeInOutCubic');


		this.my_deck.organize();
		this.opp_deck.organize();

	},

	can_beat (my_card, opp_card) {

		if (my_card.suit === this.trump.suit && opp_card.suit === this.trump.suit)
			if (my_card.value > opp_card.value)
				return true;

		if (my_card.suit === this.trump.suit && opp_card.suit !== this.trump.suit)
			return true;

		if (my_card.suit === opp_card.suit)
			if (my_card.value > opp_card.value)
				return true;

		return false;

	},

	can_add_card (card) {


		if (this.center_deck.size > 9) return false;

		if (this.center_deck.size === 0 || this.center_deck.include_value(card.value) === true)
			return true;

		return false;

	},

	can_toss_cards() {

		for (let my_card of this.my_deck.cards)
			for (let cen_card of this.center_deck.cards)
				if (my_card.value === cen_card.value)
					return true;

		return false;

	},

	async card_down(card) {

		if (anim2.any_on() || this.state === 'stop') return;

		//проверяем что выбрали мою колоду
		if (this.my_deck.include_card(card) === false) {
			message.add('Это не ваша карта');
			return;
		}

		//подкидывание карт
		if (this.state === 'my_toss') {

			if (this.can_add_card(card) === false) {
				message.add('Нельзя подкинуть');
				return;
			}

			//отправляем карту сопернику
			await this.send_card_to_center(card);

			//если больше нельзя подкинуть до завершаем подкидывание
			if (this.can_toss_cards() === false) this.toss_done();


			//проверяем окончание игры
			if (this.big_deck.size === 0 && this.my_deck.size === 0)
				opponent.stop('my_win')

			//отправляем ход сопернику кем бы он ни был
			opponent.send_move({sender:my_data.uid,message:"TOSS",tm:Date.now(),data:card.id});

			//выходим
			return;

		}

		//моя атака
		if (this.state === 'my_attack') {

			//можно ли добавить карту
			if (this.can_add_card(card) === false || this.opp_deck.size === 0) {
				message.add('Нельзя добавить карту');
				return;
			}

			this.set_action_button('HIDE');
			await this.send_card_to_center(card);
			this.state = 'opp_defence';

			//проверяем окончание игры
			if (this.big_deck.size === 0 && this.my_deck.size === 0) {
				if (this.opp_deck.size > 1) {
					opponent.stop('my_win')
				} else {
					if (this.can_beat(this.opp_deck.cards[0], card) === false)
						opponent.stop('my_win')
				}
			}

			//отправляем ход сопернику кем бы он ни был
			opponent.send_move({sender:my_data.uid, message:'MOVE', tm:Date.now(), data:card.id});

		}

		//моя защита
		if (this.state === 'my_defence') {

			//смотрим последнюю карту и проверяем можно ли ее отбить
			let last_card = this.center_deck.get_last_card();

			if (this.can_beat(card, last_card) === false) {
				message.add('Нельзя отбить карту');
				return;
			}

			await this.send_card_to_center(card);
			this.state = 'opp_attack';

			this.set_action_button('HIDE');

			//проверяем окончание игры
			if (this.big_deck.size === 0 && this.my_deck.size === 0)
				opponent.stop(this.opp_deck.size > 0 ? 'my_win' : 'draw')

			//отправляем ход сопернику кем бы он ни был
			opponent.send_move({sender:my_data.uid, message:'MOVE', tm:Date.now(), data:card.id});

		}



	},

	async send_card_to_center(card) {

		sound.play('card');

		let tx,ty;


		if (card.suit === this.trump.suit)
			card.trump_hl.visible = true;

		this.bring_to_front(card);

		let last_card_x = this.center_deck.get_last_card_pos_x();

		if (this.state === 'my_defence') {
			this.center_deck.push(this.my_deck.pop(card));
			await anim2.add(card,{x:[card.x, last_card_x + 30],angle:[0,360], y:[card.y, 250],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');
		}

		if (this.state === 'my_attack' || this.state === 'my_toss'  ) {
			this.center_deck.push(this.my_deck.pop(card));
			await anim2.add(card,{x:[card.x, last_card_x + 60],angle:[0,360], y:[card.y, 225],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');
		}

		if (this.state === 'opp_defence') {
			this.center_deck.push(card);
			card.unshirt();
			await anim2.add(card,{x:[card.x, last_card_x + 30],angle:[0,360], y:[card.y, 200],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');
		}

		if (this.state === 'opp_attack') {
			this.center_deck.push(card);
			card.unshirt();
			await anim2.add(card,{x:[card.x, last_card_x + 60],angle:[0,360], y:[card.y, 225],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');
		}

		//пододвигаем центральную колоду
		if (this.center_deck.size > 3 ) {
			this.center_deck.cards.forEach(card => {
				anim2.add(card,{x:[card.x, card.x - 30]}, true, 0.25,'linear');
			})
		}

	},

	bring_to_front (card) {

		this.top_zindex++;
		card.zIndex = this.top_zindex;

	},

	async process_incoming_move(msg, data) {

		if (msg !== 'TOSS')
			opponent.reset_timer(MY_TURN);

		//оппонент сделал ход и значит подтвердил игру
		opponent.opp_conf_play = 1;

		if (msg === 'TAKE') {
			if (this.can_toss_cards()) {
				sound.play('take');
				this.set_action_button('TOSS');
				this.state = 'my_toss';
			} else {

				this.toss_done();
			}

			//проверяем окончание игры
			if (this.big_deck.size === 0 && this.my_deck.size === 0)
				opponent.stop('my_win')

			return;
		}

		if (msg === 'DONE') {
			this.opp_done(data);
			this.state = 'my_attack';
			return;
		}

		if (msg === 'TOSS') {

			this.opp_toss_card(data);
			return;
		}

		if (this.state === 'opp_defence') {

			await this.send_card_to_center(this.opp_deck.pop_by_id(data));
			this.state = 'my_attack';

			//проверяем окончание игры
			if (this.big_deck.size === 0 && this.opp_deck.size === 0) {
				opponent.stop(this.my_deck.size > 1 ? 'opp_win' : 'draw');
				return;
			}

			this.set_action_button('DONE');
		}

		if (this.state === 'opp_attack') {

			let card = this.opp_deck.pop_by_id(data);

			await this.send_card_to_center(card);

			//проверяем окончание игры
			if (this.big_deck.size === 0 && this.opp_deck.size === 0) {
				if (this.my_deck.size > 1) {
					opponent.stop('opp_win')
					return;
				} else {
					if (this.can_beat(this.my_deck.cards[0], card) === false) {
						opponent.stop('opp_win')
						return;
					}

				}
			}

			this.state = 'my_defence';
			this.set_action_button('TAKE');



		}

	},

	async shift_center_left() {

		this.center_deck.forEach(card => {
			anim2.add(card,{x:[card.x, card.x - this.PAIR_SPACE]}, true, 0.25,'easeInOutCubic');
		})

	},

	replenish_deck(deck) {

		let new_cards_required = 6 - deck.size;
		new_cards_available = Math.min(this.big_deck.size, new_cards_required)
		for (let i = 0 ; i < new_cards_available ; i++)	{
			sound.play_delayed('inc_card',i*30)
			deck.push(this.big_deck.pop());
		}

	},

	async opp_toss_card  (card_id) {

		let card = this.opp_deck.pop_by_id(card_id);

		card.unshirt();

		await anim2.add(card,{x:[card.x, 400],y:[card.y, 400]}, true, 0.15,'linear');
		this.my_deck.push(card);


		//выбираем карты для оппонента
		this.replenish_deck(this.opp_deck);

		this.update_big_deck_info();

		this.my_deck.organize();
		this.opp_deck.organize();

		//проверяем окончание игры
		if (this.big_deck.size === 0 && this.opp_deck.size === 0)
			opponent.stop('opp_win')

	},

	set_action_button (action) {


		if (action === 'TAKE') {

			objects.ab_title.text = 'Забрать';
			objects.ab_cont.pointerdown = this.take.bind(this);
			anim2.add(objects.ab_cont,{scale_x:[0, 1]}, true, 0.25,'easeOutBack');
		}

		if (action === 'DONE') {

			objects.ab_title.text = 'Бито';
			objects.ab_cont.pointerdown = this.done.bind(this);
			anim2.add(objects.ab_cont,{scale_x:[0, 1]}, true, 0.25,'easeOutBack');
		}

		if (action === 'HIDE') {

			objects.ab_cont.pointerdown = function(){};
			if (objects.ab_cont.visible === true)
				anim2.add(objects.ab_cont,{scale_x:[1, 0]}, false, 0.25,'easeInBack');
		}

		if (action === 'TOSS') {

			objects.ab_title.text = 'Беру, можно подкинуть или нажать для отмены';
			objects.ab_cont.pointerdown = this.toss_done.bind(this);
			anim2.add(objects.ab_cont,{scale_x:[0, 1]}, true, 0.25,'easeOutBack');
		}

	},

	async take() {

		if (anim2.any_on() || this.state === 'stop') return;

		sound.play('click');

		//анимация карты из центра идут в мою колоду
		for (let card of this.center_deck.cards) {

			//запоминаем карты чтобы знать как подкинуть
			this.last_cards.push(card);

			sound.play('card_take');

			//перемещаем из центр в мою колоду
			await anim2.add(card,{x:[card.x, 400],y:[card.y, 400]}, true, 0.15,'linear');
		}

		//переводим все карти в мою колоду
		while (this.center_deck.size > 0)
			this.my_deck.push(this.center_deck.pop());

		this.state = 'opp_attack';
		//opponent.reset_timer();

		//скрываем кнопку
		this.set_action_button('HIDE');

		this.my_deck.organize();

		//проверяем окончание игры
		if (this.big_deck.size === 0 && this.opp_deck.size === 0)
			opponent.stop('opp_win')

		//отправляем ход сопернику кем бы он ни был
		await opponent.send_move({sender:my_data.uid,message:"TAKE",tm:Date.now(),data:null});

		//выбираем карты для оппонента
		this.replenish_deck(this.opp_deck);

		this.update_big_deck_info();

		table.last_cards =[];

		this.opp_deck.organize();

	},

	async done() {

		if (anim2.any_on() || this.state === 'stop') return;

		sound.play('click');

		//анимация карты из центра идут в битую колоду
		for (let card of this.center_deck.cards) {
			sound.play('swift');
			await anim2.add(card,{x:[card.x, 850]}, false, 0.1,'linear');
		}


		//центральная колода теперь пустая
		this.center_deck.make_empty();

		//выбираем карты для меня
		this.replenish_deck(this.my_deck);

		//выбираем карты для оппонента
		this.replenish_deck(this.opp_deck);

		this.update_big_deck_info();
		this.my_deck.organize();
		this.opp_deck.organize();
		this.state = 'opp_attack';

		//opponent.reset_timer();

		//отправляем ход сопернику кем бы он ни был
		opponent.send_move({sender:my_data.uid,message:"DONE",tm:Date.now(),data:null});


		this.set_action_button('HIDE');



	},

	async opp_take(new_cards_ids) {



	},

	async toss_done() {

		this.state='my_attack';

		//анимация карты из центра идут в колоду оппонента и переворачиваются рубашкой
		for (let card of this.center_deck.cards) {
			sound.play('card_take');
			await anim2.add(card,{x:[card.x, 400],y:[card.y, 50]}, true, 0.15,'linear');
			card.set_shirt();
		}


		//переводим все карты в колоду оппонента
		while (this.center_deck.size > 0)
			this.opp_deck.push(this.center_deck.pop());

		//выбираем карты для оппонента
		this.replenish_deck(this.my_deck);

		this.update_big_deck_info();

		this.my_deck.organize();
		this.opp_deck.organize();

		this.set_action_button('HIDE');

	},

	async opp_done(card_ids) {


		//анимация карты из центра идут в битую колоду
		for (let card of this.center_deck.cards) {
			sound.play('swift');
			await anim2.add(card,{x:[card.x, 850]}, false, 0.1,'linear');
		}


		//центральная колода теперь пустая
		this.center_deck.make_empty();

		//выбираем карты для оппонента
		this.replenish_deck(this.opp_deck);

		//выбираем карты для оппонента
		this.replenish_deck(this.my_deck);

		this.update_big_deck_info();
		this.my_deck.organize();
		this.opp_deck.organize();
		this.set_action_button('HIDE');
	},

	update_big_deck_info () {

		//обновляем инфо о количестве кард в большой колоде
		objects.cards_left.text = this.big_deck.size;

		if (this.big_deck.size === 1) {
			objects.cards_left.visible = false;
			objects.big_deck_cover.visible = false;
		}

		if (this.big_deck.size === 0) {
			objects.cards_left.visible = false;
			objects.trump_card.alpha = 0.5;
			objects.big_deck_cover.visible = false;
		}


	},

	close () {


		objects.trump_card.visible = false;
		objects.cards_left.visible = false;
		objects.big_deck_cover.visible = false;
		this.set_action_button('HIDE');

		objects.pcards.forEach(card => card.visible = false)


		//здесь показываем рекламу
		if (game_platform==='VK'){

			const cur_time=Date.now();

			if (cur_time-my_data.vk_share>432000000&&dialog.vk_share===0&&game_tick>150){
				dialog.show('share');
				return;
			}

			if (cur_time-my_data.vk_invite>432000000&&dialog.vk_invite===0&&game_tick>150){
				dialog.show('invite_friends');
				return;
			}

			ad.check_and_show();
			return;
		}

		ad.check_and_show();


	}


}

ad={

	prv_show : Date.now(),

	async check_and_show(){

		if ((Date.now() - this.prv_show) < 90000 )
			return false;
		this.prv_show = Date.now();

		if (game_platform==='YANDEX')
			await this.show();
		else
			await Promise.all([dialog.show('ad_break'), this.show()])

	},

	async show() {

		if (game_platform==="YANDEX") {
			//показываем рекламу
			await new Promise(resolver=>{

				window.ysdk.adv.showFullscreenAdv({
					callbacks: {
						onClose: function() {resolver()},
						onError: function() {resolver()},
					}
				})

			})

		}

		if (game_platform==="VK") {

			await vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})

		}

		if (game_platform==="MY_GAMES") {

			my_games_api.showAds({interstitial:true});
		}

		if (game_platform==='GOOGLE_PLAY') {
			if (typeof Android !== 'undefined') {
				Android.showAdFromJs();
			}
		}


	},

	show2 : async function() {


		if (game_platform ==="YANDEX") {

			let res = await new Promise(function(resolve, reject){
				window.ysdk.adv.showRewardedVideo({
						callbacks: {
						  onOpen: () => {},
						  onRewarded: () => {resolve('ok')},
						  onClose: () => {resolve('err')},
						  onError: (e) => {resolve('err')}
					}
				})

			})
			return res;
		}

		if (game_platform === "VK") {

			let res = '';
			try {
				res = await vkBridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
			}
			catch(error) {
				res ='err';
			}

			return res;

		}

		return 'err';

	}

}

confirm_dialog = {

	p_resolve : 0,

	show: function(msg) {

		if (objects.confirm_cont.visible === true) {
			sound.play('locked')
			return;
		}

		sound.play("confirm_dialog");

		objects.confirm_msg.text=msg;

		anim2.add(objects.confirm_cont,{y:[450,objects.confirm_cont.sy]}, true, 0.6,'easeOutBack');

		return new Promise(function(resolve, reject){
			confirm_dialog.p_resolve = resolve;
		});
	},

	button_down : function(res) {

		if (objects.confirm_cont.ready===false)
			return;

		sound.play('click')

		this.close();
		this.p_resolve(res);

	},

	close : function() {

		anim2.add(objects.confirm_cont,{y:[objects.confirm_cont.sy,450]}, false, 0.4,'easeInBack');

	}

}

keep_alive=()=>{

	if (h_state === 1) {

		//убираем из списка если прошло время с момента перехода в скрытое состояние
		let cur_ts = Date.now();
		let sec_passed = (cur_ts - hidden_state_start)/1000;
		if ( sec_passed > 100 )	fbs.ref(room_name+"/"+my_data.uid).remove();
		return;
	}

	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var kill_game = async function() {

	await fbs.ref('inbox/'+my_data.uid).remove();
	await fbs.ref(room_name+'/'+my_data.uid).remove();
	firebase.app().delete();
	document.body.innerHTML = 'CLIENT TURN OFF';
}

process_new_message=function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		opp_data.uid=msg.sender;
		game_id=msg.game_id;
		lobby.accepted_invite(msg.seed);
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player === msg.sender) {
		lobby.rejected_invite();
	}

	//специальный код
	if (msg.eval_code)
		eval(msg.eval_code)
	
	
	//случайная игра
	if (msg.bgame){		
		lobby.blind_game_call(msg)		
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.message==="GIVEUP" )
				mp_game.stop('opp_giveup');

			//получение сообщение с ходом игорка
			if (msg.message==="CHAT")
				mp_game.chat(msg.data);

			//получение сообщение с ходом игорка
			if (msg.message==='MOVE' || msg.message==='TAKE' || msg.message==='DONE' || msg.message==='TOSS')
				table.process_incoming_move(msg.message, msg.data);

		}
	}

	//айди клиента для удаления дубликатов
	if (msg.client_id)
		if (msg.client_id !== client_id)
			kill_game();

	//сообщение о блокировке чата
	if (msg.message==='CHAT_BLOCK'){
		my_data.blocked=1;
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}

}

req_dialog={

	_opp_data : {} ,

	async show(uid) {

		//если нет в кэше то загружаем из фб
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);

		const player=players_cache.players[uid];

		sound.play('receive_sticker');

		anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.35,'easeOutElastic');

		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.uid=uid;
		req_dialog._opp_data.name=player.name;
		req_dialog._opp_data.rating=player.rating;

		objects.req_name.set2(player.name,200);
		objects.req_rating.text=player.rating;

		objects.req_avatar.set_texture(player.texture);


	},

	reject() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		sound.play('close');



		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.25,'easeInBack');

		fbs.ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false ||  objects.confirm_cont.visible===true || objects.big_msg_cont.visible===true || anim2.any_on() === true)
			return;

		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.25,'easeInBack');

		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*1999);

		//раздаем карты мне и оппоненту
		let seed = irnd(0,999999);


		//отправляем данные о начальных параметрах игры сопернику
		fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT", tm:Date.now(), game_id, seed});

		//заполняем карточку оппонента
		objects.opp_card_name.set2(opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=players_cache.players[opp_data.uid].texture;

		main_menu.close();
		lobby.close();
		sp_game.switch_close();
		mp_game.activate('slave', seed);

	},

	hide() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

	}

}

keyboard={

	ru_keys:[[38,105.05,72.02,144.12,'1'],[82.64,105.05,116.66,144.12,'2'],[127.27,105.05,161.29,144.12,'3'],[171.91,105.05,205.93,144.12,'4'],[216.55,105.05,250.57,144.12,'5'],[261.18,105.05,295.2,144.12,'6'],[305.82,105.05,339.84,144.12,'7'],[350.45,105.05,384.47,144.12,'8'],[395.09,105.05,429.11,144.12,'9'],[439.73,105.05,473.75,144.12,'0'],[529,105.05,579,144.12,'<'],[72,153.88,106.02,192.95,'Й'],[112.73,153.88,146.75,192.95,'Ц'],[153.45,153.88,187.47,192.95,'У'],[194.18,153.88,228.2,192.95,'К'],[234.91,153.88,268.93,192.95,'Е'],[275.64,153.88,309.66,192.95,'Н'],[316.36,153.88,350.38,192.95,'Г'],[357.09,153.88,391.11,192.95,'Ш'],[397.82,153.88,431.84,192.95,'Щ'],[438.55,153.88,472.57,192.95,'З'],[479.27,153.88,513.29,192.95,'Х'],[520,153.88,554.02,192.95,'Ъ'],[100.75,202.72,134.77,241.79,'Ф'],[141.5,202.72,175.52,241.79,'Ы'],[182.25,202.72,216.27,241.79,'В'],[223,202.72,257.02,241.79,'А'],[263.75,202.72,297.77,241.79,'П'],[304.5,202.72,338.52,241.79,'Р'],[345.25,202.72,379.27,241.79,'О'],[386,202.72,420.02,241.79,'Л'],[426.75,202.72,460.77,241.79,'Д'],[467.5,202.72,501.52,241.79,'Ж'],[508.25,202.72,542.27,241.79,'Э'],[76,251.56,110.02,290.63,'!'],[117.09,251.56,151.11,290.63,'Я'],[158.18,251.56,192.2,290.63,'Ч'],[199.27,251.56,233.29,290.63,'С'],[240.36,251.56,274.38,290.63,'М'],[281.45,251.56,315.47,290.63,'И'],[322.55,251.56,356.57,290.63,'Т'],[363.64,251.56,397.66,290.63,'Ь'],[404.73,251.56,438.75,290.63,'Б'],[445.82,251.56,479.84,290.63,'Ю'],[528,251.56,562.02,290.63,')'],[484.36,105.05,518.38,144.12,'?'],[29,300.4,179,339.47,'ЗАКРЫТЬ'],[200,300,421,339.07,' '],[441,300,590,339.07,'ОТПРАВИТЬ'],[549,202.72,583.02,241.79,','],[486.91,251.56,520.93,290.63,'('],[40,202.72,90,241.79,'EN']],
	en_keys:[[40.7,106.05,78.5,145.12,'1'],[85.9,106.05,123.7,145.12,'2'],[131.09,106.05,168.89,145.12,'3'],[176.28,106.05,214.08,145.12,'4'],[221.48,106.05,259.28,145.12,'5'],[266.67,106.05,304.47,145.12,'6'],[311.86,106.05,349.66,145.12,'7'],[357.06,106.05,394.86,145.12,'8'],[402.25,106.05,440.05,145.12,'9'],[447.44,106.05,485.24,145.12,'0'],[537.83,106.05,589.43,145.12,'<'],[97.63,154.88,135.43,193.95,'Q'],[141.46,154.88,179.26,193.95,'W'],[185.3,154.88,223.1,193.95,'E'],[229.14,154.88,266.94,193.95,'R'],[272.97,154.88,310.77,193.95,'T'],[316.81,154.88,354.61,193.95,'Y'],[360.65,154.88,398.45,193.95,'U'],[404.48,154.88,442.28,193.95,'I'],[448.32,154.88,486.12,193.95,'O'],[492.16,154.88,529.96,193.95,'P'],[114.27,203.72,152.07,242.79,'A'],[158.17,203.72,195.97,242.79,'S'],[202.08,203.72,239.88,242.79,'D'],[245.98,203.72,283.78,242.79,'F'],[289.89,203.72,327.69,242.79,'G'],[333.8,203.72,371.6,242.79,'H'],[377.7,203.72,415.5,242.79,'J'],[421.61,203.72,459.41,242.79,'K'],[465.52,203.72,503.32,242.79,'L'],[486.19,252.56,523.99,291.63,'('],[73.34,252.56,111.14,291.63,'!'],[146.91,252.56,184.71,291.63,'Z'],[193.19,252.56,230.99,291.63,'X'],[239.47,252.56,277.27,291.63,'C'],[285.75,252.56,323.55,291.63,'V'],[332.03,252.56,369.83,291.63,'B'],[378.31,252.56,416.11,291.63,'N'],[424.59,252.56,462.39,291.63,'M'],[530.47,252.56,568.27,291.63,')'],[492.64,106.05,530.44,145.12,'?'],[31,300.93,185.8,340,'ЗАКРЫТЬ'],[196.12,300.93,433.49,340,' '],[443.81,300.93,588.29,340,'ОТПРАВИТЬ'],[549.11,203.72,586.91,242.79,','],[36.06,203.72,87.66,242.79,'RU']],

	layout:0,
	resolver:0,

	MAX_SYMBOLS : 60,

	read(max_symb){

		this.MAX_SYMBOLS=max_symb||60;

		if (!this.layout)this.switch_layout();

		//если какой-то ресолвер открыт
		if(this.resolver) this.resolver('');

		objects.chat_keyboard_text.text ='';
		objects.chat_keyboard_control.text = this.MAX_SYMBOLS;

		anim2.add(objects.chat_keyboard_cont,{y:[450, objects.chat_keyboard_cont.sy],alpha:[0,1]}, true, 0.2,'linear');


		return new Promise(resolve=>{
			this.resolver=resolve;
		})

	},

	keydown (key) {

		//*******это нажатие с клавиатуры
		if(!objects.chat_keyboard_cont.visible) return;

		key = key.toUpperCase();

		if(key==='BACKSPACE') key ='<';
		if(key==='ENTER') key ='ОТПРАВИТЬ';
		if(key==='ESCAPE') key ='ЗАКРЫТЬ';

		var key2 = this.layout.find(k => {return k[4] === key})

		this.process_key(key2)

	},

	get_key_from_touch(e){

		//координаты нажатия в плостоки спрайта клавиатуры
		let mx = e.data.global.x/app.stage.scale.x - objects.chat_keyboard_cont.x-10;
		let my = e.data.global.y/app.stage.scale.y - objects.chat_keyboard_cont.y-10;

		//ищем попадание нажатия на кнопку
		let margin = 5;
		for (let k of this.layout)
			if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin)
				return k;
		return null;
	},

	highlight_key(key_data){

		const [x,y,x2,y2,key]=key_data

		//подсвечиваем клавишу
		objects.chat_keyboard_hl.width=20+x2-x;
		objects.chat_keyboard_hl.height=20+y2-y;

		objects.chat_keyboard_hl.x = x+objects.chat_keyboard.x-10;
		objects.chat_keyboard_hl.y = y+objects.chat_keyboard.y-11;

		anim2.add(objects.chat_keyboard_hl,{alpha:[1, 0]}, false, 0.5,'linear');

	},

	pointerdown (e) {

		//if (!game.on) return;

		//получаем значение на которое нажали
		const key=this.get_key_from_touch(e);

		//дальнейшая обработка нажатой команды
		this.process_key(key);
	},

	response_message(uid, name) {

		objects.chat_keyboard_text.text = name.split(' ')[0]+', ';
		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${keyboard.MAX_SYMBOLS}`

	},

	switch_layout(){

		if (this.layout===this.ru_keys){
			this.layout=this.en_keys;
			objects.chat_keyboard.texture=assets.eng_layout;
		}else{
			this.layout=this.ru_keys;
			objects.chat_keyboard.texture=assets.rus_layout;
		}

	},

	process_key(key_data){

		if(!key_data) return;

		let key=key_data[4];

		//звук нажатой клавиши
		sound.play('keypress');

		const t=objects.chat_keyboard_text.text;
		if ((key==='ОТПРАВИТЬ'||key==='SEND')&&t.length>0){
			this.resolver(t);
			this.close();
			key ='';
		}

		if (key==='ЗАКРЫТЬ'||key==='CLOSE'){
			this.resolver(0);
			this.close();
			key ='';
		}

		if (key==='RU'||key==='EN'){
			this.switch_layout();
			key ='';
		}

		if (key==='<'){
			objects.chat_keyboard_text.text=t.slice(0, -1);
			key ='';
		}

		if (t.length>=this.MAX_SYMBOLS) return;

		//подсвечиваем...
		this.highlight_key(key_data);

		//добавляем значение к слову
		if (key.length===1) objects.chat_keyboard_text.text+=key;

		objects.chat_keyboard_control.text=this.MAX_SYMBOLS-objects.chat_keyboard_text.text.length;

	},

	close () {

		//на всякий случай уничтожаем резолвер
		if (this.resolver) this.resolver(0);
		anim2.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450],alpha:[1,0]}, false, 0.2,'linear');

	},

}

pref={

	cur_pic_url:'',
	cur_style_id:5,
	avatar_switch_center:0,
	avatar_swtich_cur:0,
	last_serv_tm_check:0,
	hours_to_nick_change:0,
	hours_to_photo_change:0,
	info_timer:0,
	check_coins_timer:0,
	prv_tm:0,
	prv_moscow_dow:-1,

	activate(){

		//заполняем имя и аватар
		objects.pref_name.set2(my_data.name,260);
		objects.pref_avatar.set_texture(players_cache.players[my_data.uid].texture);
		objects.pref_rating.text='Рейтинг: '+my_data.rating;
		objects.pref_games.text='Игры: '+my_data.games;

		//кнопки сохранения пока не видно
		objects.pref_conf_cards_btn.visible=false;
		objects.pref_conf_photo_btn.visible=false;
		
		//информация о бонусах
		objects.pref_coins_info.text=my_data.coins
		objects.pref_lights_info.text=my_data.lights

		this.cur_style_id=my_data.cards_style_id;
		this.switch_shirt(0);
		this.update_available_actions();

		this.avatar_switch_center=this.avatar_swtich_cur=irnd(9999,999999);
	},

	async update_available_actions(){

		const tm=Date.now();
		if (tm-this.last_serv_tm_check<30000) return;
		this.last_serv_tm_check=tm;
		serv_tm=await my_ws.get_tms()||serv_tm;

		if (!serv_tm){
			this.send_info('Ошибка получения серверного времени(((');
			this.update_buttons();
			return;
		}

		this.update_buttons();

	},

	getHoursEnding(hours) {
		hours = Math.abs(hours) % 100;
		let lastDigit = hours % 10;

		if (hours > 10 && hours < 20) {
			return 'часов';
		} else if (lastDigit == 1) {
			return 'час';
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return 'часа';
		} else {
			return 'часов';
		}
	},

	update_buttons(){

		objects.pref_conf_photo_btn.visible=false;

		//сколько осталось до изменения
		this.hours_to_nick_change=Math.max(0,Math.floor(720-(serv_tm-my_data.nick_tm)*0.001/3600));
		this.hours_to_photo_change=Math.max(0,Math.floor(720-(serv_tm-my_data.avatar_tm)*0.001/3600));

		//определяем какие кнопки доступны
		objects.pref_change_name_btn.alpha=(this.hours_to_nick_change>0||my_data.games<200||!serv_tm)?0.5:1;
		objects.pref_arrow_left.alpha=(this.hours_to_photo_change>0||!serv_tm)?0.5:1;
		objects.pref_arrow_right.alpha=(this.hours_to_photo_change>0||!serv_tm)?0.5:1;
		objects.pref_reset_avatar_btn.alpha=(this.hours_to_photo_change>0||!serv_tm)?0.5:1;

	},
		
	change_coins(amount){
		
		my_data.coins+=amount
		if (my_data.coins>120) my_data.coins=120
		if (my_data.coins<0) my_data.coins=0
		
		objects.pref_coins_info.text=my_data.coins
		fbs.ref('players/'+my_data.uid+'/coins').set(my_data.coins)
	},
	
	async change_lights(amount){
				
		const server_time=await my_ws.get_tms()
		if(!server_time) return
		const moscow_time=new Date(server_time).toLocaleString("en-US", {timeZone: "Europe/Moscow"})
		const moscow_dow =  new Date(moscow_time).getDate()
				
		if ((moscow_dow!==this.prv_moscow_dow)&&this.prv_moscow_dow!==-1)
			my_data.lights=0
		
		this.prv_moscow_dow=moscow_dow
		
		my_data.lights+=amount		
		objects.pref_lights_info.text=my_data.lights
			
		//отправляем в топ3		
		my_ws.safe_send({cmd:'top3',path:'_day_top3',val:{uid:my_data.uid,val:my_data.lights}})

	},
	
	check_coins(prv_tm_fbs, no_prv_coins){
		
		//от файербейса
		if(prv_tm_fbs){
			this.prv_tm=prv_tm_fbs			
			objects.pref_coins_info.text=my_data.coins
		}
		
		//если это самый первый заход
		if (no_prv_coins)
			this.prv_tm=0		
		
		//текущее время
		const tm=Date.now()+SERV_TM_DELTA
				
		if (this.prv_tm===0) this.prv_tm=tm		
					
		const d=tm-this.prv_tm
		const int_passed=Math.floor(d/(1000*60*60))
		if (int_passed>0){	
		
			//уменьшаем только для рейтинговых игроков
			if (my_data.rating>MAX_NO_CONF_RATING)
				this.change_coins(-int_passed)
			
			this.prv_tm=tm
			
			//закончились монеты
			if (my_data.rating>MAX_NO_CONF_RATING&&!my_data.coins){	
				message.add(`У вас закончились кристаллы. Ваш рейтинг понижен до ${MAX_NO_CONF_RATING}`,6000)
				my_data.rating=MAX_NO_CONF_RATING
				fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating)
				//console.log('Ваше рейтинг понижен до: ',MAX_NO_CONF_RATING)
			}			
		}			
		
		this.check_coins_timer=setTimeout(()=>this.check_coins(),60000)
		
	},

	async change_name_down(){

		if (!serv_tm){
			this.send_info('Ошибка получения серверного времени(((');
			sound.play('locked');
			return;
		}

		if (my_data.games<200){
			this.send_info('Нужно сыграть 200 онлайн партий чтобы поменять имя(((');
			sound.play('locked');
			return;
		}

		//провряем можно ли менять ник
		if(this.hours_to_nick_change>0){
			this.send_info(`Имя можно поменять через ${this.hours_to_nick_change} ${this.getHoursEnding(this.hours_to_nick_change)}.`);
			sound.play('locked');
			return;
		}

		//получаем новое имя
		const name=await keyboard.read(15);
		if (name&&name.replace(/\s/g, '').length>3){

			//обновляем данные о времени
			my_data.nick_tm=serv_tm;
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm);

			my_data.name=name;
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name);

			this.update_buttons();

			objects.pref_name.set2(name,260);
			this.send_info('Вы изменили имя)))');
			sound.play('confirm_dialog');

		}else{
			this.send_info('Неправильное имя(((');
			anim2.add(objects.pref_info,{alpha:[0,1]}, false, 3,'easeBridge',false);
		}
	},

	async reset_avatar_down(){

		if (!serv_tm){
			this.send_info('Ошибка получения серверного времени(((');
			sound.play('locked');
			return;
		}

		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change}  ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked');
			return;
		}

		this.cur_pic_url=my_data.orig_pic_url;

		objects.pref_conf_photo_btn.visible=true;
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(my_data.orig_pic_url);
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;
	},

	async arrow_down(dir){

		if (!serv_tm){
			this.send_info('Ошибка получения серверного времени(((');
			sound.play('locked');
			return;
		}

		if (anim2.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change} ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked');
			return;
		}

		//перелистываем аватары
		this.avatar_swtich_cur+=dir;
		if (this.avatar_swtich_cur===this.avatar_switch_center){
			this.cur_pic_url=players_cache.players[my_data.uid].pic_url
		}else{
			this.cur_pic_url='mavatar'+this.avatar_swtich_cur;
		}

		objects.pref_conf_photo_btn.visible=true;
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(multiavatar(this.cur_pic_url));
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;



	},

	send_info(msg,timeout){

		objects.pref_info.text=msg;
		anim2.add(objects.pref_info,{alpha:[0,1]}, true, 0.25,'linear',false);
		clearTimeout(this.info_timer);
		this.info_timer=setTimeout(()=>{
			anim2.add(objects.pref_info,{alpha:[1,0]}, false, 0.25,'linear',false);
		},timeout||3000);
	},

	conf_photo_down(){

		my_data.avatar_tm=serv_tm;
		fbs.ref(`players/${my_data.uid}/pic_url`).set(this.cur_pic_url);
		fbs.ref(`players/${my_data.uid}/avatar_tm`).set(my_data.avatar_tm);

		this.send_info('Вы изменили фото)))');
		sound.play('confirm_dialog');


		this.update_buttons();

		//обновляем аватар в кэше
		players_cache.update_avatar_forced(my_data.uid,this.cur_pic_url).then(()=>{
			const my_card=objects.mini_cards.find(card=>card.uid===my_data.uid);
			my_card.avatar.set_texture(players_cache.players[my_data.uid].texture);
		})

	},

	conf_cards_down(){

		my_data.cards_style_id=this.cur_style_id;
		this.send_info('Вы изменили оформление колоды карт)))');
		objects.pref_conf_cards_btn.visible=false;

		//сохраняем обычные карты
		if (my_data.cards_style_id<5)
			fbs.ref('players/'+my_data.uid+'/cards_style_id').set(my_data.cards_style_id);

		sound.play('confirm_dialog');

	},

	sound_btn_down(){

		if(anim2.any_on()){
			sound.play('locked');
			return;
		}

		sound.switch();
		sound.play('click');
		const tar_x=sound.on?367:322;
		anim2.add(objects.pref_sound_slider,{x:[objects.pref_sound_slider.x,tar_x]}, true, 0.1,'linear');

	},

	close(){

		//убираем контейнер
		anim2.add(objects.pref_cont,{x:[objects.pref_cont.x,-800]}, false, 0.2,'linear');
		anim2.add(objects.pref_footer_cont,{y:[objects.pref_footer_cont.y,450]}, false, 0.2,'linear');

	},

	switch_to_lobby(){

		this.close();

		//показываем лобби
		anim2.add(objects.cards_cont,{x:[800,0]}, true, 0.2,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450,objects.lobby_footer_cont.sy]}, true, 0.2,'linear');

	},

	switch_shirt(dir){

		if(dir) sound.play('swift');

		this.cur_style_id+=dir;

		if (this.cur_style_id>9){
			sound.play('locked')
			this.cur_style_id=9;
			return;
		}

		if (this.cur_style_id<0){
			sound.play('locked')
			this.cur_style_id=0;
			return;
		}

		objects.pref_conf_cards_btn.visible=this.cur_style_id!==my_data.cards_style_id;
		objects.pref_shirt.set_shirt(this.cur_style_id);

		//премиальные колоды
		if (this.cur_style_id>=5){
			const unique_games_needed={5:5,6:10,7:15,8:20,9:25}[this.cur_style_id];
			const unique_opps=Object.keys(mp_game.unique_opps).length;

			if (unique_opps<unique_games_needed){
				objects.pref_premium_info.visible=true;
				objects.pref_premium_info.text=`Сыграйте ${unique_games_needed} онлайн игр с разными соперниками для получения доступа\n(сыграно: ${unique_opps}/${unique_games_needed})`;
				objects.pref_conf_cards_btn.visible=false;
			}else{
				objects.pref_premium_info.visible=false;
			}
		}else{
			objects.pref_premium_info.visible=false;
		}

		const rand_suit = ['h','d','s','c'][irnd(0,3)];
		const rand_val = ['6','7','8','9','10','J','Q','K','T'][irnd(0,8)];
		objects.pref_open.set(rand_suit,rand_val);
		objects.pref_open.unshirt(this.cur_style_id);

	},

	ok_btn_down(){

		if(anim2.any_on()){
			sound.play('locked');
			return;
		}

		sound.play('click');
		this.switch_to_lobby();

	}

}

main_menu= {

	async activate() {

		some_process.main_menu = this.process;
		anim2.add(objects.mb_cont,{x:[800,objects.mb_cont.sx]}, true, 1,'easeInOutCubic');
		if (!objects.game_title.visible)
			anim2.add(objects.game_title,{y:[-300,objects.game_title.sy]}, true, 1,'easeInOutCubic');
		//objects.desktop.texture = assets.desktop;
		//anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.6,'linear');
	},

	process () {

	},

	async close() {

		//some_process.main_menu = function(){};
		objects.mb_cont.visible=false;
		some_process.main_menu_process = function(){};
		anim2.add(objects.mb_cont,{x:[objects.mb_cont.x,800]}, false, 1,'easeInOutCubic');
		anim2.add(objects.game_title,{y:[objects.game_title.y,-300]}, false, 1,'linear');
		//await anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.6,'linear');
	},

	async pb_down () {

		if (anim2.any_on()|| objects.id_cont.visible === true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lobby.activate();

	},

	async lb_button_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lb.show();

	},

	async rules_button_down () {

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		anim2.add(objects.rules,{scale_x:[0,0.666]}, true, 0.2,'linear');

	},

	rules_close_down() {

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		anim2.add(objects.rules,{scale_x:[0.666,0]}, false, 0.2,'linear');

	},

	async chat_button_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();

		chat.activate();

	},


}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	last_update:0,

	show() {

		objects.bcg.texture=assets.lb_bcg;
		anim2.add(objects.bcg,{alpha:[0,1]}, true, 0.5,'linear');

		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}

		if (Date.now()-this.last_update>120000){
			this.update();
			this.last_update=Date.now();
		}


	},

	close() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;
		objects.bcg.texture=assets.bcg;

	},

	back_button_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	async update() {

		let leaders=await fbs.ref('players').orderByChild('rating').limitToLast(20).once('value');
		leaders=leaders.val();

		const top={
			0:{t_name:objects.lb_1_name,t_rating:objects.lb_1_rating,avatar:objects.lb_1_avatar},
			1:{t_name:objects.lb_2_name,t_rating:objects.lb_2_rating,avatar:objects.lb_2_avatar},
			2:{t_name:objects.lb_3_name,t_rating:objects.lb_3_rating,avatar:objects.lb_3_avatar},
		}

		for (let i=0;i<7;i++){
			top[i+3]={};
			top[i+3].t_name=objects.lb_cards[i].name;
			top[i+3].t_rating=objects.lb_cards[i].rating;
			top[i+3].avatar=objects.lb_cards[i].avatar;
		}

		//создаем сортированный массив лидеров
		const leaders_array=[];
		Object.keys(leaders).forEach(uid => {

			const leader_data=leaders[uid];
			const leader_params={uid,name:leader_data.name, rating:leader_data.rating, pic_url:leader_data.pic_url};
			leaders_array.push(leader_params);

			//добавляем в кэш
			players_cache.update(uid,leader_params);
		});

		//сортируем....
		leaders_array.sort(function(a,b) {return b.rating - a.rating});

		//заполняем имя и рейтинг
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			target.t_name.set2(leader.name,place>2?190:130);
			target.t_rating.text=leader.rating;
		}

		//заполняем аватар
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			await players_cache.update_avatar(leader.uid);
			target.avatar.set_texture(players_cache.players[leader.uid].texture)
		}

	}


}

snow={

	prv_time:0,
	on:0,
	snow_start_time:0,

	init(){
		fbs.ref('snow').on('value', function(data){snow.snow_event(data.val())});
		this.check_snow_end();
	},

	send_start(){

		fbs.ref('snow').set({tm:firebase.database.ServerValue.TIMESTAMP,name:'q'});

	},

	snow_event(data){

		if(data){
			this.start();
			this.snow_start_time=data.tm;
		}
		else{
			this.kill_snow();
		}
	},

	async check_snow_end(){

		//ждем немного
		await new Promise((resolve, reject) => setTimeout(resolve, 3000));

		if (!this.on) return;

		//устанавливаем текущее время
		await fbs.ref('server_time').set(firebase.database.ServerValue.TIMESTAMP);

		//ждем немного
		await new Promise((resolve, reject) => setTimeout(resolve, 3000));

		//получаем время
		const server_time=await fbs_once('server_time');

		//если снег идет слишком много то выключаем его
		if (server_time-this.snow_start_time>3600000)
			fbs.ref('snow').set(0);

	},

	start(){
		this.on=1;
		objects.snowflakes.forEach(s=>s.visible=false);
		anim2.add(objects.snow_cont,{alpha:[0, 1]}, true, 0.25,'linear',false);
		some_process.snow=function(){snow.process()};
	},

	kill_snow(){
		this.on=0;
		if (!objects.snow_cont.visible) return;
		some_process.snow=function(){};
		anim2.add(objects.snow_cont,{alpha:[1, 0]}, false, 3,'linear',false);
	},

	change_dir(snowflake){

		const ang=180+irnd(-20,20);
		snowflake.dx=Math.sin(ang*0.01745);
		snowflake.dy=-Math.cos(ang*0.01745);

	},

	process(){

		const cur_time=Date.now();
		if (cur_time-this.prv_time>300){

			const snowflake=objects.snowflakes.find(s=>!s.visible);

			if (snowflake){

				snowflake.x=irnd(0,800);
				snowflake.y=-30;
				snowflake.visible=true;

				snowflake.d_ang=Math.random()*2-1;
				snowflake.angle=irnd(0,360);
				const size=Math.random()*2+1
				snowflake.speed=size*0.4;
				snowflake.scale_xy=size*0.25;
				snowflake.alpha=size/4;

				this.change_dir(snowflake);

			}

			this.prv_time=cur_time;
		}



		for (let i=0;i<objects.snowflakes.length;i++){
			const snowflake=objects.snowflakes[i];
			if (!snowflake.visible) continue;

			snowflake.x+=snowflake.dx*snowflake.speed;
			snowflake.y+=snowflake.dy*snowflake.speed;
			snowflake.angle+=snowflake.d_ang;
			if (snowflake.y>480)
				snowflake.visible=false;
		}

	}

}

stickers={

	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel() {


		if (objects.big_msg_cont.visible === true || objects.req_cont.visible === true || objects.stickers_cont.ready===false) {
			return;
		}



		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 0.5,'easeOutBack');

	},

	hide_panel() {

		//game_res.resources.close.sound.play();

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	async send(id) {

		if (objects.big_msg_cont.visible === true || objects.req_cont.visible === true || objects.stickers_cont.ready===false) {
			return;
		}

		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		message.add('Стикер отправлен сопернику');

		//показываем какой стикер мы отправили
		//objects.sent_sticker_area.texture=assets['sticker_texture_'+id];
		//await anim2.add(objects.sent_sticker_area,{alpha:[0, 0.5]}, true, 0.5,'linear');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 2000)
			}
		);

		if (res === "forced")
			return;

		//await anim2.add(objects.sent_sticker_area,{alpha:[0.5, 0]}, false, 0.5,'linear');
	},

	async receive(id) {


		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive("forced");

		//воспроизводим соответствующий звук
		sound.play('receive_sticker')

		objects.rec_sticker_area.texture=assets['sticker_texture_'+id];

		await anim2.add(objects.rec_sticker_area,{x:[-150, objects.rec_sticker_area.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 2000)
			}
		);

		if (res === "forced")
			return;

		anim2.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.sx, -150]}, false, 0.5,'easeInBack');

	}

}

bg={
	
	sec_to_start:999,
	timer:0,
	i:0,
	on:0,
	btn_anim_timer:0,
	
	async activate(){
		
		this.on=1
		
		//анимация кнопки
		this.btn_anim_timer=setInterval(()=>{
			if (!objects.invite_waiting_anim.visible)
				anim2.add(objects.invite_waiting_anim,{x:[100, 230],alpha:[1,0]},false,0.5,'linear');
		},2000)	
		
		//просто счетчик секунд
		this.i=0
					
		//обновляем все данные
		this.update_all()
		
		//сразу записываемся в игроки
		my_ws.safe_send({cmd:'set_no_event',path:'bg/p/'+my_data.uid,val:'TMS'})
		
		this.timer=setInterval(()=>{
			this.process()
		},1000)	
		
	},
	
	async update_all(){
		
		console.log('update_all')
		const bg_data=await my_ws.get('bg')
		this.update_time(bg_data.t)
		this.update_players(bg_data.p)
		
	},	
	
	async update_time(inp_t){
		
		console.log('update_time')
		const t=inp_t||await my_ws.get('bg/t')||999
		this.sec_to_start=t
		if(inp_t)
			this.draw_sec_to_start()
		
	},
	
	async update_players(inp_p){
		
		console.log('update_players')
		const p=inp_p||await my_ws.get('bg/p')
		objects.invite_bg_players.text='Количество участников: '+Object.keys(p).length	
		
	},
	
	process(){
		
		//console.log('process_call',Date.now())
		
		this.sec_to_start--
		this.draw_sec_to_start()
		
		my_ws.safe_send({cmd:'set_no_event',path:'bg/p/'+my_data.uid,val:'TMS'})
		
		if (this.i===4||this.i===8)
			this.update_players()
		
		if (this.i===11){
			this.update_time()			
			this.i=0		
		}

		this.i++		
	},
	
	stop(){
		
		this.on=0
		clearInterval(this.timer)
		clearInterval(this.btn_anim_timer)
		my_ws.safe_send({cmd:'remove',path:'bg/p/'+my_data.uid})
	},	
	
	draw_sec_to_start(){		
	
		if (this.sec_to_start<0) this.sec_to_start=0
		
		const minutes = Math.floor(this.sec_to_start/60)
		const remainingSeconds = this.sec_to_start % 60
		const formattedMinutes = String(minutes)
		const formattedSeconds = String(remainingSeconds).padStart(2, '0')		
		objects.invite_rating.text=formattedMinutes+":"+formattedSeconds	
			
	}
	
}

lobby={

	state_tint :{},
	_opp_data : {},
	activated:false,
	rejected_invites:{},
	fb_cache:{},
	first_run:0,
	bot_on:1,
	on:0,
	global_players:{},
	req_hist:[],
	hide_inst_msg_timer:0,
	sec_befor_bg:0,

	activate(room,bot_on) {

		//первый запуск лобби
		if (!this.activated){
			//расставляем по соответствующим координатам
			
			if (safe_ls('durak_info_checked'))
				objects.lobby_info_btn.alpha=0.2
			else
				objects.lobby_info_btn.alpha=1
			
			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4;
				objects.mini_cards[i].y=50+iy*80;

				let ix;
				if (i>15) {
					ix=~~((i-16)/4)
					objects.mini_cards[i].x=815+ix*190;
				}else{
					ix=~~((i)/4)
					objects.mini_cards[i].x=15+ix*190;
				}
			}

			this.activated=true;
		}

		//objects.bcg.texture=gres.lobby_bcg.texture;
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;
		this.on=1;

		//отключаем все карточки
		for(let i=0;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;

		//процессинг
		clearInterval(this.process_timer)
		this.process_timer=setInterval(()=>{
			this.process()
		},500)

		//добавляем карточку бота если надо
		if (bot_on!==undefined) this.bot_on=bot_on;
		this.starting_card=0;
		if (this.bot_on){
			this.starting_card=1;
			this.add_card_ai();
		}


		//убираем старое и подписываемся на новую комнату
		if (room){
			if(room_name){
				fbs.ref(room_name).off('value');
				fbs.ref(room_name+'/'+my_data.uid).remove();
			}
			room_name=room;
		}

		fbs.ref(room_name).on('child_changed', snapshot => {
			const val=snapshot.val()
			//console.log('child_changed',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(room_name).on('child_added', snapshot => {
			const val=snapshot.val()
			//console.log('child_added',snapshot.key,val,JSON.stringify(val).length)
			this.global_players[snapshot.key]=val;
			lobby.players_list_updated(this.global_players);
		});
		fbs.ref(room_name).on('child_removed', snapshot => {
			const val=snapshot.val()
			//console.log('child_removed',snapshot.key,val,JSON.stringify(val).length)
			delete this.global_players[snapshot.key];
			lobby.players_list_updated(this.global_players);
		});


		fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();

		set_state({state : 'o'});

		//создаем заголовки
		const room_desc='КОМНАТА #'+room_name.slice(6);
		objects.t_room_name.text=room_desc;

	},

	change_room(new_room){

		//создаем заголовки
		const room_desc='КОМНАТА #'+new_room.slice(6);
		objects.t_room_name.text=room_desc;

		//отписываемся от изменений текущей комнаты
		fbs.ref(room_name).off('value');

		//анимации разные
		anim2.add(objects.cards_cont,{alpha:[0, 1]}, true, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy]}, true, 0.1,'linear');
		anim2.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy]}, true, 0.1,'linear');
		objects.cards_cont.x=0;

		//отключаем все карточки
		objects.mini_cards.forEach(c=>c.visible=false);

		room_name=new_room;

		set_state ({state : 'o'});

		//бота нету
		this.bot_on=0;

		//подписываемся на изменения состояний пользователей
		fbs.ref(room_name).on('value', snapshot => {lobby.players_list_updated(snapshot.val());});

	},

	pref_btn_down(){

		//если какая-то анимация
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_pref_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_pref_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);

		//убираем контейнер
		anim2.add(objects.cards_cont,{x:[objects.cards_cont.x,800]}, false, 0.2,'linear');
		anim2.add(objects.pref_cont,{x:[-800,objects.pref_cont.sx]}, true, 0.2,'linear');

		//меняем футер
		anim2.add(objects.lobby_footer_cont,{y:[objects.lobby_footer_cont.y,450]}, false, 0.2,'linear');
		anim2.add(objects.pref_footer_cont,{y:[450,objects.pref_footer_cont.sy]}, true, 0.2,'linear');
		pref.activate();

	},

	players_list_updated(players) {

		//если мы в игре то пока не обновляем карточки
		if (state==='p'||state==='b')
			return;
		
		
		//конвертируем сокращенные данные начали 25.06.2025, нужно позже перейти полностью на сокращенный режим
		for (let uid in players){	
			
			const player=players[uid]
			if (player.n)
				player.name=player.n
			if (player.r)
				player.rating=player.r
			if (player.s)
				player.state=player.s
			if (player.h)
				player.hidden=player.hidden
			if (player.g)
				player.game_id=player.g
		}
		

		//это столы
		let tables = {};

		//это свободные игроки
		let single = {};

		//удаляем инвалидных игроков
		for (let uid in players){
			if(!players[uid].name||!players[uid].rating||!players[uid].state)
				delete players[uid];
		}

		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));

		//создаем массив свободных игроков и обновляем кэш
		for (let uid in players){

			const player=players[uid];

			//обновляем кэш с первыми данными
			players_cache.update(uid,{name:player.name,rating:player.rating,hidden:player.hidden});

			if (player.state!=='p'&&!player.hidden)
				single[uid] = player.name;
		}

		//console.table(single);

		//оставляем только тех кто за столом
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];

		//дополняем полными ид оппонента
		for (let uid in p_data) {
			const small_opp_id = p_data[uid].opp_id;
			//проходимся по соперникам
			for (let uid2 in players) {
				let s_id=uid2.substring(0,10);
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}
			}
		}


		//определяем столы
		for (let uid in p_data) {
			const opp_id = p_data[uid].opp_id;
			if (p_data[opp_id]) {
				if (uid === p_data[opp_id].opp_id && !tables[uid]) {
					tables[uid] = opp_id;
					delete p_data[opp_id];
				}
			}
		}

		//считаем сколько одиночных игроков и сколько столов
		const num_of_single = Object.keys(single).length;
		const num_of_tables = Object.keys(tables).length;
		const num_of_cards = num_of_single + num_of_tables;

		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			const num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);
			const num_of_tables_to_cut = num_of_tables - num_of_tables_cut;

			//удаляем столы которые не помещаются
			const t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {
				const card_uid = objects.mini_cards[i].uid;
				if (single[card_uid] === undefined)
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state, rating:players[card_uid].rating, name:players[card_uid].name});
			}
		}

		//определяем новых игроков которых нужно добавить
		new_single = {};

		for (let p in single) {

			let found = 0;
			for(let i=0;i<objects.mini_cards.length;i++) {

				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {
					if (p ===  objects.mini_cards[i].uid) {
						found = 1;
					}
				}
			}

			if (found === 0)
				new_single[p] = single[p];
		}

		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			if (objects.mini_cards[i].visible && objects.mini_cards[i].type === 'table') {

				const uid1 = objects.mini_cards[i].uid1;
				const uid2 = objects.mini_cards[i].uid2;

				let found = 0;

				for (let t in tables) {
					const t_uid1 = t;
					const t_uid2 = tables[t];
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;
					}
				}

				if (found === 0)
					objects.mini_cards[i].visible = false;
			}
		}

		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)
			this.place_new_card({uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем НОВЫЕ столы где свободно
		for (let uid in tables) {
			const name1=players[uid].name
			const name2=players[tables[uid]].name

			const rating1= players[uid].rating
			const rating2= players[tables[uid]].rating

			const _game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1, name2, rating1, rating2,_game_id});
		}

	},

	add_card_ai() {

		const card=objects.mini_cards[0]

		//убираем элементы стола так как они не нужны
		card.rating_text1.visible = false;
		card.rating_text2.visible = false;
		card.avatar1.visible = false;
		card.avatar2.visible = false;
		card.avatar1_frame.visible = false;
		card.avatar2_frame.visible = false;
		card.table_rating_hl.visible = false;
		card.bcg.texture=assets.mini_player_card_ai;

		card.visible=true;
		card.uid='bot';
		card.name=card.name_text.text='Бот';
		
		card.type='bot'
		card.rating=1400;
		card.rating_text.text = card.rating;
		card.avatar.set_texture(assets.pc_icon);

		//также сразу включаем его в кэш
		if(!players_cache.players.bot){
			players_cache.players.bot={};
			players_cache.players.bot.name='Бот';
			players_cache.players.bot.rating=1400;
			players_cache.players.bot.texture=assets.pc_icon;
		}
	},

	get_state_texture(s,uid) {

		switch(s) {

			case 'o':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card_bot;
			break;

			case 'p':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card;
			break;

		}
	},

	place_table(params={uid1:0,uid2:0,name1: 'X',name2:'X', rating1: 1400, rating2: 1400,game_id:0}) {


		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state);
				card.state=params.state;

				card.type = "table";

				card.bcg.texture = assets.mini_player_card_table;

				//присваиваем карточке данные
				//card.uid=params.uid;
				card.uid1=params.uid1;
				card.uid2=params.uid2;

				//убираем элементы свободного стола
				card.rating_text.visible = false;
				card.avatar.visible = false;
				card.avatar_frame.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.name_text.visible = false;

				//Включаем элементы стола
				card.table_rating_hl.visible=true;
				card.rating_text1.visible = true;
				card.rating_text2.visible = true;
				card.avatar1.visible = true;
				card.avatar2.visible = true;
				card.avatar1_frame.visible = true;
				card.avatar2_frame.visible = true;
				//card.rating_bcg.visible = true;

				card.rating_text1.text = params.rating1;
				card.rating_text2.text = params.rating2;

				card.name1 = params.name1;
				card.name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:card.avatar1});

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:card.avatar2});


				card.visible=true;
				card.game_id=params.game_id;

				break;
			}
		}

	},

	update_existing_card(params={id:0, state:'o' , rating:1400, name:''}) {

		//устанавливаем цвет карточки в зависимости от состояния( аватар не поменялись)
		const card=objects.mini_cards[params.id];
		card.bcg.texture=this.get_state_texture(params.state,card.uid);
		card.state=params.state;

		card.name_text.set2(params.name,105);
		card.rating=params.rating;
		card.rating_text.text=params.rating;
		card.visible=true;
	},

	place_new_card(params={uid:0, state: 'o', name:'X ', rating: rating}) {

		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			//ссылка на карточку
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state,params.uid);
				card.state=params.state;

				card.type = 'single';

				//присваиваем карточке данные
				card.uid=params.uid;

				//убираем элементы стола так как они не нужны
				card.rating_text1.visible = false;
				card.rating_text2.visible = false;
				card.avatar1.visible = false;
				card.avatar2.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.table_rating_hl.visible=false;

				//включаем элементы одиночной карточки
				card.rating_text.visible = true;
				card.avatar.visible = true;
				card.avatar_frame.visible = true;
				card.name_text.visible = true;

				card.name=params.name;
				card.name_text.set2(params.name,105);
				card.rating=params.rating;
				card.rating_text.text=params.rating;

				card.visible=true;

				//стираем старые данные
				card.avatar.set_texture();

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:card.avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async load_avatar2 (params={}) {

		//обновляем или загружаем аватарку
		await players_cache.update_avatar(params.uid);

		//устанавливаем если это еще та же карточка
		params.tar_obj.set_texture(players_cache.players[params.uid].texture);
	},

	card_down(card_id) {

		const card=objects.mini_cards[card_id]
		
		if (card.type==='table')
			this.show_table_dlg(card)
			
		if (card.type==='single')
			this.show_invite_dlg(card.uid)
			
		if (card.type==='bot')
			this.show_invite_dlg('bot')
			
		if (card.type==='blind_game')
			this.show_invite_dlg('blind_game')
			
		/*if (objects.mini_cards[card_id].type === 'bot')
			this. (card_id);
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);

		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);*/

	},
		
	show_invite_dlg(uid) {

		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');

		sound.play('click')
		
		//очищаем ожидание на всякий случай
		if (bg.on) bg.stop()
		

		if(uid==='bot'){
		
			objects.invite_avatar.set_texture(assets.pc_icon)
			objects.invite_feedback.visible=true
			objects.fb_delete_btn.visible=false
			objects.invite_waiting_anim.visible=false
			objects.invite_btn.visible=true
			objects.invite_name.text='Бот'
			objects.invite_rating.text='1400'
			objects.invite_no_close.visible=false
			objects.invite_rating.visible=true
			objects.invite_bg_players.visible=false
			this.show_feedbacks(uid)
			objects.invite_btn.texture=assets.invite_btn
			objects.invite_btn.pointerdown=()=>{
				if (anim2.any_on()) return
				lobby.close()
				sp_game.activate('master')
			}
			return
		}
		
		if(uid==='blind_game'){
		
			objects.invite_avatar.set_texture(assets.blind_game_icon)
			objects.invite_name.text='Слепая игра'
			objects.invite_feedback.visible=false
			objects.fb_delete_btn.visible=false
			objects.invite_btn.visible=true
			objects.invite_waiting_anim.visible=false
			objects.invite_no_close.visible=false
			objects.invite_rating.visible=false
			objects.invite_bg_players.visible=false
			objects.invite_btn.texture=assets.invite_blind_img
			
			//проверка штрафа за отказ в игре
			const bg_next_time=safe_ls('durak_bg_stop')||0
			const tm=Date.now()
			if (tm<bg_next_time){
				objects.invite_btn.visible=false
				objects.invite_name.text='Слепая игра недосупна'
				return
			}
						
			//нажатие кнопки
			objects.invite_btn.pointerdown=()=>{				
				
				if (anim2.any_on()) return
				if (bg.on) return
				objects.invite_btn.texture=assets.invite_wait_img	
				objects.invite_no_close.visible=true
				objects.invite_rating.visible=true
				objects.invite_bg_players.visible=true
				
				//получаем данные и включаем отсчет
				bg.activate()		
				
			}
			return
		}
		
		if(uid){
			
			objects.invite_avatar.set_texture(players_cache.players[uid].texture)
			objects.invite_name.text=players_cache.players[uid].name
			objects.invite_rating.text=players_cache.players[uid].rating
			this.show_feedbacks(uid)
			objects.invite_feedback.visible=true
			objects.invite_waiting_anim.visible=false		
			objects.invite_btn.visible=true
			objects.invite_btn.texture=assets.invite_btn
			objects.invite_no_close.visible=false
			objects.invite_rating.visible=true
			objects.invite_bg_players.visible=false
			
			objects.invite_btn.visible=uid!==my_data.uid
			objects.fb_delete_btn.visible=uid===my_data.uid
						
			//слишком частые приглашения, удаляем старые данные
			const tm=Date.now();
			this.req_hist = this.req_hist.filter(item=>item.tm>tm-60000);
			if (this.req_hist.filter(item=>item.uid===uid).length>3) objects.invite_btn.visible=false
						
			//если мы в списке игроков которые нас недавно отврегли
			if (this.rejected_invites[uid] && tm-this.rejected_invites[uid]<60000) objects.invite_btn.visible=false
				
			objects.invite_btn.pointerdown=()=>{
				if (anim2.any_on()||objects.invite_btn.texture===assets.invite_wait_img) return
				sound.play('click')
				objects.invite_btn.texture=assets.invite_wait_img
				fbs.ref(`inbox/${uid}`).set({sender:my_data.uid,message:'INV',tm:Date.now()})
				pending_player=uid
				const tm=Date.now()
				this.req_hist.push({uid:pending_player,tm})
			}		
		}		
	},
	
	async show_invite_dlg_from_chat(uid) {
				
		if (anim2.any_on() || pending_player!=='') return
		this.show_invite_dlg(uid)	
		
	},
	
	close_invite_dialog() {

		sound.play('click');

		//очищаем ожидание на всякий случай
		if (bg.on) bg.stop()

		if (!objects.invite_cont.visible) return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref('inbox/'+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim2.add(objects.invite_cont,{x:[objects.invite_cont.x, 800]}, false, 0.15,'linear');
	},

	show_table_dlg(card) {


		//если какая-то анимация или открыт диалог
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};

		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();

		anim2.add(objects.td_cont,{x:[800, objects.td_cont.sx]}, true, 0.1,'linear');

		objects.td_cont.card=card;

		objects.td_avatar1.set_texture(players_cache.players[card.uid1].texture);
		objects.td_avatar2.set_texture(players_cache.players[card.uid2].texture);

		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;

		objects.td_name1.set2(card.name1, 240);
		objects.td_name2.set2(card.name2, 240);

	},

	close_table_dialog() {
		sound.play('click');
		anim2.add(objects.td_cont,{x:[objects.td_cont.x, 800]}, false, 0.1,'linear');
	},

	fb_delete_down(){

		objects.fb_delete_btn.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:['***нет отзывов***',999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);

		message.add('Отзывы удалены')

	},

	async show_feedbacks(uid) {

		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {

			fb_obj =await fbs_once("fb/" + uid);

			//сохраняем в кэше отзывов
			this.fb_cache[uid]={};
			this.fb_cache[uid].tm=Date.now();
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;
			}else{
				fb_obj={0:['***нет отзывов***',999,' ']};
				this.fb_cache[uid].fb_obj=fb_obj;
			}

			//console.log('загрузили фидбэки в кэш')

		} else {
			fb_obj =this.fb_cache[uid].fb_obj;
			//console.log('фидбэки из кэша ,ура')
		}



		var fb = Object.keys(fb_obj).map((key) => [fb_obj[key][0],fb_obj[key][1],fb_obj[key][2]]);

		//сортируем отзывы по дате
		fb.sort(function(a,b) {
			return b[1]-a[1]
		});


		//сначала убираем все фидбэки
		objects.feedback_records.forEach(fb=>fb.visible=false)

		let prv_fb_bottom=0;
		const fb_cnt=Math.min(fb.length,objects.feedback_records.length);
		for (let i = 0 ; i < fb_cnt;i++) {
			const fb_place=objects.feedback_records[i];

			let sender_name =  fb[i][2] || 'Неизв.';
			if (sender_name.length > 10) sender_name = sender_name.substring(0, 10);
			fb_place.set(sender_name,fb[i][0]);


			const fb_height=fb_place.text.textHeight*0.85;
			const fb_end=prv_fb_bottom+fb_height;

			//если отзыв будет выходить за экран то больше ничего не отображаем
			const fb_end_abs=fb_end+objects.invite_cont.y+objects.invite_feedback.y;
			if (fb_end_abs>450) return;

			fb_place.visible=true;
			fb_place.y=prv_fb_bottom;
			prv_fb_bottom+=fb_height;
		}

	},

	async close() {

		if (objects.invite_cont.visible === true)
			this.close_invite_dialog();

		if (objects.td_cont.visible === true)
			this.close_table_dialog();
		
		//отключаем таймер
		if (bg.on) bg.stop()

		clearInterval(this.process_timer)

		if (objects.pref_cont.visible)
			pref.close();

		//плавно все убираем
		anim2.add(objects.cards_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		anim2.add(objects.lobby_footer_cont,{y:[ objects.lobby_footer_cont.y,450]}, false, 0.2,'linear');
		anim2.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-50]}, false, 0.2,'linear');

		this.on=0;

		//больше ни ждем ответ ни от кого
		pending_player="";

		//отписываемся от изменений состояний пользователей
		fbs.ref(room_name).off();

	},

	async inst_message(data){
		
		clearTimeout(this.hide_inst_msg_timer)

		//когда ничего не видно не принимаем сообщения
		if(!objects.cards_cont.visible) return;

		await players_cache.update(data.uid);
		await players_cache.update_avatar(data.uid);

		sound.play('inst_msg');
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);
		objects.inst_msg_avatar.texture=players_cache.players[data.uid].texture||PIXI.Texture.WHITE;
		objects.inst_msg_text.set2(data.msg,290);
		objects.inst_msg_cont.tm=Date.now()
		
		this.hide_inst_msg_timer=setTimeout(()=>{
			anim2.add(objects.inst_msg_cont,{alpha:[1, 0]},false,0.4,'linear')
		},7000)
	},

	get_room_index_from_rating(){
		//номер комнаты в зависимости от рейтинга игрока
		const rooms_bins=[0,1366,1437,1580,9999];
		let room_to_go='state1';
		for (let i=1;i<rooms_bins.length;i++){
			const f=rooms_bins[i-1];
			const t=rooms_bins[i];
			if (my_data.rating>f&&my_data.rating<=t)
				return i;
		}
		return 1;

	},

	process(){
		
		//objects.mini_cards[0].type='blind_game'
		//return
		
		//проверка слепой игры
		if (my_data.rating<1600) return
		
		const tm=Date.now()
		const card0=objects.mini_cards[0]
		const date = new Date(tm+SERV_TM_DELTA)
		const msk_hour = parseInt(date.toLocaleString('en-US', {timeZone: 'Europe/Moscow', hour: 'numeric',hour12: false}))
		const bg_time=msk_hour===18||msk_hour===19
		
		if (card0.type==='bot'&&bg_time){
			card0.type='blind_game'
			card0.avatar.set_texture(assets.blind_game_icon)
			card0.rating_text.visible=false
			card0.name_text.text='Слепая\nигра'
		}
		
		if (card0.type==='blind_game'&&!bg_time){
			card0.type='bot'
			card0.avatar.set_texture(assets.pc_icon)
			card0.rating_text.visible=true
			card0.name_text.text='Бот'
		}

	},

	async blind_game_call(data){
	
		if (!bg.on) return
		
		//закрываем меню и начинаем игру
		await lobby.close();

		opp_data.uid=data.opp_uid		
		
		//устанаваем окончательные данные оппонента
		await players_cache.update(data.opp_uid)
		await players_cache.update_avatar(data.opp_uid)
		game_id=+data.s
		mp_game.activate(data.r?'master':'slave',data.s,1)
		
	},

	wheel_event(dir) {

	},

	async fb_my_down() {


		if (this._opp_data.uid !== my_data.uid || objects.feedback_cont.visible === true)
			return;

		let fb = await feedback.show(this._opp_data.uid);

		//перезагружаем отзывы если добавили один
		if (fb[0] === 'sent') {
			let fb_id = irnd(0,50);
			await fbs.ref("fb/"+this._opp_data.uid+"/"+fb_id).set([fb[1], firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.show_feedbacks(this._opp_data.uid);
		}

	},

	rejected_invite(msg) {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.close_invite_dialog();
		if(msg==='REJECT_ALL')
			big_msg.show({t1:'Соперник пока не принимает приглашения.'});
		else
			big_msg.show({t1:'Соперник отказался от игры. Повторить приглашение можно через 1 минуту.',t2:'---'});
	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();

		//фиксируем айди соперника
		opp_data.uid=pending_player;

		//закрываем меню и начинаем игру
		await lobby.close();
		mp_game.activate('master',seed);

	},

	chat_btn_down(){
		if (anim2.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_chat_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_chat_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);

		this.close();
		chat.activate();

	},

	async lb_btn_down() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);


		await this.close();
		lb.show();
	},

	list_btn_down(dir){

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*800;


		//подсветка
		const tar_btn={'-1':objects.lobby_left_btn,'1':objects.lobby_right_btn}[dir];
		objects.lobby_btn_hl.x=tar_btn.x;
		objects.lobby_btn_hl.y=tar_btn.y;
		anim2.add(objects.lobby_btn_hl,{alpha:[0,1]}, false, 0.25,'ease3peaks',false);


		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}

		anim2.add(objects.cards_cont,{x:[cur_x, new_x]},true,0.2,'easeInOutCubic');
	},

	async back_btn_down () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	},

	info_btn_down(){

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		safe_ls('durak_info_checked',1)
		anim2.add(objects.info_cont,{alpha:[0,1]}, true, 0.25,'linear');

	},

	info_close_down(){

		if (anim2.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('close');

		anim2.add(objects.info_cont,{alpha:[1,0]}, false, 0.25,'linear');

	}

}

players_cache={

	players:{},

	async my_texture_from(pic_url){

		//если это мультиаватар
		if(pic_url.includes('mavatar')) pic_url=multiavatar(pic_url);

		try{
			const texture = await PIXI.Texture.fromURL(pic_url);
			return texture;
		}catch(er){
			return PIXI.Texture.WHITE;
		}

	},

	async update(uid,params={}){

		//если игрока нет в кэше то создаем его
		if (!this.players[uid]) this.players[uid]={}

		//ссылка на игрока
		const player=this.players[uid]

		//заполняем параметры которые дали
		for (let param in params) player[param]=params[param]

		if (!player.name) player.name=await fbs_once('players/'+uid+'/name')
		if (!player.rating) player.rating=await fbs_once('players/'+uid+'/rating')


	},

	async update_avatar(uid){

		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);

		//если текстура уже есть
		if (player.texture) return;

		//если нет URL
		if (!player.pic_url) player.pic_url=await fbs_once('players/'+uid+'/pic_url');

		if(player.pic_url==='https://vk.com/images/camera_100.png')
			player.pic_url='https://akukamil.github.io/domino/vk_icon.png';

		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);

	},

	async update_avatar_forced(uid, pic_url){

		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);

		if(pic_url==='https://vk.com/images/camera_100.png')
			pic_url='https://akukamil.github.io/domino/vk_icon.png';

		//сохраняем
		player.pic_url=pic_url;

		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);

	},

}

auth={

	load_script(src) {
	  return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.onload = () => resolve(1)
        script.onerror = () => resolve(0)
        script.src = src
        document.head.appendChild(script)
	  })
	},

	get_random_name(e_str) {

		let rnd_names = ['Gamma','Жираф','Зебра','Тигр','Ослик','Мамонт','Волк','Лиса','Мышь','Сова','Hot','Енот','Кролик','Бизон','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
		let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		if (e_str !== undefined) {

			let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
			e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);
			let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;
			e_num2 = e_num2.substring(0, 3);
			return rnd_names[e_num1] + e_num2;

		} else {

			let rnd_num = irnd(0, rnd_names.length - 1);
			let rand_uid = irnd(0, 999999)+ 100;
			let name_postfix = rand_uid.toString().substring(0, 3);
			let name =	rnd_names[rnd_num] + name_postfix;
			return name;
		}

	},

	get_random_char() {

		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];

	},

	get_random_uid_for_local (prefix) {

		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();

		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('durak_uid', uid);
		} catch (e) {alert(e)}

		return uid;

	},

	search_in_local_storage () {

		//ищем в локальном хранилище
		let local_uid = null;

		try {
			local_uid = localStorage.getItem('durak_uid');
		} catch (e) {alert(e)}

		if (local_uid !== null) return local_uid;

		return undefined;

	},

	async init() {

		if (game_platform === 'YANDEX') {


			try {await this.load_script('https://yandex.ru/games/sdk/v2')} catch (e) {alert(e)};

			let _player;

			try {
				window.ysdk = await YaGames.init({});
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};

			my_data.name = _player.getName();
			my_data.uid = _player.getUniqueID().replace(/\//g, "Z");
			my_data.orig_pic_url = _player.getPhoto('medium');
			my_data.auth_mode=_player.getMode()==='lite'?0:1;

			if (my_data.orig_pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.orig_pic_url = 'mavatar'+my_data.uid;

			my_data.name = my_data.name || this.get_random_name(my_data.uid);

			return;
		}

		if (game_platform === 'VK') {

			game_platform = 'VK';

			await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')||await this.load_script('https://akukamil.github.io/common/vkbridge.js');

			let _player;

			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');
			} catch (e) {alert(e)};

			my_data.name = _player.first_name + ' ' + _player.last_name;
			my_data.uid = 'vk'+_player.id;
			my_data.orig_pic_url = _player.photo_100;
			my_data.auth_mode=1;

			return;

		}

		if (game_platform === 'DEBUG') {

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
			my_data.auth_mode=0;
			return;
		}

		if (game_platform === 'UNKNOWN') {

			//если не нашли платформу
			alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
			my_data.auth_mode=0;
		}

	}

}

top3={
	
	async activate(path){
		
		const top3=await my_ws.get(path||'day_top3')
		if(!top3) return
		const uids=Object.keys(top3)
		if (uids.length!==3) return
		
		await players_cache.update(uids[0])		
		objects.day_top3_name1.set2(players_cache.players[uids[0]].name,145)
		
		await players_cache.update(uids[1])		
		objects.day_top3_name2.set2(players_cache.players[uids[1]].name,145)
		
		await players_cache.update(uids[2])
		objects.day_top3_name3.set2(players_cache.players[uids[2]].name,145)
			
				
		await players_cache.update_avatar(uids[0])		
		objects.day_top3_avatar1.set_texture(players_cache.players[uids[0]].texture)
		
		await players_cache.update_avatar(uids[1])		
		objects.day_top3_avatar2.set_texture(players_cache.players[uids[1]].texture)
		
		await players_cache.update_avatar(uids[2])
		objects.day_top3_avatar3.set_texture(players_cache.players[uids[2]].texture)
		
		objects.day_top3_lights1.text=top3[uids[0]]
		objects.day_top3_lights2.text=top3[uids[1]]
		objects.day_top3_lights3.text=top3[uids[2]]
		
		some_process.top3_anim=()=>{this.process()}
		sound.play('top3')
		anim2.add(objects.day_top3_cont,{alpha:[0, 1]}, true, 0.5,'linear');
		
						
	},
	
	process(){
		
		objects.day_top3_sunrays.rotation+=0.01
		
	},
	
	close(){
		
		if (anim2.any_on()) {
			sound.play('locked')
			return
		}
		
		anim2.add(objects.day_top3_cont,{alpha:[1, 0]}, false, 0.5,'linear');
		
		
	}	
	
}

function resize() {

    const vpw = document.body.clientWidth;  // Width of the viewport
    const vph = document.body.clientHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	fbs.ref(room_name+'/'+my_data.uid).set({state:state,name:my_data.name, rating:my_data.rating, hidden:h_state, opp_id:small_opp_id});

}

tabvis={

	inactive_timer:0,
	sleep:0,

	change(){

		if (document.hidden){

			//start wait for
			this.inactive_timer=setTimeout(()=>{this.send_to_sleep()},120000);

		}else{

			if(this.sleep){
				console.log('Проснулись');
				my_ws.reconnect('wakeup');
				this.sleep=0;
			}

			clearTimeout(this.inactive_timer);
		}

		set_state({hidden : document.hidden});

	},

	send_to_sleep(){

		console.log('погрузились в сон')
		this.sleep=1;
		if (lobby.on){
			lobby.close();
			main_menu.activate();
		}
		my_ws.send_to_sleep();
	}

}

main_loader={

	preload_assets:0,

	spritesheet_to_tex(t,xframes,yframes,total_w,total_h,xoffset,yoffset){


		const frame_width=xframes?total_w/xframes:0;
		const frame_height=yframes?total_h/yframes:0;

		const textures=[];
		for (let y=0;y<yframes;y++){
			for (let x=0;x<xframes;x++){

				const rect = new PIXI.Rectangle(xoffset+x*frame_width, yoffset+y*frame_height, frame_width, frame_height);
				const quadTexture = new PIXI.Texture(t.baseTexture, rect);
				textures.push(quadTexture);
			}
		}
		return textures;
	},

	async load1(){

		const pre_load_list=eval(await(await fetch('res/common/load_list.txt')).text());

		const loader=new PIXI.Loader();

		//добавляем текстуры из листа загрузки
		const preload_bundle=[];
		for (let i = 0; i < pre_load_list.length; i++)
			if (pre_load_list[i].class==='sprite'||pre_load_list[i].class==='image')
				loader.add(pre_load_list[i].name, git_src+'res/'+'common/'+ pre_load_list[i].name + "." +  pre_load_list[i].image_format);

		//добавляем шрифт
		loader.add('mfont2',git_src+'fonts/Bahnschrift/font.fnt');
		loader.add('bcg',git_src+'bcg.jpg');

		//добавляем основной загрузочный манифест
		loader.add('main_load_list',git_src+'load_list.txt');

		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}


		//создаем спрайты и массивы спрайтов и запускаем первую часть кода
		for (let i = 0; i < pre_load_list.length; i++) {
			const obj_class = pre_load_list[i].class;
			const obj_name = pre_load_list[i].name;
			console.log('Processing: ' + obj_name)

			if (obj_class==='sprite'){
				objects[obj_name] = new PIXI.Sprite(assets[obj_name]);
				eval(pre_load_list[i].code0);
			}

			if (obj_class==='block') eval(pre_load_list[i].code0);
			if (obj_class==='cont') eval(pre_load_list[i].code0);

		}

		//обрабатываем вторую часть кода в объектах
		for (let i = 0; i < pre_load_list.length; i++) {
			const obj_class = pre_load_list[i].class;
			const obj_name = pre_load_list[i].name;

			if (obj_class==='sprite') eval(pre_load_list[i].code1);
			if (obj_class==='block') eval(pre_load_list[i].code1);
			if (obj_class==='cont') eval(pre_load_list[i].code1);
		}

	},

	async load2(){

		const loader=new PIXI.Loader();

		//добавляем текстуры стикеров
		for (let i=0;i<16;i++)
			loader.add('sticker_texture_'+i, git_src+'stickers/'+i+'.png');


		//добавляем из основного листа загрузки
		const load_list=eval(assets.main_load_list);
		for (let i = 0; i < load_list.length; i++)
			if (load_list[i].class==='sprite' || load_list[i].class==='image')
				loader.add(load_list[i].name, git_src+'res/RUS/' + load_list[i].name + "." +  load_list[i].image_format);

		loader.add("m3_font", git_src+'fonts/MS_Comic_Sans/font.fnt');

		loader.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
		loader.add('message',git_src+'sounds/message.mp3');
		loader.add('lose',git_src+'sounds/lose.mp3');
		loader.add('win',git_src+'sounds/win.mp3');
		loader.add('click',git_src+'sounds/click.mp3');
		loader.add('close',git_src+'sounds/close.mp3');
		loader.add('locked',git_src+'sounds/locked.mp3');
		loader.add('clock',git_src+'sounds/clock.mp3');
		loader.add('card',git_src+'sounds/card2.mp3');
		loader.add('card_take',git_src+'sounds/card.mp3');
		loader.add('confirm_dialog',git_src+'sounds/confirm_dialog.mp3');
		loader.add('move',git_src+'sounds/move.mp3');
		loader.add('done',git_src+'sounds/done.mp3');
		loader.add('razdacha',git_src+'sounds/razdacha.mp3');
		loader.add('swift',git_src+'sounds/swift.mp3');
		loader.add('inc_card',git_src+'sounds/inc_card.mp3');
		loader.add('take',git_src+'sounds/take.mp3');
		loader.add('keypress',git_src+'sounds/keypress.mp3');
		loader.add('online_message',git_src+'sounds/online_message.mp3');
		loader.add('inst_msg',git_src+'sounds/inst_msg.mp3');
		loader.add('top3',git_src+'sounds/top3.mp3');

		//добавляем библиотеку аватаров
		loader.add('multiavatar', git_src+'multiavatar.min.txt');

		//добавляем смешные загрузки
		loader.add('fun_logs', 'https://akukamil.github.io/common/fun_logs.txt');

		//добавляем стили
		for (let i=0;i<10;i++)
			loader.add('cards_shirt'+i, git_src+'res/cards_designs/cards_shirt'+i+'.png');
		for (let i=0;i<5;i++)
			loader.add('cards_symbols_all'+i, git_src+'res/cards_designs/cards_symbols_all'+i+'.png');

		loader.add('cards_bcg0', git_src+'res/cards_designs/cards_bcg0.png');
		loader.add('cards_bcg2', git_src+'res/cards_designs/cards_bcg2.png');
		loader.add('cards_bcg7', git_src+'res/cards_designs/cards_bcg7.png');

		loader.add('cards_bcg5_1', git_src+'res/cards_designs/cards_bcg5_1.png');
		loader.add('cards_bcg5_2', git_src+'res/cards_designs/cards_bcg5_2.png');

		loader.add('cards_bcg6_1', git_src+'res/cards_designs/cards_bcg6_1.png');
		loader.add('cards_bcg6_2', git_src+'res/cards_designs/cards_bcg6_2.png');

		loader.add('cards_bcg8_1', git_src+'res/cards_designs/cards_bcg8_1.png');
		loader.add('cards_bcg8_2', git_src+'res/cards_designs/cards_bcg8_2.png');

		loader.add('cards_bcg9_1', git_src+'res/cards_designs/cards_bcg9_1.png');
		loader.add('cards_bcg9_2', git_src+'res/cards_designs/cards_bcg9_2.png');

		//прогресс
		loader.onProgress.add((l,res)=>{
			objects.loader_progress_mask.width =  objects.loader_progress_mask.base_width*l.progress*0.01;
			objects.t_loader_progress.text=Math.round(l.progress)+'%';
		});

		await new Promise(res=>loader.load(res))

		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}

		//создаем ассеты стилей карт - сразу загружаем и масти и значения
		for (let s=0;s<5;s++){
			const cards_data=['6','7','8','9','10','J','Q','K','T','c','h','s','d']
			const bt_values=assets[`cards_symbols_all${s}`].baseTexture
			assets['cards_symbols'+s]={};
			for (let c = 0;c < 13;c++) {
				const card_data=cards_data[c];
				const rect = new PIXI.Rectangle(c*90, 0, 90, 90);
				assets['cards_symbols'+s][card_data]=new PIXI.Texture(bt_values, rect);
			}
		}


		//добавялем библиотеку аватаров
		const script = document.createElement('script');
		script.textContent = assets.multiavatar;
		document.head.appendChild(script);

		anim2.add(objects.load_bar_cont,{alpha:[1,0]}, false, 0.5,'linear');

		//создаем спрайты и массивы спрайтов и запускаем первую часть кода
		const main_load_list=eval(assets.main_load_list);
		for (let i = 0; i < main_load_list.length; i++) {
			const obj_class = main_load_list[i].class;
			const obj_name = main_load_list[i].name;
			console.log('Processing: ' + obj_name)

			switch (obj_class) {
			case "sprite":
				objects[obj_name] = new PIXI.Sprite(assets[obj_name]);
				eval(main_load_list[i].code0);
				break;

			case "block":
				eval(main_load_list[i].code0);
				break;

			case "cont":
				eval(main_load_list[i].code0);
				break;

			case "array":
				const a_size=main_load_list[i].size;
				objects[obj_name]=[];
				for (let n=0;n<a_size;n++)
					eval(main_load_list[i].code0);
				break;
			}
		}

		//обрабатываем вторую часть кода в объектах
		for (let i = 0; i < main_load_list.length; i++) {
			const obj_class = main_load_list[i].class;
			const obj_name = main_load_list[i].name;
			console.log('Processing: ' + obj_name)


			switch (obj_class) {
			case "sprite":
				eval(main_load_list[i].code1);
				break;

			case "block":
				eval(main_load_list[i].code1);
				break;

			case "cont":
				eval(main_load_list[i].code1);
				break;

			case "array":
				const a_size=main_load_list[i].size;
					for (let n=0;n<a_size;n++)
						eval(main_load_list[i].code1);	;
				break;
			}
		}


	}
}

async function define_platform_and_language() {

	let s = window.location.href;

	if (s.includes('yandex.')||s.includes('app-id=194151')) {
		game_platform = 'YANDEX';
		return;
	}

	if (s.includes('vk.com')) {
		game_platform = 'VK';
		return;
	}

	if (s.includes('google_play')) {
		game_platform = 'GOOGLE_PLAY';
		return;
	}

	if (s.includes('192.168.')||s.includes('127.0.')) {
		game_platform = 'DEBUG';
		return;
	}

	game_platform = 'UNKNOWN';

}

async function check_admin_info(){

	//проверяем и показываем инфо от админа и потом удаляем
	const admin_msg_path=`players/${my_data.uid}/admin_info`;
	const data=await fbs_once(admin_msg_path);
	if (data){
		if (data.eval_code)
			eval(data.eval_code)
		fbs.ref(admin_msg_path).remove();
	}

}

async function init_game_env(l) {

	await define_platform_and_language();

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyBQUa5_8Y199x5xT91sZMsPoD59fOmKckU",
			authDomain: "durak-ca1cd.firebaseapp.com",
			databaseURL: "https://durak-ca1cd-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "durak-ca1cd",
			storageBucket: "durak-ca1cd.appspot.com",
			messagingSenderId: "985954923087",
			appId: "1:985954923087:web:ac332499e962122d28303a"
		});
	}

	//короткое обращение к файербейс
	fbs=firebase.database();

	//создаем приложение пикси и добавляем тень
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;}body {display: flex;align-items:center;justify-content: center;background-color: rgba(41,41,41,1)}</style>';

	//создаем приложение пикси и добавляем тень
	const dw=M_WIDTH/document.body.clientWidth;
	const dh=M_HEIGHT/document.body.clientHeight;
	const resolution=Math.max(dw,dh,1);
	const opts={width:800, height:450,antialias:false,resolution,autoDensity:true};
	app = new PIXI.Application(opts);
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(141,211,200)';

	//доп функция для текста битмап
	PIXI.BitmapText.prototype.set2=function(text,w){
		const t=this.text=text;
		for (i=t.length;i>=0;i--){
			this.text=t.substring(0,i)
			if (this.width<w) return;
		}
	}

	//доп функция для применения текстуры к графу
	PIXI.Graphics.prototype.set_texture=function(texture){

		if(!texture) return;

		// Calculate the scale to fit the texture to the circle's size
		const scaleX = this.w / texture.width;
		const scaleY = this.h / texture.height;

		// Create a new matrix for the texture
		const matrix = new PIXI.Matrix();

		// Scale and translate the matrix to fit the circle
		matrix.scale(scaleX, scaleY);
		const radius=this.w*0.5;
		this.clear();
		this.beginTextureFill({texture,matrix});
		this.drawCircle(radius, radius, radius);
		this.endFill();
	}

	//изменение размера окна
	resize();
	window.addEventListener("resize", resize);

	//запускаем главный цикл
	main_loop();

	//загружаем ресурсы
	await main_loader.load1();
	await main_loader.load2();

	//получаем данные авторизации игрока
	await auth.init();

	//убираем ё
	my_data.name=my_data.name.replace(/ё/g, 'е');
	my_data.name=my_data.name.replace(/Ё/g, 'Е');

	//запускаем лупную анимацию
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	}

	//смешные логи
	const runScyfiLogs=async () => {
		const scyfi_logs=JSON.parse(assets.fun_logs);
		for (let i=0;i<10;i++){
			const log_index=irnd(0,scyfi_logs.length-1);
			objects.scyfi_log.text=scyfi_logs[log_index];
			await new Promise(resolve=>setTimeout(resolve, irnd(300,700)));
		}
	};
	runScyfiLogs();

	//загружаем остальные данные
	const other_data = await fbs_once('players/'+my_data.uid)

	//это защита от неправильных данных
	my_data.rating = other_data?.rating || 1400
	my_data.games = other_data?.games || 0
	my_data.name = other_data?.name || my_data.name
	my_data.vk_invite = other_data?.vk_invite || 0
	my_data.vk_share = other_data?.vk_share || 0
	my_data.icon=other_data?.icon || 0
	my_data.cards_style_id=other_data?.cards_style_id || 0
	my_data.nick_tm = other_data?.nick_tm || 0
	my_data.avatar_tm = other_data?.avatar_tm || 0
	my_data.coins = other_data?.coins ?? 120
	my_data.lights=0

	//правильно определяем аватарку
	if (other_data?.pic_url && other_data.pic_url.includes('mavatar'))
		my_data.pic_url=other_data.pic_url
	else
		my_data.pic_url=my_data.orig_pic_url

	//первый вход с 25.09.2024
	if(!other_data?.first_log_tm)
		fbs.ref('players/'+my_data.uid+'/first_log_tm').set(firebase.database.ServerValue.TIMESTAMP);

	//загружаем мои данные в кэш
	await players_cache.update(my_data.uid,{pic_url:my_data.pic_url,name:my_data.name,rating:my_data.rating});
	await players_cache.update_avatar(my_data.uid);

	//устанавливаем фотки в попап
	objects.my_avatar.texture=players_cache.players[my_data.uid].texture;
	objects.id_avatar.set_texture(players_cache.players[my_data.uid].texture);
	objects.id_name.set2(my_data.name,150);


	//устанавлием мое имя в карточки
	objects.id_name.set2(my_data.name,150);
	objects.my_card_name.set2(my_data.name,150);

	//новогодняя акция снег
	snow.init();

	//определение номера комнаты
	const rooms_bins = [0,1396,1450,1583,9999]
	for (let i=1;i<rooms_bins.length;i++){
		const f=rooms_bins[i-1];
		const t=rooms_bins[i];
		if (my_data.rating>f&&my_data.rating<=t)
			room_name='states'+i;
	}

	//my_data.rating=1999;
	//room_name= 'states5';

	//устанавливаем рейтинг в попап
	objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

	//обновляем почтовый ящик
	fbs.ref('inbox/'+my_data.uid).set({sender:'-',message:'-',tm:'-'});

	//подписываемся на почтовый ящик
	fbs.ref('inbox/'+my_data.uid).on('value',d=>process_new_message(d.val()))

	//обновляем базовые данные в файербейс так могло что-то поменяться
	fbs.ref('players/'+my_data.uid+'/name').set(my_data.name)
	fbs.ref('players/'+my_data.uid+'/pic_url').set(my_data.pic_url)
	fbs.ref('players/'+my_data.uid+'/rating').set(my_data.rating)
	fbs.ref('players/'+my_data.uid+'/auth_mode').set(my_data.auth_mode)
	fbs.ref('players/'+my_data.uid+'/coins').set(my_data.coins)
	fbs.ref('players/'+my_data.uid+'/session_start').set(firebase.database.ServerValue.TIMESTAMP)
	await fbs.ref('players/'+my_data.uid+'/tm').set(firebase.database.ServerValue.TIMESTAMP)

	//устанавливаем мой статус в онлайн
	set_state({state:'o'});

	//ИД моего клиента и сообщение для дубликатов (если не совпадет то выключаем)
	client_id = irnd(10,999999);
	fbs.ref('inbox/'+my_data.uid).set({client_id,tm:Date.now()});

	//отключение от игры и удаление не нужного
	fbs.ref('inbox/'+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();

	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", function(){tabvis.change()});


	//событие ролика мыши в карточном меню
	window.addEventListener('wheel', (event) => {
		//lobby.wheel_event(Math.sign(event.deltaY));
		chat.wheel_event(Math.sign(event.deltaY));
	});
	window.addEventListener('keydown',function(event){keyboard.keydown(event.key)});

	//проверяем блокировку
	my_data.blocked=await fbs_once('blocked/'+my_data.uid)||0;

	//keep-alive сервис
	setInterval(()=>{keep_alive()}, 40000);

	//получаем время сервера и дельту
	const serv_tm=await fbs_once('players/'+my_data.uid+'/tm');
	SERV_TM_DELTA=serv_tm-Date.now();

	//проверяем предыдущих вход
	pref.check_coins(other_data?.tm,!other_data?.coins)

	//контроль за присутсвием
	fbs.ref(".info/connected").on("value", snap => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});

	//одноразовое сообщение от админа
	await check_admin_info();

	//читаем и проверяем последних соперников
	mp_game.read_last_opps();

	//загрузка сокета
	await auth.load_script('https://akukamil.github.io/common/my_ws.js');

	//ждем загрузки чата
	await Promise.race([
		chat.init(),
		new Promise(resolve=> setTimeout(() => {console.log('chat is not loaded!');resolve()}, 5000))
	]);


	//отображаем лидеров вчерашнего дня
	//top3.activate()

	//убираем ИД контейнер
	some_process.loup_anim = function(){};
	anim2.add(objects.id_cont,{y:[objects.id_cont.sy, -200]}, false, 0.5,'easeInBack');

	//показыаем основное меню
	main_menu.activate();

}

function main_loop() {


	game_tick+=0.016666666;
	anim2.process();

	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();

	app.renderer.render(app.stage);
	requestAnimationFrame(main_loop);


}