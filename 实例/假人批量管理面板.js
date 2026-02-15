const CONFIG_PATH = "./config/fakePlayers.json"

function rgb2int(r, g, b) {
	return (r << 16) | (g << 8) | b;
}

function ensureConfigDir() {
	const configDir = "./config"
	if (!FS.exists(configDir)) {
		FS.makeDir(configDir)
	}
}

function parseNamePattern(pattern) {
	const match = pattern.match(/^(.*)%\((\d+),(\d+),(\d+)\)%$/)
	if (match) {
		const [_, prefix, start, step, count] = match
		return Array.from({ length: parseInt(count) }, (_, i) => `${prefix}${parseInt(start) + i * parseInt(step)}`)
	}
	const rangeMatch = pattern.match(/^(.*)%(\d+)~(\d+)%$/)
	if (rangeMatch) {
		const [_, prefix, start, end] = rangeMatch
		const names = []
		for (let i = parseInt(start); i <= parseInt(end); i++) names.push(`${prefix}${i}`)
		return names
	}
	return [pattern]
}

function parseArrayField(input, count) {
	if (!input || typeof input !== "string") return Array(count).fill("~ ~ ~")

	const parts = input.trim().split(/\s+/)
	if (parts.length !== 2 && parts.length !== 3) return Array(count).fill(input)

	function expand(token) {
		// 匹配形式：~%(start,step,count)% 或 %(start,step,count)%
		const match = token.match(/^~?%\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,\)]+)\s*\)%$/)
		if (match) {
			const hasTilde = token.startsWith("~")
			const [_, startRaw, stepRaw, lenRaw] = match
			const start = parseFloat(startRaw)
			const step = parseFloat(stepRaw)
			const len = parseInt(lenRaw)
			return Array.from({ length: len }, (_, i) => {
				const val = start + i * step
				return hasTilde ? `~${val}` : `${val}`
			})
		} else {
			// fallback: 返回原始 token
			return [token]
		}
	}		

	const list1 = expand(parts[0])
	const list2 = expand(parts[1])
	const list3 = parts[2] !== undefined ? expand(parts[2]) : []

	const result = []
	if (parts.length === 3) {
		for (let x of list1) {
			for (let y of list2) {
				for (let z of list3) {
					result.push(`${x} ${y} ${z}`)
				}
			}
		}
	} else {
		for (let yaw of list1) {
			for (let pitch of list2) {
				result.push(`${yaw} ${pitch}`)
			}
		}
	}

	// 循环填满或者截断
	if (result.length < count) {
		const repeated = []
		for (let i = 0; i < count; i++) {
			repeated.push(result[i % result.length])
		}
		return repeated
	} else {
		return result.slice(0, count)
	}
}




function getFullName(name, prefix, suffix) {
	return (prefix || "") + name + (suffix || "")
}

function readConfigData() {
	ensureConfigDir()
	if (!FS.exists(CONFIG_PATH)) return { configList: [], temp: {}, functionList: []}
	try {
		return JSON.parse(FS.open(CONFIG_PATH).read())
	} catch (e) {
		Chat.log("配置文件格式错误")
		return { configList: [], temp: {}, functionList: []}
	}
}

function saveConfigData(data) {
	FS.open(CONFIG_PATH).write(JSON.stringify(data, null, 2))
}

function sendSpawnCommand(name, pos, rot, dim) {
	let cmd = `/player ${name} spawn`
	cmd += ` at ${pos?.[0] || "~"} ${pos?.[1] || "~"} ${pos?.[2] || "~"}`
	cmd += ` facing ${rot?.[0] || "~"} ${rot?.[1] || "~"}`
	cmd += ` in ${dim || World.getDimension()}`
	Chat.say(cmd)
}


function showMainScreen() {
	const { configList, temp, functionList} = readConfigData()
	
	let inputName = temp.inputName || ""
	let inputPos = temp.inputPos || ""
	let inputRot = temp.inputRot || ""
	let inputDim = temp.inputDim || ""
	let prefix = temp.prefix || ""
	let suffix = temp.suffix || ""
	let buttonName = temp.buttonName || ""
	let buttonCommand = temp.buttonCommand || ""

	const ScreenMain = Hud.createScreen("FakePlayer Control", false)
	const ScreenMore =  Hud.createScreen("More", false)
	
	ScreenMain.shouldPause = false
	ScreenMore.shouldPause = false

	const moreName = []

	ScreenMain.setOnInit(JavaWrapper.methodToJava(screen => {
		const Width = Hud.getWindowWidth()
		const Height = Hud.getWindowHeight()
		let x = 10, y = 50
		
		configList.forEach((group, groupIndex) => {
			const groupNames = group.baseNames || group.names
			screen.addText(`[${groupNames.length > 1 ? groupNames[0] + " - " + groupNames[groupNames.length - 1] : groupNames[0]}]`, x, y + 5, rgb2int(100, 255, 255), true)

			let bx = x + 140
			screen.addButton(bx, y, 40, 20, "Spawn", JavaWrapper.methodToJava(() => {
				const count = groupNames.length
				const posList = parseArrayField(group.pos, count)
				const rotList = parseArrayField(group.rot, count)
				groupNames.forEach((name, i) => {
					const [x, y, z] = (posList[i] || "~ ~ ~").split(" ")
					const [yaw, pitch] = (rotList[i] || "~ ~").split(" ")
					sendSpawnCommand(name, [x, y, z], [yaw, pitch], group.dim)
				})
			}))

			screen.addButton(bx + 40, y, 40, 20, "Kill", JavaWrapper.methodToJava(() => {
				groupNames.forEach((name, i) => {
					Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} kill`)
				})
			}))

			screen.addButton(bx + 80, y, 40, 20, "更多", JavaWrapper.methodToJava(() => {
				moreName.length = 0
				groupNames.forEach((name, i) => {
					moreName.push(getFullName(name, group.prefix, group.suffix))
				})
				Hud.openScreen(ScreenMore)
			}))

			screen.addButton(bx + 160, y, 20, 20, "×", JavaWrapper.methodToJava(() => {
				configList.splice(groupIndex, 1)
				saveConfigData({ configList, temp, functionList})
				ScreenMain.reloadScreen()
			}))
			const controlName = `FakePlayerControl_${group.namePattern}`
			screen.addButton(bx + 120, y, 40, 20, GlobalVars.getBoolean(controlName)?"detach":"control", JavaWrapper.methodToJava(() => {
				const reverse = !GlobalVars.getBoolean(controlName);
				GlobalVars.putBoolean(controlName, reverse);
				if(GlobalVars.getBoolean(controlName)){
					groupNames.forEach((name, i) => {
						Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} hotbar ${Player.openInventory().getSelectedHotbarSlotIndex()+1}`)
					})
					const Hotbar = JsMacros.on("MouseScroll", JavaWrapper.methodToJava(event=>{
						groupNames.forEach((name, i) => {
							Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} hotbar ${Player.openInventory().getSelectedHotbarSlotIndex()+1}`)
						})
					}))
					const Keys = KeyBind.getKeyBindings()
					const Move = JsMacros.on("Key", JavaWrapper.methodToJava(event=>{
						switch(event.key){
							case Keys.get("key.forward"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} move forward`)
									})
								}else{
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} stop`)
									})
								}
							break
							case Keys.get("key.left"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} move left`)
									})
								}else{
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} stop`)
									})
								}
							break
							case Keys.get("key.back"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} move backward`)
									})
								}else{
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} stop`)
									})
								}
							break
							case Keys.get("key.right"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} move right`)
									})
								}else{
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} stop`)
									})
								}
							break
							case Keys.get("key.sneak"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} sneak`)
									})
								}else{
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} unsneak`)
									})
								}
							break
							case Keys.get("key.jump"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} jump continuous`)
									})
								}else{
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} jump`)
									})
								}
							break
							case Keys.get("key.sprint"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} sprint`)
									})
								}else{
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} unsprint`)
									})
								}
							break
							case Keys.get("key.attack"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} attack`)
									})
								}
							break
							case Keys.get("key.use"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} use`)
									})
								}
							break
							case Keys.get("key.drop"):
								if(event.action == 1){
									if(KeyBind.getPressedKeys().contains("key.keyboard.left.control")){
										groupNames.forEach((name, i) => {
											Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} dropStack`)
										})
									}else{
										groupNames.forEach((name, i) => {
											Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} drop`)
										})
									}
									
								}
							break
							case Keys.get("key.swapOffhand"):
								if(event.action == 1){
									groupNames.forEach((name, i) => {
										Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} swapHands`)
									})
								}
							break
							case Keys.get("key.hotbar.1"):
							case Keys.get("key.hotbar.2"):
							case Keys.get("key.hotbar.3"):
							case Keys.get("key.hotbar.4"):
							case Keys.get("key.hotbar.5"):
							case Keys.get("key.hotbar.6"):
							case Keys.get("key.hotbar.7"):
							case Keys.get("key.hotbar.8"):
							case Keys.get("key.hotbar.9"):
								groupNames.forEach((name, i) => {
									Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} hotbar ${Player.openInventory().getSelectedHotbarSlotIndex()+1}`)
								})
							break
						}
					}))
					const Tick = JsMacros.on("Tick", JavaWrapper.methodToJava(()=>{
						Chat.actionbar(`正在控制${group.namePattern}`)
						groupNames.forEach((name, i) => {
							Chat.say(`/player ${getFullName(name, group.prefix, group.suffix)} look ${Player.getPlayer().getPitch()} ${Player.getPlayer().getYaw()}`)
						})
						if(!GlobalVars.getBoolean(controlName)){
							Tick.off()
							Move.off()
							Hotbar.off()
						}
					}))
				}
				ScreenMain.reloadScreen()
			}))

			y += 30
		})

		const inputX = 400
		const inputLength = 200
		const textX = 370
		const baseY = 50
		screen.addText("name", textX, baseY+0, rgb2int(255, 255, 255), false)
		screen.addText(" pos", textX, baseY+25, rgb2int(255, 255, 255), false)
		screen.addText(" fac", textX, baseY+50, rgb2int(255, 255, 255), false)
		screen.addText(" dim", textX, baseY+75, rgb2int(255, 255, 255), false)

		const nameInput = screen.addTextInput(inputX, baseY-5, inputLength, 20, "name", JavaWrapper.methodToJava(e => inputName = e.toString()))
		nameInput.setText(inputName)

		const posInput = screen.addTextInput(inputX, baseY+20, inputLength, 20, "pos", JavaWrapper.methodToJava(e => inputPos = e.toString()))
		posInput.setText(inputPos)

		const rotInput = screen.addTextInput(inputX, baseY+45, inputLength, 20, "fac", JavaWrapper.methodToJava(e => inputRot = e.toString()))
		rotInput.setText(inputRot)

		const dimInput = screen.addTextInput(inputX, baseY+70, inputLength, 20, "dim", JavaWrapper.methodToJava(e => inputDim = e.toString()))
		dimInput.setText(inputDim)

		const prefixInput = screen.addTextInput(inputX, baseY+185, inputLength, 20, "prefix", JavaWrapper.methodToJava(e => prefix = e.toString()))
		prefixInput.setText(prefix)

		const suffixInput = screen.addTextInput(inputX, baseY+210, inputLength, 20, "suffix", JavaWrapper.methodToJava(e => suffix = e.toString()))
		suffixInput.setText(suffix)

		screen.addText("prefix", textX, baseY+190, rgb2int(255, 255, 255), false)
		screen.addText("suffix", textX, baseY+215, rgb2int(255, 255, 255), false)

		screen.addButton(400, baseY+100, 80, 20, "添加假人", JavaWrapper.methodToJava(() => {
			const names = parseNamePattern(inputName)
			const newEntry = {
				namePattern: inputName,
				baseNames: names,
				pos: inputPos,
				rot: inputRot,
				dim: inputDim,
				prefix,
				suffix
			}
			
			configList.push(newEntry)
			saveConfigData({ configList, temp: { inputName, inputPos, inputRot, inputDim, prefix, suffix , buttonName, buttonCommand }, functionList })
			ScreenMain.reloadScreen()
		}))
	}))

	ScreenMain.setOnClose(JavaWrapper.methodToJava(() => {
		saveConfigData({
			configList,
			temp: {
				inputName,
				inputPos,
				inputRot,
				inputDim,
				prefix,
				suffix,
				buttonName,
				buttonCommand
			},
			functionList
		})
	}))

	
	ScreenMore.setOnInit(JavaWrapper.methodToJava(screen => {
		const Width = Hud.getWindowWidth()
		const Height = Hud.getWindowHeight()
		screen.addButton(10, 10, 40, 20, "<-back", JavaWrapper.methodToJava(() => {
			saveConfigData({
				configList,
				temp: {
					inputName,
					inputPos,
					inputRot,
					inputDim,
					prefix,
					suffix,
					buttonName,
					buttonCommand
				},
				functionList
			})
			Hud.openScreen(ScreenMain)
		}))
		const buttonNameInput = screen.addTextInput(520, 200, 120, 20, "buttonName", JavaWrapper.methodToJava(e => buttonName = e.toString()))
		buttonNameInput.setText(buttonName)

		const buttonCommandInput = screen.addTextInput(520, 225, 120, 20, "buttonCommand", JavaWrapper.methodToJava(e => buttonCommand = e.toString()))
		buttonCommandInput.setText(buttonCommand)

		screen.addText("Name", 480, 205, rgb2int(255, 255, 255), false)
		screen.addText("function", 480, 230, rgb2int(255, 255, 255), false)

		screen.addButton(550, 250, 80, 20, "添加", JavaWrapper.methodToJava(() => {
			const newEntry = {
				buttonName,
				buttonCommand
			}
			
			functionList.push(newEntry)
			saveConfigData({ configList, temp: { inputName, inputPos, inputRot, inputDim, prefix, suffix , buttonName, buttonCommand }, functionList })
			ScreenMore.reloadScreen()
		}))
		let x = 0
		let y = 35
		let size = 7
		functionList.forEach(({buttonName, buttonCommand}, index)=>{
			let length = buttonName.length*size + 10
			x += 10
			
			if(length >= Width/5){
				length = Width
			}
			if(x + length >= Width/5){
				y += 25
				x = 10
			}
			screen.addButton(x, y, length, 20, buttonName, JavaWrapper.methodToJava(()=>{
				if(screen.isAltDown()){
					functionList.splice(index, 1)
					saveConfigData({ configList, temp, functionList})
					ScreenMore.reloadScreen()
					return
				}
				moreName.forEach(name=>{
					Chat.say(`/player ${name} ${buttonCommand}`)
				})
			}))
			x += length
		})
	}))

	
	Hud.openScreen(ScreenMain)
}

showMainScreen()
