var scriptname = "selectAreas";
const reverse = !GlobalVars.getBoolean(scriptname);
GlobalVars.putBoolean(scriptname, reverse);
const Box = Java.type("xyz.wagyourtail.jsmacros.client.api.classes.render.components3d.Box");

const Boxes = [];
var newBox = {};
var RenderList = [];

function rgb2int(r, g, b) {
	if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) 
		throw new Error("RGB values must be in the range 0-255");
	return (r << 16) | (g << 8) | b;
}

//向量与立方体相交 我也看不懂，但是能用
function checkRayIntersectsBox(rayOrigin, rayDirection, boxMin, boxMax) {
	let tmin = (boxMin.getX() - rayOrigin.getX()) / rayDirection.getX();
	let tmax = (boxMax.getX() - rayOrigin.getX()) / rayDirection.getX();
	if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
	let tymin = (boxMin.getY() - rayOrigin.getY()) / rayDirection.getY();
	let tymax = (boxMax.getY() - rayOrigin.getY()) / rayDirection.getY();
	if (tymin > tymax) [tymin, tymax] = [tymax, tymin];
	if (tmin > tymax || tymin > tmax) return false;
	if (tymin > tmin) tmin = tymin;
	if (tymax < tmax) tmax = tymax;
	let tzmin = (boxMin.getZ() - rayOrigin.getZ()) / rayDirection.getZ();
	let tzmax = (boxMax.getZ() - rayOrigin.getZ()) / rayDirection.getZ();
	if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];
	return !(tmin > tzmax || tzmin > tmax);
}



//检查玩家手持物品
function HoldBlazeRod(){
	return Player.openInventory().getSlot(Player.openInventory().getSlots("hotbar")[Player.openInventory().getSelectedHotbarSlotIndex()] + (Player.openInventory().getMap().has("delete") ? 2: 0)).getItemId() == "minecraft:blaze_rod";
}

function main(){
	if(!GlobalVars.getBoolean(scriptname)) return;
	//开启脚本提示
	Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" enabled").withColor(0xc).build());
	Chat.log(
		Chat.createTextBuilder()
		.append("\n手持烈焰棒\n").withColor(0xe)
		.append("使用左右键设置角点\n").withColor(0xe)
		.append(`回车确定选区\n`).withColor(0xe)
		.append("中键对准删除选区\n").withColor(0xe)
		.append("再次回车复制到剪贴板\n").withColor(0xe)
	);

	//设置玩家准星为空
	if(HoldBlazeRod()) {
		Player.getInteractionManager().setTargetMissed();
	}
	

	//实时检测物品并设置玩家准星为空
	const HeldItemChange = JsMacros.on("HeldItemChange", JavaWrapper.methodToJava(event => {
		if(event.item.getItemId() == "minecraft:blaze_rod"){
			Player.getInteractionManager().setTargetMissed();
		}else{
			Player.getInteractionManager().clearTargetOverride();
		}
		
	}));

	//左键检测
	const AttackListener = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		if(event.key == "key.mouse.left" && event.action == 1){
			let targetBlock = Player.getPlayer().rayTraceBlock(32,false);
			if(HoldBlazeRod() && targetBlock != null ){
				newBox.pos1 = targetBlock.getBlockPos();
				Chat.log(
					Chat.createTextBuilder()
						.append("设置")
						.append(`pos1:`).withColor(0x6)
						.append(` ${newBox.pos1.getX()},${newBox.pos1.getY()},${newBox.pos1.getZ()}`).withColor(0xa)
				);
			}
		}
	}));

	//右键检测
	const InteractListener = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		
		if(event.key == "key.mouse.right" && event.action == 1){
			let targetBlock = Player.getPlayer().rayTraceBlock(32,false);
			if(HoldBlazeRod() && targetBlock != null){
				newBox.pos2 = targetBlock.getBlockPos();
				Chat.log(
					Chat.createTextBuilder()
						.append("设置")
						.append(`pos2:`).withColor(0x6)
						.append(` ${newBox.pos2.getX()},${newBox.pos2.getY()},${newBox.pos2.getZ()}`).withColor(0xa)
				);
			}
		}
	}));
	//左右键设置pos1 和 pos2

	//中键检测 删除选区
	const DeleteListener = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		if(HoldBlazeRod() && event.key == "key.mouse.middle" && event.action == 1){
			let player = Player.getPlayer();
			let eyePos = player.getEyePos();
			let viewDirection = PositionCommon.createLookingVector(player.asServerEntity()).getEnd();
			for (let i = Boxes.length - 1; i >= 0; i--) {
				if (checkRayIntersectsBox(eyePos, viewDirection, Boxes[i].pos1, Boxes[i].pos2)) Boxes.splice(i, 1);
			}
		}
	}));


	//Enter检测
	const EnterListener = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		if( event.key == "key.keyboard.enter" && event.action == 1){
			if(newBox.pos1 != null && newBox.pos2 != null){
				let pos1 = PositionCommon.createBlockPos(
					Math.min(newBox.pos1.getX(), newBox.pos2.getX()),
					Math.min(newBox.pos1.getY(), newBox.pos2.getY()),
					Math.min(newBox.pos1.getZ(), newBox.pos2.getZ())
				).toPos3D();
				let pos2 = PositionCommon.createBlockPos(
					Math.max(newBox.pos1.getX(), newBox.pos2.getX()),
					Math.max(newBox.pos1.getY(), newBox.pos2.getY()),
					Math.max(newBox.pos1.getZ(), newBox.pos2.getZ())
				).toPos3D().add(1,1,1);
				Boxes.push({pos1:pos1,pos2:pos2});
				Chat.log(
					Chat.createTextBuilder()
						.append("确认区域:")
						.append(` ${newBox.pos1.getX()},${newBox.pos1.getY()},${newBox.pos1.getZ()}`).withColor(0xa)
						.append("到")
						.append(` ${newBox.pos2.getX()},${newBox.pos2.getY()},${newBox.pos2.getZ()}`).withColor(0xa)
						.build()
				);
				newBox = {};
			}else if(newBox.pos1 == null && newBox.pos2 == null){
// ==========
let text = `\
{
    "condition": "any_of",
    "terms": [\
`;
Boxes.forEach(b => {
text += `
        {
			"condition": "entity_properties",
			"entity": "this",
			"predicate": {
				"location": {
					"position": {
						"x": {
							"max": ${b.pos2.getX()}.0,
							"min": ${b.pos1.getX()}.0
						},
						"y": {
							"max": ${b.pos2.getY()}.0,
							"min": ${b.pos1.getY()}.0
						},
						"z": {
							"max": ${b.pos2.getZ()}.0,
							"min": ${b.pos1.getZ()}.0
						}
					}
				}
			}
		},\
`;
});
text = text.slice(0, -1);
text += `
    ]
}\
`
// ==========
				Utils.copyToClipboard(text);
				Chat.log(Chat.createTextBuilder().append("已复制到剪贴板").withColor(0xa))
			}else{
				Chat.log("缺失角点位置");
				Chat.log(
					Chat.createTextBuilder()
						.append(`\n pos1: `).withColor(0x6)
						.append(`${newBox.pos1}\n`).withColor(0xa)
						.append(` pos2: `).withColor(0x6)
						.append(`${newBox.pos2}`).withColor(0xa)
						.build()
				);
			}
		}
	}));
	
	//按下Enter 检测 pos1 pos2 然后确认区域
	const Close = JsMacros.on("Key", JavaWrapper.methodToJava(event => {
		if(!GlobalVars.getBoolean(scriptname)){
			Chat.actionbar(Chat.createTextBuilder().append("[").withColor(0x7).append(scriptname).withColor(0x5).append("]").withColor(0x7).append(" disabled").withColor(0xc).build());
			AttackListener.off();
			InteractListener.off();
			DeleteListener.off();
			EnterListener.off();
			HeldItemChange.off();
			Player.getInteractionManager().clearTargetOverride();
			Hud.clearDraw3Ds();
			Close.off()
		}
	}));

	while (GlobalVars.getBoolean(scriptname)) {
		Render();
		Client.waitTick(1);
	}
}



//新建Box渲染
function addBox(){
	return new Box(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0, true, false);
	//				x	 y	 z 		x	y	z	 line face fill cull
}

function Render(){
	Hud.clearDraw3Ds();
	RenderList = [];
	let targetBlock = Player.getPlayer().rayTraceBlock(32,false);

	//指向
	if(HoldBlazeRod() && targetBlock != null){
		let box = addBox();
		/// 新建一个Box 设置位置到 玩家看的方块的 中心点 |方块半径
		box.setPosToPoint(targetBlock.getBlockPos().toPos3D().add(0.5,0.5,0.5), 0.501 );
		box.setFillColor(rgb2int(255, 255, 255), 128);
		box.setColor(rgb2int(0, 255, 255), 255);
		//添加到渲染队列 （？）
		RenderList.push(box);
	}

	//pos1
	if(newBox.pos1 != null){
		let box = addBox();
		// 新建一个Box 设置位置到 玩家看的方块的 中心点 |方块半径
		box.setPosToPoint(newBox.pos1.toPos3D().add(0.5,0.5,0.5), 0.501 );
		box.setFillColor(rgb2int(255, 64, 64), 64);
		box.setColor(rgb2int(0, 0, 0), 0);
		//添加到渲染队列 （？）
		RenderList.push(box);
	}

	//pos2
	if(newBox.pos2 != null){
		let box = addBox();
		// 新建一个Box 设置位置到 玩家看的方块的 中心点 |方块半径
		box.setPosToPoint(newBox.pos2.toPos3D().add(0.5,0.5,0.5), 0.501 );
		box.setFillColor(rgb2int(64, 64, 255), 64);
		box.setColor(rgb2int(0, 0, 0), 0);
		//添加到渲染队列 （？）
		RenderList.push(box);
	}

	//Boxes
	if(Boxes.length > 0){
		Boxes.forEach(b=>{
			let box = addBox();
			box.setPos(b.pos1.getX()-0.01, b.pos1.getY()-0.01, b.pos1.getZ()-0.01, b.pos2.getX()+0.01, b.pos2.getY()+0.01, b.pos2.getZ()+0.01);
			box.setFillColor(rgb2int(255, 255, 255), 16);
			box.setColor(rgb2int(255, 160, 0), 255);
			RenderList.push(box);
		});
	}

	RenderList.forEach(box=>{
		Hud.createDraw3D().register().addBox(box);
	});
}
main();
/*
⠀⠀⠀⣠⠤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀
⠀⠀⡜⠁⠀⠈⢢⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠋⠷⠶⠱⡄
⠀⢸⣸⣿⠀⠀⠀⠙⢦⡀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠫⢀⣖⡃⢀⣸⢹
⠀⡇⣿⣿⣶⣤⡀⠀⠀⠙⢆⠀⠀⠀⠀⠀⣠⡪⢀⣤⣾⣿⣿⣿⣿⣸
⠀⡇⠛⠛⠛⢿⣿⣷⣦⣀⠀⣳⣄⠀⢠⣾⠇⣠⣾⣿⣿⣿⣿⣿⣿⣽
⠀⠯⣠⣠⣤⣤⣤⣭⣭⡽⠿⠾⠞⠛⠷⠧⣾⣿⣿⣯⣿⡛⣽⣿⡿⡼
⠀⡇⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣿⣮⡛⢿⠃
⠀⣧⣛⣭⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣷⣎⡇
⠀⡸⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣷⣟⡇
⣜⣿⣿⡧⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⣸⣿⡜⡄
⠉⠉⢹⡇⠀⠀⠀⢀⣞⠡⠀⠀⠀⠀⠀⠀⡝⣦⠀⠀⠀⠀⢿⣿⣿⣹
⠀⠀⢸⠁⠀⠀⢠⣏⣨⣉⡃⠀⠀⠀⢀⣜⡉⢉⣇⠀⠀⠀⢹⡄⠀⠀
⠀⠀⡾⠄⠀⠀⢸⣾⢏⡍⡏⠑⠆⠀⢿⣻⣿⣿⣿⠀⠀⢰⠈⡇⠀⠀
⠀⢰⢇⢀⣆⠀⢸⠙⠾⠽⠃⠀⠀⠀⠘⠿⡿⠟⢹⠀⢀⡎⠀⡇⠀⠀
⠀⠘⢺⣻⡺⣦⣫⡀⠀⠀⠀⣄⣀⣀⠀⠀⠀⠀⢜⣠⣾⡙⣆⡇⠀⠀
⠀⠀⠀⠙⢿⡿⡝⠿⢧⡢⣠⣤⣍⣀⣤⡄⢀⣞⣿⡿⣻⣿⠞⠀⠀⠀
⠀⠀⠀⢠⠏⠄⠐⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠳⢤⣉⢳⠀⠀⠀
⢀⡠⠖⠉⠀⠀⣠⠇⣿⡿⣿⡿⢹⣿⣿⣿⣿⣧⣠⡀⠀⠈⠉⢢⡀⠀
⢿⠀⠀⣠⠴⣋⡤⠚⠛⠛⠛⠛⠛⠛⠛⠛⠙⠛⠛⢿⣦⣄⠀⢈⡇⠀
⠈⢓⣤⣵⣾⠁⣀⣀⠤⣤⣀⠀⠀⠀⠀⢀⡤⠶⠤⢌⡹⠿⠷⠻⢤⡀
⢰⠋⠈⠉⠘⠋⠁⠀⠀⠈⠙⠳⢄⣀⡴⠉⠀⠀⠀⠀⠙⠂⠀⠀⢀⡇
⢸⡠⡀⠀⠒⠂⠐⠢⠀⣀⠀⠀⠀⠀⠀⢀⠤⠚⠀⠀⢸⣔⢄⠀⢾⠀
⠀⠑⠸⢿⠀⠀⠀⠀⢈⡗⠭⣖⡒⠒⢊⣱⠀⠀⠀⠀⢨⠟⠂⠚⠋⠀
⠀⠀⠀⠘⠦⣄⣀⣠⠞⠀⠀⠀⠈⠉⠉⠀⠳⠤⠤⡤⠞⠀⠀⠀⠀⠀
*/