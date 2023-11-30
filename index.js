var M_WIDTH=800, M_HEIGHT=450;
var app ={stage:{},renderer:{}},gdata={}, game_res, objects={}, LANG = 0, state='',chat_path, game_tick=0, game_id=0, connected = 1, h_state=0, game_platform="",
hidden_state_start = 0,fbs,room_name = 'states2', pending_player='', opponent = {}, my_data={opp_id : ''},client_id,
opp_data={}, some_process = {}, git_src = '', WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2, MY_TURN = 1, OPP_TURN = 2, turn = 0;

let last_move_data={};

my_log={
	log_arr:[],
	add(data){		
		this.log_arr.push(data);
		if (this.log_arr.length>20)
			this.log_arr.shift();
	}	
};

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
		
		
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.width=210;
		this.bcg.height=100;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};
		
		this.table_rating_hl=new PIXI.Sprite(gres.table_rating_hl.texture);
		this.table_rating_hl.width=210;
		this.table_rating_hl.height=100;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=18;
		this.avatar.y=18;
		this.avatar.width=this.avatar.height=64;
				
		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 27,align: 'center'});
		this.name_text.anchor.set(0,0);
		this.name_text.x=95;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;		

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 40,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0,0.5);
		this.rating_text.x=100;
		this.rating_text.y=65;		
		this.rating_text.tint=0xffff00;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=22;
		this.avatar1.y=18;
		this.avatar1.width=this.avatar1.height=64;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=122;
		this.avatar2.y=18;
		this.avatar2.width=this.avatar2.height=64;
		
		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=55;
		this.rating_text1.y=60;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 30,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=155;
		this.rating_text2.y=60;
		
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2,this.rating_text,this.table_rating_hl,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating.x=298;
		this.rating.tint=0xff55ff;
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class playing_cards_class extends PIXI.Container {
	
	constructor(id) {
		
		super();
		this.id=id;
		this.value = Math.floor(id%9);
		this.visible = false;
				
		this.trump_hl = new PIXI.Sprite(gres.trump_hl.texture);
		this.trump_hl.visible = false;
		this.trump_hl.anchor.set(0.5,0.5);	

		
		this.bcg = new PIXI.Sprite(gres.pcard_bcg.texture);
		this.bcg.anchor.set(0.5,0.5);	
		this.interactive = true;
		this.buttonMode = true;
		this.pointerdown = function(){table.card_down(this)};
		this.type = 'COMMON';			
		
		this.suit = ['h','d','s','c','h','h','h','h'][Math.floor(id/9)];		
		this.suit_img = new PIXI.Sprite(gres[this.suit+'_bcg'].texture);
		this.suit_img.anchor.set(0.5,0.5);
		
		let _val = ['6','7','8','9','10','J','Q','K','T'][id%9];	
		this.text_value = new PIXI.BitmapText(_val, {fontName: 'comic_sans',fontSize: 55});
		this.text_value.anchor.set(0.5,0.5);
		this.text_value.y=-26;
		
		if (this.suit === 'h' || this.suit === 'd')
			this.text_value.tint = 0xff0000;
		else
			this.text_value.tint = 0x000000;
				
		//this.scale_xy=0.3;
		this.addChild( this.bcg, this.trump_hl, this.suit_img, this.text_value);
	}	
		
	set (suit, value) {
		
		this.suit = suit;
		this.suit_img.texture = gres[suit+'_bcg'].texture;
		this.text_value.text = ['6','7','8','9','10','J','Q','K','T'][value];	
		
		if (this.suit === 'h' || this.suit === 'd')
			this.text_value.tint = 0xff0000;
		else
			this.text_value.tint = 0x000000;
		
	}
	
	set_shirt () {
		this.text_value.visible = false;
		this.suit_img.texture = gres.cards_shirt.texture;		
		
	}
	
	unshirt () {
		
		this.text_value.visible = true;
		this.suit_img.texture = gres[this.suit+'_bcg'].texture;
		
	}
		
	
}

class chat_record_class extends PIXI.Container {
	
	constructor() {
		
		super();
		
		this.tm=0;
		this.hash=0;
		this.index=0;
		this.uid='';
	
		
		this.msg_bcg = new PIXI.Sprite(gres.msg_bcg_short.texture);
		this.msg_bcg.width=gdata.chat_record_w;
		this.msg_bcg.height=gdata.chat_record_h;


		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: gdata.chat_record_name_font_size});
		this.name.anchor.set(0.5,0.5);
		this.name.x=gdata.chat_record_name_x;
		this.name.y=gdata.chat_record_name_y;	
		this.name.tint=gdata.chat_record_name_tint;
		
		
		this.avatar = new PIXI.Sprite(PIXI.Texture.WHITE);
		this.avatar.width=gdata.chat_record_avatar_w;
		this.avatar.height=gdata.chat_record_avatar_h;
		this.avatar.x=gdata.chat_record_avatar_sx;
		this.avatar.y=gdata.chat_record_avatar_sy;
		this.avatar.interactive=true;
		const this_card=this;
		this.avatar.pointerdown=function(){chat.avatar_down(this_card)};	
		this.avatar.anchor.set(0,0)
				
		
		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont',fontSize: gdata.chat_record_text_font_size,align: 'left',lineSpacing:40}); 
		this.msg.x=gdata.chat_record_text_x;
		this.msg.y=gdata.chat_record_text_y;
		this.msg.maxWidth=gdata.chat_record_text_max_w;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = gdata.chat_record_text_col;
		
		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont',fontSize: gdata.chat_record_tm_font_size}); 
		this.msg_tm.x=gdata.chat_record_tm_x;		
		this.msg_tm.y=gdata.chat_record_tm_y;

		this.msg_tm.tint=gdata.chat_record_tm_col;
		this.msg_tm.anchor.set(0,0);
		
		this.visible = false;
		this.addChild(this.msg_bcg,this.avatar,this.name,this.msg,this.msg_tm);
		
	}
	
	async update_avatar(uid, tar_sprite) {		
		//определяем pic_url
		await lobby.update_players_cache_data(uid);
		const pic_url=lobby.players_cache[uid].pic_url;
		const t=await lobby.get_texture(pic_url);
		tar_sprite.texture = t;	
	}
	
	async set(msg_data) {
						
		//получаем pic_url из фб
		this.avatar.texture=PIXI.Texture.WHITE;
		await this.update_avatar(msg_data.uid, this.avatar);

		this.uid=msg_data.uid;
		this.tm = msg_data.tm;			
		this.hash = msg_data.hash;
		this.index = msg_data.index;
		
		if (msg_data.name.length > 15) msg_data.name = msg_data.name.substring(0, 15);	
		
		//бэкграунд сообщения в зависимости от длины
		if (msg_data.msg.length>20){
			this.msg_bcg.texture=gres.msg_bcg_long.texture
			this.msg_tm.x=475;		
		}else{
			this.msg_bcg.texture=gres.msg_bcg_short.texture
			this.msg_tm.x=315;		
		}

		
		make_text(this.name,msg_data.name,110);
		this.msg.text=msg_data.msg;		
		this.visible = true;		
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		
	}	
	
}

class feedback_record_class extends PIXI.Container {
	
	constructor() {
		
		super();		
		this.text=new PIXI.BitmapText('Николай: хорошая игра', {fontName: 'mfont',fontSize: 23,align: 'left',lineSpacing:40}); 
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

chat = {
	
	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	drag_chat:false,
	drag_sx:0,
	drag_sy:-999,	
	recent_msg:[],
	moderation_mode:0,
	
	activate() {		

		objects.chat_enter_button.visible=my_data.rating>1430&&!my_data.blocked;
		anim2.add(objects.chat_cont,{alpha:[0, 1]}, true, 0.1,'linear');

	},
	
	init(){
		
		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;		
		objects.desktop.interactive=true;
		objects.desktop.pointermove=this.pointer_move.bind(this);
		objects.desktop.pointerdown=this.pointer_down.bind(this);
		objects.desktop.pointerup=this.pointer_up.bind(this);
		objects.desktop.pointerupoutside=this.pointer_up.bind(this);
		for(let rec of objects.chat_records) {
			rec.visible = false;			
			rec.tm=0;
		}			
		
		//загружаем чат
		fbs.ref(chat_path).orderByChild('tm').limitToLast(20).once('value', snapshot => {chat.chat_load(snapshot.val());});		
		
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
		let oldest = {tm:9671801786406 ,visible:true};		
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;	
		return oldest;		
		
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
		
		//подписываемся на новые сообщения
		fbs.ref(chat_path).on('child_changed', snapshot => {chat.chat_updated(snapshot.val());});
	},	
				
	async chat_updated(data, first_load) {		
	
		//console.log('receive message',data)
		if(data===undefined) return;
		
		//если это сообщение уже есть в чате
		if (objects.chat_records.find(obj => { return obj.hash === data.hash;}) !== undefined) return;
		
		
		//выбираем номер сообщения
		const new_rec=objects.chat_records[data.index||0]
		await new_rec.set(data);
		new_rec.y=this.last_record_end;
		
		this.last_record_end += gdata.chat_record_h;		

		if (!first_load)
			lobby.inst_message(data);
		
		//смещаем на одно сообщение (если чат не видим то без твина)
		if (objects.chat_cont.visible)
			await anim2.add(objects.chat_msg_cont,{y:[objects.chat_msg_cont.y,objects.chat_msg_cont.y-gdata.chat_record_h]},true, 0.05,'linear');		
		else
			objects.chat_msg_cont.y-=gdata.chat_record_h
		
	},
			
	avatar_down(player_data){
		
		if (this.moderation_mode){
			console.log(player_data.index,player_data.uid,player_data.name.text,player_data.msg.text);
			return
		}
		
		if (objects.feedback_cont.visible){			
			feedback.response_message(player_data.uid,player_data.name.text);
			
		}else{			
			lobby.show_invite_dialog_from_chat(player_data.uid,player_data.name.text)
		}
		
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
		
		objects.chat_msg_cont.y-=delta*gdata.chat_record_h*0.5;	
		const chat_bottom = this.last_record_end;
		const chat_top = this.last_record_end - objects.chat_records.filter(obj => obj.visible === true).length*gdata.chat_record_h;
		
		if (objects.chat_msg_cont.y+chat_bottom<430)
			objects.chat_msg_cont.y = 430-chat_bottom;
		
		if (objects.chat_msg_cont.y+chat_top>0)
			objects.chat_msg_cont.y=-chat_top;
		
	},
	
	make_hash() {
	  let hash = '';
	  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  for (let i = 0; i < 6; i++) {
		hash += characters.charAt(Math.floor(Math.random() * characters.length));
	  }
	  return hash;
	},
		
	async write_button_down(){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);
		
		
		if (this.recent_msg.length>3){
			message.add(['Подождите 1 минуту','Wait 1 minute'][LANG])
			return;
		}
		
		
		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());
		
		//пишем сообщение в чат и отправляем его		
		let fb = await feedback.show(opp_data.uid,65);		
		if (fb[0] === 'sent') {			
			const hash=this.make_hash();
			const index=chat.get_oldest_index();
			fbs.ref(chat_path+'/'+index).set({uid:my_data.uid,name:my_data.name,msg:fb[1], tm:firebase.database.ServerValue.TIMESTAMP,index, hash});
		}	
		
	},
		
	close() {
		
		anim2.add(objects.chat_cont,{alpha:[1, 0]}, false, 0.1,'linear');
		if (objects.feedback_cont.visible === true)
			feedback.close();
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
			objects.dialog_card.texture=gres.ad_break_img.texture;	
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
			objects.dialog_card.texture=gres.share_img.texture;	
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
				objects.dialog_card.texture=gres.thanks_img.texture;	
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
			objects.dialog_card.texture=gres.invite_friends_img.texture;	
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
				objects.dialog_card.texture=gres.thanks_img.texture;	
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
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	
	
	any_on : function() {		
		for (let s of this.slot)
			if (s !== null&&s.block)
				return true
		return false;			
	},
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	easeOutBounce: function(x) {
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
	
	easeInCubic: function(x) {
		return x * x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI*2);
	},
	
	easeInOutCubic: function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake : function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		
		
	},	
	
	add : function(obj, params, vis_on_end, time, func, block=true) {
				
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
				if (func === 'ease2back')
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
	
	
	
	
	process: function () {
		
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
	
	wait : async function(time) {
		
		await this.add(this.empty_spr,{x:[0, 1]}, false, time,'linear');	
		
	}
}

sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	},
	
	play_delayed (snd_res, delay) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		
		setTimeout(function(){game_res.resources[snd_res].sound.play()}, delay);
			
		
	}
	
	
}

message =  {
	
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

big_message = {
	
	p_resolve : 0,
		
	async show(t1, t2, feedback_on) {
				
		this.feedback_on = feedback_on;
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.feedback_button.visible = feedback_on;
		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	
	},
	
	async feedback_down() {
		
		if (objects.big_message_cont.ready===false) {
			sound.play('locked');
			return;			
		}


		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');	
		
		//пишем отзыв и отправляем его		
		let fb = await feedback.show(opp_data.uid);		
		if (fb[0] === 'sent') {
			let fb_id = irnd(0,50);			
			await fbs.ref("fb/"+opp_data.uid+"/"+fb_id).set([fb[1], firebase.database.ServerValue.TIMESTAMP, my_data.name]);
		
		}
		
		this.p_resolve("close");
				
	},

	async close() {
		
		if (objects.big_message_cont.ready===false)
			return;
		
		sound.play('click');
		await anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.y,-300]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

mp_game = {
	
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
	
	calc_new_rating(old_rating, game_result) {
		
		
		if (game_result === NOSYNC)
			return old_rating;
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));
		
	},
	
	async activate (role, seed) {
		
		this.my_role = role;
		
		opponent = this;
	
		objects.desktop.texture = gres.desktop.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.6,'linear');
		
	
		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();
		
		//если открыт чат то закрываем его
		if (objects.chat_cont.visible===true)
			chat.close();
		
		//инициируем стол
		table.init(role, seed);
		
		//показыаем карточки
		anim2.add(objects.my_card_cont,{x:[-100,objects.my_card_cont.sx]}, true, 0.6,'easeOutBack');	
		anim2.add(objects.opp_card_cont,{x:[900,objects.opp_card_cont.sx]}, true, 0.6,'easeOutBack');	

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
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		let lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			fbs.ref("players/"+my_data.uid+"/rating").set(lose_rating);
		
		//устанавливаем локальный и удаленный статус
		set_state({state : 'p'});	
				
		opponent = this;
		
	},
		
	send_move (data) {
			
		my_last_move=data;
			
		if (data.message !== 'TOSS')
			this.reset_timer(OPP_TURN);
		
		this.me_conf_play = 1;
		
		this.made_moves++;
		
		//отправляем ход онайлн сопернику (с таймаутом)
		this.write_fb_timer=setTimeout(function(){this.stop('my_no_connection')}, 5000);  
		const write_start=Date.now();
		fbs.ref("inbox/"+opp_data.uid).set(data).then(()=>{	
			my_last_move.write_time=Date.now()-write_start;
			clearTimeout(this.write_fb_timer);			
		});			
		
	},
		
	timer_tick () {
		
		//проверка таймера
		const cur_time=Date.now();
		if (cur_time-this.timer_prv_time>5000||cur_time<this.prv_tick_time){
			this.stop('timer_error');
			return;
		}
		this.timer_prv_time=cur_time;
				
		//определяем сколько времени прошло
		this.move_time_left=this.time_for_move-~~((Date.now()-this.move_time_start)*0.001);
		
		if (this.move_time_left < 0 && turn === MY_TURN)	{
			
			if (this.me_conf_play === 1)
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
			
			if ((turn === OPP_TURN)&&(my_data.rating>2000||opp_data.rating>2000)){	
					
				this.forced_inbox_check(game_id,opp_data.name);			
			}		
			
		}

		//обновляем текст на экране
		objects.timer_text.text="0:"+this.move_time_left;
		
		//следующая секунда
		this.timer_id = setTimeout(function(){mp_game.timer_tick()}, 1000);		
	},
	
	async send_message() {
		
		let msg_data = await feedback.show();
		
		if (msg_data[0] === 'sent') {			
			fbs.ref('inbox/'+opp_data.uid).set({sender:my_data.uid,message:'CHAT',tm:Date.now(),data:msg_data[1]});	
			
			if (my_data.rating>2000||opp_data.rating>2000){
				fbs.ref('CHAT_ARCH').push({game_id:game_id,sender:my_data.uid,data:msg_data[1],tm:Date.now()});	
			}

		} else {			
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
		
		table.state = 'stop';
		
		let res_array = [
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
		
		clearTimeout(this.timer_id);	


		if (result==='opp_timeout'&&(my_data.rating>2000||opp_data.rating>2000)){	
		
			my_last_move.opp_timeout=Date.now();
			my_last_move.game_id=game_id;
			my_last_move.opp_name=opp_data.name;
			my_last_move.opp_uid=opp_data.uid;
			my_last_move.my_name=my_data.name;
			
			try{
				fbs.ref('BAD_CASE2').push(my_last_move);					
			}catch(e){
				fbs.ref('BAD_CASE2').push('error_when_pushing_to_bad_case');
			};

		}		
		
		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];		
		let result_number = result_row[1];
		let result_info = result_row[2][LANG];
		
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		fbs.ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		
		//обновляем даные на карточке
		objects.my_card_rating.text=my_data.rating;
		
		//если диалоги еще открыты
		if (objects.stickers_cont.visible===true)
			stickers.hide_panel();	
		
		//если диалоги еще открыты
		if (objects.confirm_cont.visible===true)
			confirm_dialog.close();
				
		//убираем элементы
		objects.timer_cont.visible = false;
		objects.game_buttons.visible = false;
		
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			sound.play('lose');
		else
			sound.play('win');
				
		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {
			
			//увеличиваем количество игр
			my_data.games++;
			fbs.ref("players/"+[my_data.uid]+'/games').set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			fbs.ref("finishes/"+game_id).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
		
			//контрольные концовки
			if (my_data.rating>2000 || opp_data.rating>2000)
			{
				fbs.ref("finishes2").push({uid:my_data.uid,player1:objects.my_card_name.text,player2:objects.opp_card_name.text, res:result_number,fin_type:result_str,duration:duration, rating: [old_rating,my_data.rating],client_id:client_id, ts:firebase.database.ServerValue.TIMESTAMP});	
			}		
		
		}
			
		await big_message.show(result_info, ['Рейтинг','Rating'][LANG]+`: ${old_rating} > ${my_data.rating}`, 3)
		set_state({state : 'o'});	
		this.close();
		main_menu.activate();
	
	},
		
	async giveup() {
		
		if (this.made_moves < 3) {
			message.add(['Нельзя сдаваться в начале игры','Do not give up so early'][LANG])
			return;
		}
		
		let res = await confirm_dialog.show(['Сдаетесь?','GiveUP?'][LANG])
		
		if (res !== 'ok') return;
		
		//заканчиваем игру поражением
		this.stop('my_giveup')
		
		//отправляем сопернику что мы сдались
		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"GIVEUP",tm:Date.now()});
		
	},
	
	close() {
		
		table.close();
		anim2.add(objects.my_card_cont,{x:[objects.my_card_cont.x, -100]}, false, 0.6,'easeInBack');	
		anim2.add(objects.opp_card_cont,{x:[objects.opp_card_cont.x,900]}, false, 0.6,'easeInBack');	
		objects.timer_cont.visible = false;
		objects.game_buttons.visible = false;
	}
	
}

sp_game = {

	name :'bot',
	on : 0,
	state : 'opp_move',
	center_size : 0,

	async activate(role, seed) {

		
		this.on = 1;		

		opponent = this;
		
		opp_data.uid = 'BOT';
		
		objects.desktop.texture = gres.desktop.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.6,'linear');
		
		//инициируем стол
		let seed2 = irnd(0,999999)

		table.init(role, seed2);
		
		//показыаем карточки
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
				
		console.log('Нечего подсунуть');
		
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
		let result_info = result_row[2][LANG];
				
		
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
		

		await big_message.show (result_info, ["Сыграйте с реальным соперником для получения рейтинга","Play online and become a leader"][LANG], true);
		set_state({state : 'o'});	
		this.close();
		main_menu.activate();
		
		ad.check_and_show();

	},
	
	async exit_button_down() {
		
		if (anim2.any_on()===true)
			return;
		
		if (objects.big_message_cont.visible === true)
			return;
		
		let res = await confirm_dialog.show(['Закончить игру?','Stop game?'][LANG])
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
		console.log('--------------------')
		
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

table = {
	
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
						
		objects.trump_card.set(this.trump.suit,this.trump.value);
				
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
		
		if (anim2.any_on() || state === 'stop') return;
		
		
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
		
		this.bring_to_front(card);	
		
		let last_card_x = this.center_deck.get_last_card_pos_x();
		
		if (this.state === 'my_defence') {			
			this.center_deck.push(this.my_deck.pop(card));
			await anim2.add(card,{x:[card.x, last_card_x + 30], y:[card.y, 250],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');					
		}
		
		if (this.state === 'my_attack' || this.state === 'my_toss'  ) {			
			this.center_deck.push(this.my_deck.pop(card));
			await anim2.add(card,{x:[card.x, last_card_x + 60], y:[card.y, 225],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');					
		}
		
		if (this.state === 'opp_defence') {			
			this.center_deck.push(card);
			card.unshirt();
			await anim2.add(card,{x:[card.x, last_card_x + 30], y:[card.y, 200],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');					
		}
		
		if (this.state === 'opp_attack') {			
			this.center_deck.push(card);
			card.unshirt();
			await anim2.add(card,{x:[card.x, last_card_x + 60], y:[card.y, 225],scale_xy : [card.scale_xy, 0.7]}, true, 0.25,'easeInOutCubic');					
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

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
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

keep_alive= function() {
	
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

var kill_game = function() {
	
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
	if (msg.message==="CLIEND_ID") 
		if (msg.client_id !== client_id)
			kill_game();

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
		await lobby.update_players_cache_data(uid);
		
		sound.play('receive_sticker');	
		anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.75,'easeOutElastic');


		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.name=lobby.players_cache[uid].name;
		make_text(objects.req_name,lobby.players_cache[uid].name,200);
		objects.req_rating.text=lobby.players_cache[uid].rating;
		req_dialog._opp_data.rating=lobby.players_cache[uid].rating;

		//throw "cut_string erroor";
		req_dialog._opp_data.uid=uid;
		objects.req_avatar.texture=await lobby.get_texture(lobby.players_cache[uid].pic_url);


	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;
		
		sound.play('close');



		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		fbs.ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false ||  objects.confirm_cont.visible===true || objects.big_message_cont.visible===true || anim2.any_on() === true)
			return;
		
		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data;	
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*1999);
						
		//раздаем карты мне и оппоненту
		let seed = irnd(0,999999);
		
		
		//отправляем данные о начальных параметрах игры сопернику
		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT", tm:Date.now(), game_id : game_id, seed : seed});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		lobby.close();
		sp_game.switch_close();
		mp_game.activate('slave', seed);

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

	}

}

feedback = {
		
	rus_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[70,224.9,100,263.97,'Й'],[110,224.9,140,263.97,'Ц'],[150,224.9,180,263.97,'У'],[190,224.9,220,263.97,'К'],[230,224.9,260,263.97,'Е'],[270,224.9,300,263.97,'Н'],[310,224.9,340,263.97,'Г'],[350,224.9,380,263.97,'Ш'],[390,224.9,420,263.97,'Щ'],[430,224.9,460,263.97,'З'],[470,224.9,500,263.97,'Х'],[510,224.9,540,263.97,'Ъ'],[90,273.7,120,312.77,'Ф'],[130,273.7,160,312.77,'Ы'],[170,273.7,200,312.77,'В'],[210,273.7,240,312.77,'А'],[250,273.7,280,312.77,'П'],[290,273.7,320,312.77,'Р'],[330,273.7,360,312.77,'О'],[370,273.7,400,312.77,'Л'],[410,273.7,440,312.77,'Д'],[450,273.7,480,312.77,'Ж'],[490,273.7,520,312.77,'Э'],[70,322.6,100,361.67,'!'],[110,322.6,140,361.67,'Я'],[150,322.6,180,361.67,'Ч'],[190,322.6,220,361.67,'С'],[230,322.6,260,361.67,'М'],[270,322.6,300,361.67,'И'],[310,322.6,340,361.67,'Т'],[350,322.6,380,361.67,'Ь'],[390,322.6,420,361.67,'Б'],[430,322.6,460,361.67,'Ю'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'ЗАКРЫТЬ'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'ОТПРАВИТЬ'],[531,273.7,561,312.77,','],[471,322.6,501,361.67,'('],[30,273.7,80,312.77,'EN']],	
	eng_keys : [[50,176,80,215.07,'1'],[90,176,120,215.07,'2'],[130,176,160,215.07,'3'],[170,176,200,215.07,'4'],[210,176,240,215.07,'5'],[250,176,280,215.07,'6'],[290,176,320,215.07,'7'],[330,176,360,215.07,'8'],[370,176,400,215.07,'9'],[410,176,440,215.07,'0'],[491,176,541,215.07,'<'],[110,224.9,140,263.97,'Q'],[150,224.9,180,263.97,'W'],[190,224.9,220,263.97,'E'],[230,224.9,260,263.97,'R'],[270,224.9,300,263.97,'T'],[310,224.9,340,263.97,'Y'],[350,224.9,380,263.97,'U'],[390,224.9,420,263.97,'I'],[430,224.9,460,263.97,'O'],[470,224.9,500,263.97,'P'],[130,273.7,160,312.77,'A'],[170,273.7,200,312.77,'S'],[210,273.7,240,312.77,'D'],[250,273.7,280,312.77,'F'],[290,273.7,320,312.77,'G'],[330,273.7,360,312.77,'H'],[370,273.7,400,312.77,'J'],[410,273.7,440,312.77,'K'],[450,273.7,480,312.77,'L'],[471,322.6,501,361.67,'('],[70,322.6,100,361.67,'!'],[150,322.6,180,361.67,'Z'],[190,322.6,220,361.67,'X'],[230,322.6,260,361.67,'C'],[270,322.6,300,361.67,'V'],[310,322.6,340,361.67,'B'],[350,322.6,380,361.67,'N'],[390,322.6,420,361.67,'M'],[511,322.6,541,361.67,')'],[451,176,481,215.07,'?'],[30,371.4,180,410.47,'CLOSE'],[190,371.4,420,410.47,'_'],[430,371.4,570,410.47,'SEND'],[531,273.7,561,312.77,','],[30,273.7,80,312.77,'RU']],
	keyboard_layout : [],
	lang : '',
	p_resolve : 0,
	MAX_SYMBOLS : 50,
	uid:0,
	
	show : function(uid,max_symbols) {
		
		if (max_symbols)
			this.MAX_SYMBOLS=max_symbols
		else
			this.MAX_SYMBOLS=50
		
		this.set_keyboard_layout(['RU','EN'][LANG]);
				
		this.uid = uid;
		objects.feedback_msg.text ='';
		objects.feedback_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.feedback_cont,{y:[-400, objects.feedback_cont.sy]}, true, 0.4,'easeOutBack');	
		return new Promise(function(resolve, reject){					
			feedback.p_resolve = resolve;	  		  
		});
		
	},
	
	set_keyboard_layout(lang) {
		
		this.lang = lang;
		
		if (lang === 'RU') {
			this.keyboard_layout = this.rus_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_rus.texture;
		} 
		
		if (lang === 'EN') {
			this.keyboard_layout = this.eng_keys;
			objects.feedback_bcg.texture = gres.feedback_bcg_eng.texture;
		}
		
	},
	
	close : function() {
			
		anim2.add(objects.feedback_cont,{y:[objects.feedback_cont.y,450]}, false, 0.4,'easeInBack');		
		
	},
	
	response_message:function(uid, name) {

		
		objects.feedback_msg.text = name.split(' ')[0]+', ';	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${feedback.MAX_SYMBOLS}`		
		
	},
	
	get_texture_for_key (key) {
		
		if (key === '<' || key === 'EN' || key === 'RU') return gres.hl_key1.texture;
		if (key === 'ЗАКРЫТЬ' || key === 'ОТПРАВИТЬ' || key === 'SEND' || key === 'CLOSE') return gres.hl_key2.texture;
		if (key === '_') return gres.hl_key3.texture;
		return gres.hl_key0.texture;
	},
	
	key_down : function(key) {
		
		
		if (objects.feedback_cont.visible === false || objects.feedback_cont.ready === false) return;
		
		key = key.toUpperCase();
		
		if (key === 'ESCAPE') key = {'RU':'ЗАКРЫТЬ','EN':'CLOSE'}[this.lang];			
		if (key === 'ENTER') key = {'RU':'ОТПРАВИТЬ','EN':'SEND'}[this.lang];	
		if (key === 'BACKSPACE') key = '<';
		if (key === ' ') key = '_';
			
		var result = this.keyboard_layout.find(k => {
			return k[4] === key
		})
		
		if (result === undefined) return;
		this.pointerdown(null,result)
		
	},
	
	pointerdown : function(e, inp_key) {
		
		let key = -1;
		let key_x = 0;
		let key_y = 0;		
		
		if (e !== null) {
			
			let mx = e.data.global.x/app.stage.scale.x - objects.feedback_cont.x;
			let my = e.data.global.y/app.stage.scale.y - objects.feedback_cont.y;;

			let margin = 5;
			for (let k of this.keyboard_layout) {			
				if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin) {
					key = k[4];
					key_x = k[0];
					key_y = k[1];
					break;
				}
			}			
			
		} else {
			
			key = inp_key[4];
			key_x = inp_key[0];
			key_y = inp_key[1];			
		}
		
		
		
		//не нажата кнопка
		if (key === -1) return;			
				
		//подсвечиваем клавишу
		objects.hl_key.x = key_x - 10;
		objects.hl_key.y = key_y - 10;		
		objects.hl_key.texture = this.get_texture_for_key(key);
		anim2.add(objects.hl_key,{alpha:[1, 0]}, false, 0.5,'linear');
						
		if (key === '<') {
			objects.feedback_msg.text=objects.feedback_msg.text.slice(0, -1);
			key ='';
		}			
		
		
		if (key === 'EN' || key === 'RU') {
			this.set_keyboard_layout(key)
			return;	
		}	
		
		if (key === 'ЗАКРЫТЬ' || key === 'CLOSE') {
			this.close();
			this.p_resolve(['close','']);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		if (key === 'ОТПРАВИТЬ' || key === 'SEND') {
			
			if (objects.feedback_msg.text === '') return;
			
			//если нашли ненормативную лексику то закрываем
			let mats =/шлю[хш]|п[еи]д[аеор]|суч?ка|г[ао]ндо|х[ую][ейяе]л?|жоп|соси|дроч|чмо|говн|дерьм|трах|секс|сосат|выеб|пизд|срал|уеб[аико]щ?|ебень?|ебу[ч]|ху[йия]|еба[нл]|дроч|еба[тш]|педик|[ъы]еба|ебну|ебл[аои]|ебись|сра[кч]|манда|еб[лн]я|ублюд|пис[юя]/i;		
			
			let text_no_spaces = objects.feedback_msg.text.replace(/ /g,'');
			if (text_no_spaces.match(mats)) {
				sound.play('locked');
				this.close();
				this.p_resolve(['close','']);	
				key ='';
				return;
			}
			
			this.close();
			this.p_resolve(['sent',objects.feedback_msg.text]);	
			key ='';
			sound.play('keypress');
			return;	
		}	
		
		
		
		if (objects.feedback_msg.text.length >= this.MAX_SYMBOLS)  {
			sound.play('locked');
			return;			
		}
		
		if (key === '_') {
			objects.feedback_msg.text += ' ';	
			key ='';
		}			
		

		sound.play('keypress');
		
		objects.feedback_msg.text += key;	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${this.MAX_SYMBOLS}`		
		
	}
	
}

main_menu= {

	activate: async function() {


		some_process.main_menu = this.process;
		anim2.add(objects.mb_cont,{x:[800,objects.mb_cont.sx]}, true, 1,'easeInOutCubic');
		anim2.add(objects.game_title,{y:[-300,objects.game_title.sy]}, true, 1,'easeInOutCubic');
		objects.desktop.texture = gres.desktop.texture;
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.6,'linear');
	},
	
	process : function() {

	},

	close : async function() {

		//some_process.main_menu = function(){};
		objects.mb_cont.visible=false;
		some_process.main_menu_process = function(){};
		anim2.add(objects.mb_cont,{x:[objects.mb_cont.x,800]}, false, 1,'easeInOutCubic');
		anim2.add(objects.game_title,{y:[objects.game_title.y,-300]}, false, 1,'linear');
		//await anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.6,'linear');	
	},

	pb_down: async function () {

		if (anim2.any_on()===true || objects.id_cont.visible === true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lobby.activate();

	},
	
	lb_button_down: async function () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lb.show();

	},

	rules_button_down: async function () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
	
		await this.close();
		rules.activate();


	},

	rules_ok_down: function () {

		anim2.add(objects.rules_cont,{y:[objects.rules_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	chat_button_down : async function() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		
		chat.activate();
		
	},

	pref_button_down: function () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
	
		anim2.add(objects.pref_cont,{y:[-200, objects.pref_cont.sy]}, true, 0.5,'easeOutBack');


	},

	pref_ok_down: function() {

		sound.play('close');
		anim2.add(objects.pref_cont,{y:[objects.pref_cont.sy, -200]}, false, 0.5,'easeInBack');

	},
	
	pref_change_nick_down: async function() {

		sound.play('click');
		const nick=await feedback.show('',15);
		if (nick[0]==='sent'){
			my_data.name=nick[1];
			fbs.ref("players/"+my_data.uid+"/name").set(my_data.name);
			make_text(objects.my_card_name,my_data.name,150);
			set_state({});
			message.add(['Ник изменен','nick has been changed'][LANG])
		}

	},

	pref_sound_switched : function() {
		
		if (objects.pref_sound_switch.ready === false) {
			sound.play('locked');
			return;
		}
		
		if (sound.on === 1) {
			anim2.add(objects.pref_sound_switch,{x:[230, 198]}, true, 0.25,'linear');		
			sound.on = 0;
			return;
		}

		if (sound.on === 0){
			
			anim2.add(objects.pref_sound_switch,{x:[198, 230]}, true, 0.25,'linear');		
			sound.on = 1;	
			sound.play('close');			
			return;			
		}
		
	}
	

}

lb={
	
	active : 0,
	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		this.active = 1;
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;

		
		anim2.add(objects.leader_header,{y:[-50, objects.leader_header.sy]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');
		anim2.add(objects.lb_back_button,{x:[800, objects.lb_back_button.sx]}, true, 0.5,'easeOutCubic');
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 1,'linear');			


		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: async function() {

		this.active = 0;
		anim2.add(objects.leader_header,{y:[objects.leader_header.y,-50]}, true, 0.5,'easeInBack');
		anim2.add(objects.lb_1_cont,{x:[objects.lb_1_cont.x,-150]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_2_cont,{x:[objects.lb_2_cont.x,-150]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_3_cont,{x:[objects.lb_3_cont.x,-150]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_cards_cont,{x:[objects.lb_cards_cont.x, 450]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_back_button,{x:[objects.lb_back_button.x, 800]}, false, 0.5,'easeInBack');
		await anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.6,'linear');		

	},

	back_button_down: async function() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		await this.close();
		main_menu.activate();

	},

	update: function () {

		fbs.ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='')
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					if (players_array[i]!== undefined) {						
						make_text(objects['lb_'+(i+1)+'_name'],players_array[i][0],180);					
						objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
						loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});						
					}
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					if (players_array[i]!== undefined) {
						
						let fname=players_array[i][0];
						make_text(objects.lb_cards[i-3].name,fname,180);
						objects.lb_cards[i-3].rating.text=players_array[i][1];
						loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});						
					} 
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

rules = {
	
	active : 0,
	
	activate : function() {
		
		this.active = 1;
		anim2.add(objects.desktop,{alpha:[0,0.5]}, true, 0.6,'linear');	
		anim2.add(objects.rules_back_button,{x:[800, objects.rules_back_button.sx]}, true, 0.5,'easeOutCubic');
		anim2.add(objects.rules_text,{alpha:[0, 1]}, true, 1,'linear');
				
		objects.rules_text.text = ['Добро пожаловать в игру Дурак [онлайн дуэль]!\n\nЭто дуэльная версия самой популярной в России карточной игры. В игре используется колода из 36 карт. Участвуют двое игроков. Каждому раздается по 6 карт, следующая карта открывается, и ее масть устанавливает козырь для данной игры. Цель игры — избавиться от всех карт. Последний игрок, не избавившийся от карт, остается в "дураках". Отбитые карты идут в "отбой" ("биту"). В ходе игры заходящий игрок кладет на стол любую из имеющихся у него карту, а отбивающийся игрок (игрок, под которого сделан заход) должен либо побить ее, либо взять. Чтобы побить карту, нужно из имеющихся на руках карт положить на нее старшую карту той же масти либо козыря, если битая карта - не козырь. Если битая карта — козырь, то побить ее можно только старшим козырем.\n\nУдачной игры!'][LANG];
	},
	
	back_button_down : async function() {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		
		sound.play('click');
		await this.close();
		main_menu.activate();
		
	},
	
	close : async function() {
		
		this.active = 0;
		anim2.add(objects.rules_text,{alpha:[1, 0]}, false, 0.5,'linear');
		anim2.add(objects.desktop,{alpha:[1, 0]}, false, 0.5,'linear');
		await anim2.add(objects.rules_back_button,{x:[objects.rules_back_button.x, 800]}, false, 0.5,'easeInCubic');
		
		
	}	
	
	
}

stickers={
	
	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel: function() {

		
		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true || objects.stickers_cont.ready===false) {
			return;			
		}



		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 0.5,'easeOutBack');

	},

	hide_panel: function() {

		//game_res.resources.close.sound.play();

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	send : async function(id) {

		if (objects.big_message_cont.visible === true || objects.req_cont.visible === true || objects.stickers_cont.ready===false) {
			return;			
		}
		
		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		fbs.ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		message.add(['Стикер отправлен сопернику','Sticker was sent to the opponent'][LANG]);

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		
		await anim2.add(objects.sent_sticker_area,{alpha:[0, 0.5]}, true, 0.5,'linear');
		
		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 2000)
			}
		);
		
		if (res === "forced")
			return;

		await anim2.add(objects.sent_sticker_area,{alpha:[0.5, 0]}, false, 0.5,'linear');
	},

	receive: async function(id) {

		
		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive("forced");

		//воспроизводим соответствующий звук
		//game_res.resources.receive_sticker.sound.play();

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
	
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

lobby={
	
	state_tint :{},
	_opp_data : {},
	pover : 0,
	activated:false,
	players_cache : {},
	rejected_invites:{},
	fb_cache:{},
	sw_header:{time:0,index:0,header_list:[]},
	
	activate() {
		
		//первый запуск лобби
		if (!this.activated){			
			//расставляем по соответствующим координатам
			
			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4;
				objects.mini_cards[i].y=27+iy*85;		

				
				let ix;
				if (i>15) {
					ix=~~((i-16)/4)
					objects.mini_cards[i].x=800+ix*196;
				}else{
					ix=~~((i)/4)
					objects.mini_cards[i].x=ix*196;
				}
				

			}		

			//запускаем чат
			chat.init();
			
			//создаем заголовки
			const room_desc=['КОМНАТА #','ROOM #'][LANG]+{'states':1,'states2':2,'states3':3,'states4':4,'states4':5}[room_name];
			this.sw_header.header_list=[['ДОБРО ПОЖАЛОВАТЬ В ИГРУ ДУРАК (ОНЛАЙН ДУЭЛЬ)!','WELCOME!!!'][LANG],room_desc]
			objects.lobby_header.text=this.sw_header.header_list[0];
			this.sw_header.time=Date.now()+12000;
			
			this.activated=true;
		}
		
		anim2.add(objects.lobby_cont,{alpha:[0, 1]}, true, 0.1,'linear');

		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;
		
		//процессинг
		some_process.lobby=function(){lobby.process()};

		//добавляем карточку ии
		this.add_card_ai();

		//нормальное название комнаты
		this.room_name_num={'states':1,'states2':2,'states3':3,'states4':4,'states5':5}[room_name];
		
		//подписываемся на изменения состояний пользователей
		fbs.ref(room_name) .on('value', (snapshot) => {lobby.players_list_updated(snapshot.val());});

	},

	players_list_updated(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;


		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};


		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){	

			//обновляем кэш
			if (!this.players_cache[uid]) this.players_cache[uid]={};
			this.players_cache[uid].name=players[uid].name;	
			this.players_cache[uid].rating=players[uid].rating;	
			
			if (players[uid].state !== 'p' && players[uid].hidden === 0)
				single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];
		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
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
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игрокова
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
					
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<objects.mini_cards.length;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}



		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<objects.mini_cards.length;i++) {			
			
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
		for(let i=1;i<objects.mini_cards.length;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
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
			this.place_new_card({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2});
		}
		
	},

	get_state_texture(s) {
	
		switch(s) {

			case "o":
				return gres.mini_player_card.texture;
			break;

			case "b":
				return gres.mini_player_card.texture;
			break;

			case "p":
				return gres.mini_player_card.texture;
			break;
			
			case "bot":
				return gres.mini_player_card.texture;
			break;

		}
	},
	
	place_table(params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
		for(let i=1;i<objects.mini_cards.length;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture=this.get_state_texture(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				//objects.mini_cards[i].avatar_frame.visible = false;
				objects.mini_cards[i].name_text.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].table_rating_hl.visible=true;
				objects.mini_cards[i].rating_text1.visible = true;
				objects.mini_cards[i].rating_text2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				//objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].rating_text1.text = params.rating1;
				objects.mini_cards[i].rating_text2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;


				break;
			}
		}
		
	},

	update_existing_card(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.texture=this.get_state_texture(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].rating_text.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_card(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=1;i<objects.mini_cards.length;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture=this.get_state_texture(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";


				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].rating_text1.visible = false;
				objects.mini_cards[i].rating_text2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].table_rating_hl.visible=false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				//objects.mini_cards[i].avatar_frame.visible = true;
				objects.mini_cards[i].name_text.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].name_text,params.name,105);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].rating_text.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async get_texture(pic_url) {
		
		if (!pic_url) PIXI.Texture.WHITE;
		
		//меняем адрес который невозможно загрузить
		if (pic_url==="https://vk.com/images/camera_100.png")
			pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";	
				
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {
					
			let loader=new PIXI.Loader();
			loader.add('pic', pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
			await new Promise((resolve, reject)=> loader.load(resolve))	
			return loader.resources.pic.texture||PIXI.Texture.WHITE;

		}		
		
		return PIXI.utils.TextureCache[pic_url];		
	},
	
	async update_players_cache_data(uid){
		if (this.players_cache[uid]){
			if (!this.players_cache[uid].name){
				let t=await fbs.ref('players/' + uid + '/name').once('value');
				this.players_cache[uid].name=t.val()||'***';
			}
			
			if (!this.players_cache[uid].rating){
				let t=await fbs.ref('players/' + uid + '/rating').once('value');
				this.players_cache[uid].rating=t.val()||'***';
			}
				
			if (!this.players_cache[uid].pic_url){
				let t=await fbs.ref('players/' + uid + '/pic_url').once('value');
				this.players_cache[uid].pic_url=t.val()||null;
			}
			
		}else{
			
			this.players_cache[uid]={};
			let t=await fbs.ref('players/' + uid).once('value');
			t=t.val();
			this.players_cache[uid].name=t.name||'***';
			this.players_cache[uid].rating=t.rating||'***';
			this.players_cache[uid].pic_url=t.pic_url||'';
		}		
	},
		
	async load_avatar2 (params = {uid : 0, tar_obj : 0, card_id : 0}) {		

		await this.update_players_cache_data(params.uid);
		const pic_url=this.players_cache[params.uid].pic_url;
		const t=await this.get_texture(pic_url);
		params.tar_obj.texture=t;			
	},

	add_card_ai() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].rating_text1.visible = false;
		objects.mini_cards[0].rating_text2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].table_rating_hl.visible = false;
		objects.mini_cards[0].bcg.texture=gres.mini_player_card_ai.texture;

		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="BOT";
		objects.mini_cards[0].name=objects.mini_cards[0].name_text.text=['Джокер','Joker'][LANG];

		objects.mini_cards[0].rating=100;		
		objects.mini_cards[0].rating_text.text = objects.mini_cards[0].rating;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down(card_id) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog(card_id) {
					
		
		//если какая-то анимация или открыт диалог
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		//console.log( objects.mini_cards[card_id].uid1, objects.mini_cards[card_id].uid2);
		
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();
		
		anim2.add(objects.td_cont,{x:[800, objects.td_cont.sx]}, true, 0.1,'linear');
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 240);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 240);
		
	},
	
	close_table_dialog() {
		sound.play('close');
		anim2.add(objects.td_cont,{x:[objects.td_cont.x, 800]}, false, 0.1,'linear');
	},

	show_invite_dialog(card_id) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};
		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');
			
		
		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;
	
		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');
		
		//копируем предварительные данные
		lobby._opp_data = {uid:objects.mini_cards[card_id].uid,name:objects.mini_cards[card_id].name,rating:objects.mini_cards[card_id].rating};
				
		this.show_feedbacks(lobby._opp_data.uid);
		
		objects.invite_button_title.text=['Пригласить','Send invite'][LANG];

		let invite_available = 	lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[card_id].state==="o" || objects.mini_cards[card_id].state==="b");
		invite_available=invite_available || lobby._opp_data.uid==="BOT";
		invite_available=invite_available && lobby._opp_data.rating >= 50 && my_data.rating >= 50;
		
		//кнопка удаления комментариев
		objects.fb_delete_button.visible=my_data.uid===lobby._opp_data.uid;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[card_id].avatar.texture;
		make_text(objects.invite_name,lobby._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[card_id].rating_text.text;

	},
	
	fb_delete_down(){
		
		objects.fb_delete_button.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);
		
		message.add(['Отзывы удалены','Feedbacks are removed'][LANG])
		
	},

	async show_invite_dialog_from_chat(uid,name) {

		//если какая-то анимация или уже сделали запрос
		if (anim2.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};		
				
		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');			
		
		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;
	
		anim2.add(objects.invite_cont,{x:[800, objects.invite_cont.sx]}, true, 0.15,'linear');
		
		let player_data={uid};		
		await this.update_players_cache_data(uid);
		
		player_data.name=this.players_cache[uid].name;
		player_data.rating=this.players_cache[uid].rating;
		player_data.pic_url=this.players_cache[uid].pic_url;
		
		//копируем предварительные данные
		lobby._opp_data = {uid:player_data.uid,name:player_data.name,rating:player_data.rating};
											
		this.show_feedbacks(lobby._opp_data.uid);
		
		objects.invite_button_title.text=['Пригласить','Send invite'][LANG];

		let invite_available = 	lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && lobby._opp_data.rating >= 50 && my_data.rating >= 50;
		
		//кнопка удаления комментариев
		objects.fb_delete_button.visible=false;
		
		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=PIXI.utils.TextureCache[player_data.pic_url];
		make_text(objects.invite_name,lobby._opp_data.name,230);
		objects.invite_rating.text=player_data.rating;
	},

	async show_feedbacks(uid) {	


			
		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;		
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {
			let _fb = await fbs.ref("fb/" + uid).once('value');
			fb_obj =_fb.val();	
			
			//сохраняем в кэше отзывов
			this.fb_cache[uid]={};			
			this.fb_cache[uid].tm=Date.now();					
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;				
			}else{
				fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
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
			
			
			const fb_height=fb_place.text.textHeight-7;
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
		
		some_process.lobby=function(){};

		//плавно все убираем
		anim2.add(objects.lobby_cont,{alpha:[1, 0]}, false, 0.1,'linear');

		//больше ни ждем ответ ни от кого
		pending_player="";
		
		//отписываемся от изменений состояний пользователей
		fbs.ref(room_name).off();

	},
	
	inst_message(data){
		
		//когда ничего не видно не принимаем сообщения
		if(!objects.lobby_cont.visible) return;
		
		sound.play('inst_msg');
		anim2.add(objects.inst_msg_cont,{alpha:[0, 1]},true,0.4,'linear',false);		
		const t=PIXI.utils.TextureCache[this.players_cache?.[data.uid]?.pic_url];
		objects.inst_msg_avatar.texture=t||PIXI.Texture.WHITE;
		make_text(objects.inst_msg_text,data.msg,300);
		objects.inst_msg_cont.tm=Date.now();
	},
	
	process(){
		
		const tm=Date.now();
		if (objects.inst_msg_cont.visible&&objects.inst_msg_cont.ready)
			if (tm>objects.inst_msg_cont.tm+7000)
				anim2.add(objects.inst_msg_cont,{alpha:[1, 0]},false,0.4,'linear');		

		if (tm>this.sw_header.time){
			this.switch_header();			
			this.sw_header.time=tm+12000;
			this.sw_header.index=(this.sw_header.index+1)%this.sw_header.header_list.length;
			this.switch_header();
		}

	},
	
	async switch_header(){
		
		await anim2.add(objects.lobby_header,{y:[objects.lobby_header.sy, -60],alpha:[1,0]},false,1,'linear',false);	
		objects.lobby_header.text=this.sw_header.header_list[this.sw_header.index];		
		anim2.add(objects.lobby_header,{y:[-60,objects.lobby_header.sy],alpha:[0,1]},true,1,'linear',false);	

		
	},	
	
	wheel_event(dir) {
		
		if (this.pover === 0) return;
		
		if (dir === 1)
			this.fb_down_down();
		else
			this.fb_up_down();
		
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

	close_invite_dialog() {

		sound.play('close');

		if (objects.invite_cont.visible===false)
			return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim2.add(objects.invite_cont,{x:[objects.invite_cont.x, 800]}, false, 0.15,'linear');
	},

	async send_invite() {


		if (objects.invite_cont.ready===false || objects.invite_cont.visible===false)
			return;

		if (anim2.any_on() === true) {
			sound.play('locked');
			return
		};

		if (lobby._opp_data.uid==="BOT")
		{
			await this.close();
			
			//заполняем данные бот-оппонента
			make_text(objects.opp_card_name,lobby._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;	
			
			sp_game.activate('master', 0);
		}
		else
		{
			sound.play('click');
			objects.invite_button_title.text=['Ждите ответ..','Waiting...'][LANG];
			fbs.ref("inbox/"+lobby._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=lobby._opp_data.uid;

		}

	},

	rejected_invite: function() {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.close_invite_dialog();
		big_message.show(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG],'---');


	},

	async accepted_invite(seed) {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=lobby._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		//закрываем меню и начинаем игру
		await lobby.close();
		mp_game.activate("master",seed);
	},

	goto_chat_down(){
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		sound.play('click');
		this.close();
		chat.activate();
		
	},

	swipe_down(dir){
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*800;
		
		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}
		
		anim2.add(objects.cards_cont,{x:[cur_x, new_x]},true,0.2,'easeInOutCubic');
	},

	exit_lobby_down: async function() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	}

}

checker={
	
	
	async start(){
		
		let data=await fbs.ref('BAD_CASE').once('value');
		data=data.val();
			
		
		for (let block in data){
			const cur_obj=data[block];
			if(Array.isArray(cur_obj)){
				for (let line of cur_obj)					
					console.log(JSON.stringify(line));					
			
			}else{
				console.log(JSON.stringify(cur_obj));
				
			}			
		}		
		
	},
	
	async read_chat(){
		
		let data=await fbs.ref('CHAT_ARCH').once('value');
		data=data.val();
		data=Object.keys(data).map((key) => [data[key].game_id,data[key].sender,data[key].data,data[key].tm]);;
		data.sort(function(a,b){return a[3]-b[3]})
		console.log(data);	
	},
	
	async clear_inboxes(){
		
		
		let data=await fbs.ref('inbox').once('value');
		data=data.val();

		for (let d in data){
			
			const tm=data[d].tm;
			if (tm&&tm!=='-'){
				
				const age=Date.now()-tm;
				const days=age/1000/60/60/24;
				if (days>10){
					await await fbs.ref('inbox/'+d).remove();					
					console.log('removed: '+d)
				}

				console.log(days);
				
			}		
			
		}	
		
		
	}
	
	
	
}

var auth = function() {
	
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			async init() {

				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					game_platform="YANDEX";
					try {
						await this.loadScript('https://yandex.ru/games/sdk/v2')						
					} catch (e) {
						alert(e);
					}
					help_obj.yandex();
					return;
				}

				//-----------CRAZYGAMES------------------------------------
				if (s.includes("crazygames")) {
					game_platform="CRAZYGAMES";					
					try {
						await this.loadScript('https://sdk.crazygames.com/crazygames-sdk-v1.js')					
					} catch (e) {
						alert(e);
					}
					help_obj.crazygames();										
					return;
				}
				
				
				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					game_platform="VK";
					
					try {
						await this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')				
					} catch (e) {
						alert(e);
					}
					help_obj.vk()					
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("127.0")) {
					game_platform="debug";
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				game_platform="unknown";
				help_obj.unknown();

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

			get_random_name2 (e_str) {
				
				let rnd_names = ['Crazy','Monkey','Sky','Mad','Doom','Hash','Sway','Ace','Thor'];
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
			
			yandex() {

				
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					YaGames.init({}).then(ysdk => {

						//фиксируем SDK в глобальной переменной
						window.ysdk=ysdk;

						//запрашиваем данные игрока
						return ysdk.getPlayer();


					}).then((_player)=>{


						my_data.name 	= _player.getName();
						my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
						my_data.pic_url = _player.getPhoto('medium');

						//если нету картинки то меняем ее на более прикольную
						if (my_data.pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
							my_data.pic_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid;	

						//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

						//если нет данных то создаем их
						if (my_data.name=="" || my_data.name=='')
							my_data.name = help_obj.get_random_name(my_data.uid);


						help_obj.process_results();

					}).catch((err)=>{

						//загружаем из локального хранилища если нет авторизации в яндексе
						help_obj.local();

					})
				}
			},

			vk() {

				vkBridge.send('VKWebAppInit').then(()=>{
					
					return vkBridge.send('VKWebAppGetUserInfo');
					
				}).then((e)=>{
					
					my_data.name 	= e.first_name + ' ' + e.last_name;
					my_data.uid 	= "vk"+e.id;
					my_data.pic_url = e.photo_100;

					//console.log(`Получены данные игрока от VB MINIAPP:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);
					help_obj.process_results();		
					
				}).catch(function(e){
					
					alert(e);
					
				});

			},

			async get_cg_user_data(event) {
				
				return new Promise(function(resolve, reject) {

					let crazysdk = window.CrazyGames.CrazySDK.getInstance();
					crazysdk.init();
					
					crazysdk.addEventListener('initialized', function(event) {	
						my_data.country_code = event.userInfo.countryCode;	
						resolve();					
					});
					
				});
				
			},

			debug() {

				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = 'https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid;	

				help_obj.process_results();

			},

			local(repeat = 0) {

				//ищем в локальном хранилище
				let local_uid = localStorage.getItem('uid');

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name(my_data.uid);					
					my_data.pic_url		=	'https://api.dicebear.com/7.x/adventurer/svg?seed='+my_data.uid;	

					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					fbs.ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}

			},

			unknown () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results() {


				//отображаем итоговые данные
				//console.log(`Итоговые данные:\nПлатформа:${game_platform}\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

				//обновляем базовые данные в файербейс так могло что-то поменяться
				//fbs.ref("players/"+my_data.uid+"/name").set(my_data.name);
				//fbs.ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
				//fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
					
				//вызываем коллбэк
				resolve("ok");
			}
		}

		help_obj.init();

	});	
	
}

function resize() {
	
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
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

	fbs.ref(room_name+"/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

		if (document.hidden === true)		
			hidden_state_start = Date.now();			
		
		set_state({hidden : document.hidden});
		
}

async function check_daily_reward (last_seen_ts) {
	
	
	//вычисляем номер дня последнего посещения
	let last_seen_day = new Date(last_seen_ts).getDate();		
	
	//считываем текущее время
	await fbs.ref("server_time").set(firebase.database.ServerValue.TIMESTAMP);

	//определяем текущий день
	let _cur_ts = await fbs.ref("server_time").once('value');
	let cur_ts = _cur_ts.val();
	let cur_day = new Date(cur_ts).getDate();
	
	//обновляем время последнего посещения
	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	if (cur_day !== last_seen_day)
	{		
		my_data.money++;
		fbs.ref("players/"+my_data.uid + "/money").set(my_data.money);	
		
		sound.play('daily_reward');

		objects.dr_title.text=['Ежедневный бонус!\n+1$','Daily reward!\n+1$'][LANG];
		await anim2.add(objects.dr_cont,{alpha:[0, 1]}, true, 1,'linear');
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		anim2.add(objects.dr_cont,{alpha:[1, 0]}, false, 1,'linear');
		
	}

}

async function check_blocked(){
	
	//загружаем остальные данные из файербейса
	let _block_data = await fbs.ref("blocked/" + my_data.uid).once('value');
	let block_data = _block_data.val();
	
	if (block_data) my_data.blocked=1;
	
}

async function init_game_env(l) {

	await load_resources();
		
	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

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

	//короткое образ
	fbs=firebase.database();

	//создаем приложение пикси и добавляем тень
	app.stage = new PIXI.Container();
	app.renderer = new PIXI.Renderer({width:M_WIDTH, height:M_HEIGHT,antialias:true});
	document.body.appendChild(app.renderer.view).style["boxShadow"] = "0 0 15px #000000";
	document.body.style.backgroundColor = 'rgb(141,211,200)';
	
	//изменение размера окна
	resize();
	window.addEventListener("resize", resize);

	//идентификатор клиента
	client_id = irnd(10,999999);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;
			
        case "asprite":
			objects[obj_name] = gres[obj_name].animation;
            eval(load_list[i].code0);
            break;
			
        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
				
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;
			
        case "asprite":	
			eval(load_list[i].code1);
            break;
			
        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }

	//запускаем главный цикл
	main_loop();

	//анимация лупы
	some_process.loup_anim=function() {
		objects.id_loup.x=20*Math.sin(game_tick*8)+90;
		objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	}


	//получаем данные авторизации игрока
	try {
		await auth();		
	} catch(e) {
		alert('Ошибка авторизации ' + e)		
	}


	//загружаем аватарку игрока
	let loader=new PIXI.Loader();
	await new Promise(function(resolve, reject) {		
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
		loader.load(function(l,r) {	resolve(l)});
	});

	//устанавливаем фотки в попап и другие карточки
	objects.id_avatar.texture = objects.my_avatar.texture = loader.resources.my_avatar.texture;

	
	//загружаем остальные данные
	let _other_data = await fbs.ref("players/"+my_data.uid).once('value');
	let other_data = _other_data.val();
	
	//это защита от неправильных данных
	my_data.rating = (other_data && other_data.rating) || 1400;
	my_data.games = (other_data && other_data.games) || 0;		
	my_data.name = (other_data && other_data.name) || my_data.name;
	my_data.vk_invite = (other_data && other_data.vk_invite) || 0;
	my_data.vk_share = (other_data && other_data.vk_share) || 0;
		
	//устанавлием мое имя в карточки
	make_text(objects.id_name,my_data.name,150);
	make_text(objects.my_card_name,my_data.name,150);	
	
	
	//номер комнаты
	let rooms_ranges = [0,1490,1660,9999]
	if (my_data.rating > rooms_ranges[0] && my_data.rating <= rooms_ranges[1])
		room_name= 'states';			
	if (my_data.rating > rooms_ranges[1] && my_data.rating <= rooms_ranges[2])
		room_name= 'states2';					
	if (my_data.rating > rooms_ranges[2] && my_data.rating <= rooms_ranges[3])
		room_name= 'states3';	


	//my_data.rating=2001;
	//room_name= 'states4';	
	
	//это путь к чату
	chat_path='states_chat';
	
	//устанавливаем рейтинг в попап
	objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

	//обновляем почтовый ящик
	fbs.ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

	//подписываемся на новые сообщения
	fbs.ref("inbox/"+my_data.uid).on('value', (snapshot) => {process_new_message(snapshot.val());});
	
	//обновляем базовые данные в файербейс так могло что-то поменяться
	fbs.ref("players/"+my_data.uid+"/name").set(my_data.name);
	fbs.ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);				
	fbs.ref("players/"+my_data.uid+"/rating").set(my_data.rating);
	fbs.ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	
	//устанавливаем мой статус в онлайн
	set_state({state : 'o'});

	//сообщение для дубликатов
	fbs.ref("inbox/"+my_data.uid).set({message:"CLIEND_ID",tm:Date.now(),client_id:client_id});

	//отключение от игры и удаление не нужного
	fbs.ref("inbox/"+my_data.uid).onDisconnect().remove();
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	//это событие когда меняется видимость приложения
	document.addEventListener("visibilitychange", vis_change);

	//событие ролика мыши в карточном меню
	window.addEventListener("wheel", (event) => {	
		//lobby.wheel_event(Math.sign(event.deltaY));
		chat.wheel_event(Math.sign(event.deltaY));
	});	
	window.addEventListener('keydown', function(event) { feedback.key_down(event.key)});

	//проверяем блокировку
	check_blocked();
	
	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);


	//ждем одну секунду
	await new Promise((resolve, reject) => {setTimeout(resolve, 1000);});

	some_process.loup_anim = function(){};

	anim2.add(objects.id_cont,{y:[objects.id_cont.sy, -200]}, false, 0.5,'easeInBack');
	
	//контроль за присутсвием
	var connected_control = fbs.ref(".info/connected");
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});

	//показыаем основное меню
	main_menu.activate();


	
}

async function load_resources() {

	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/durak/"
	//git_src=""

	game_res=new PIXI.Loader();	
	
	game_res.add("m2_font", git_src+'fonts/balsamic/font.fnt');
	game_res.add("m3_font", git_src+'fonts/MS_Comic_Sans/font.fnt');
	
	
	game_res.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	game_res.add('message',git_src+'sounds/message.mp3');
	game_res.add('lose',git_src+'sounds/lose.mp3');
	game_res.add('win',git_src+'sounds/win.mp3');
	game_res.add('click',git_src+'sounds/click.mp3');
	game_res.add('close',git_src+'sounds/close.mp3');
	game_res.add('locked',git_src+'sounds/locked.mp3');
	game_res.add('clock',git_src+'sounds/clock.mp3');
	game_res.add('card',git_src+'sounds/card2.mp3');
	game_res.add('card_take',git_src+'sounds/card.mp3');
	game_res.add('confirm_dialog',git_src+'sounds/confirm_dialog.mp3');
	game_res.add('move',git_src+'sounds/move.mp3');
	game_res.add('done',git_src+'sounds/done.mp3');
	game_res.add('razdacha',git_src+'sounds/razdacha.mp3');
	game_res.add('swift',git_src+'sounds/swift.mp3');
	game_res.add('inc_card',git_src+'sounds/inc_card.mp3');
	game_res.add('take',git_src+'sounds/take.mp3');
	game_res.add('keypress',git_src+'sounds/keypress.mp3');
	game_res.add('online_message',git_src+'sounds/online_message.mp3');
	game_res.add('inst_msg',git_src+'sounds/inst_msg.mp3');
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/RUS/" + load_list[i].name + "." +  load_list[i].image_format);


	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");

	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function loop_anum () {
	
	objects.id_loup.x=20*Math.sin(game_tick*8)+90;
	objects.id_loup.y=20*Math.cos(game_tick*8)+150;
	
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