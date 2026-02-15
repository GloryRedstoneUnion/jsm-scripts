//改版本的话直接找MojangMapping改就行

const scriptname = "textdisplay"

// === Toggle 开关 ===
const reverse = !GlobalVars.getBoolean(scriptname)
GlobalVars.putBoolean(scriptname, reverse)
Chat.actionbar(`§7[§5${scriptname}§7] ${reverse ? "§aenabled" : "§cdisabled"}`)

// === Minecraft类引用 ===

let world = Client.getMinecraft().field_1687; //net.minecraft.class_310 level

const TextDisplay = Java.type('net.minecraft.class_8113$class_8123') //net.minecraft.world.entity.Display$TextDisplay
const EntityType = Java.type('net.minecraft.class_1299') //net.minecraft.world.entity.EntityType
const Component = Java.type('net.minecraft.class_2561') //net.minecraft.network.chat.Component
const Transformation = Java.type('net.minecraft.class_4590') //com.mojang.math.Transformation
const Vec3d = Java.type('net.minecraft.class_243') //net.minecraft.world.phys.Vec3
const Vec3f = Java.type('org.joml.Vector3f') //org.joml.Vector3f
const Quaternionf = Java.type('org.joml.Quaternionf') //org.joml.Quaternionf
const BillboardConstraints = Java.type('net.minecraft.class_8113$class_8114') //net.minecraft.world.entity.Display$BillboardConstraints
const Brightness = Java.type('net.minecraft.class_8104') //net.minecraft.util.Brightness
const RemovalReason = Java.type('net.minecraft.class_1297$class_5529') //net.minecraft.world.entity.Entity$RemovalReason

// === TextDisplayManager ===
const TextDisplayManager = {
    entities: [],
    baseId: 500000,
    counter: 0,

    /** 在主线程运行 */
    runMain(fn) {
        Client.runOnMainThread(JavaWrapper.methodToJava(fn))
    },

    /** 生成一个 TextDisplay */
    spawn(component, pos, rot = {yaw:0.0, pitch:0.0}) {
        this.runMain(() => {
            
            let id = this.baseId + this.counter++
            let e = new TextDisplay(EntityType.field_42457, world) //field_42457 TEXT_DISPLAY TextDisplay(EntityType, level)
            //let vec = new Vec3d(pos.getX(), pos.getY(), pos.getZ()) //Vec3(double, double, double)

            e.method_5838(id) //net.minecraft.world.entity.Entity setId(int arg0)
            e.method_48911(component) //net.minecraft.world.entity.Display$TextDisplay setText(Component arg0)
            //e.method_33574(vec) //net.minecraft.world.entity.Entity setPos(Vec3 arg0)

            //===== Entity =====
            e.method_5814(pos.getX(), pos.getY(), pos.getZ()) //setPos(double arg0, double arg1, double arg2)
            e.method_36456(rot.yaw) //setYRot(float arg0)
            e.method_36457(rot.pitch) //setXRot(float arg0)

            //===== Display =====
            let translation = new Vec3f(0.0, 0.0, 0.0) //org.joml.Vector3f(float x, float y, float z)
            let leftRotation = new Quaternionf(0.0, 0.0, 0.0, 1.0) //org.joml.Quaternionf()
            let scale = new Vec3f(1.0, 1.0, 1.0) //org.joml.Vector3f(float x, float y, float z)
            let rightRotation = new Quaternionf(0.0, 0.0, 0.0, 1.0) //org.joml.Quaternionf()

            let transformation = new Transformation(translation, leftRotation, scale, rightRotation) 
                //(org.joml.Vector3f translation, org.joml.Quaternionf leftRotation, org.joml.Vector3f scale, org.joml.Quaternionf rightRotation)
            e.method_48849(transformation) //setTransformation(Transformation arg0)
            e.method_52524(0) //setTransformationInterpolationDuration(int arg0)
            e.method_52525(0) //setTransformationInterpolationDelay(int arg0)
            e.method_52526(0) //setPosRotInterpolationDuration(int arg0)
            e.method_48847(BillboardConstraints.field_42407) //setBillboardConstraints(Display$BillboardConstraints arg0) 
            //                                              //field_42406: FIXED, field_42407: VERTICAL, field_42408: HORIZONTAL, field_42409: CENTER 
            let brightness = new Brightness(15, 15) //(int sky, int arg1)
            e.method_48846(brightness) //setBrightnessOverride(Brightness arg0)


            //===== TextDisplay =====
            e.method_48908(200) //setLineWidth(int arg0)
            e.method_48909(-1) //setTextOpacity(byte arg0) byte -128~127
            e.method_48910(0x40000000) //setBackgroundColor(int arg0)
            e.method_48912(flags(false, false, false, false, false)) //setFlags(byte arg0)
            //Alignment_RIGHT   Alignment_LEFT  DEFAULT_BACKGROUND see_through  shadow



            world.method_53875(e) //net.minecraft.client.multiplayer.ClientLevel addEntity(Entity arg0)
            this.entities.push({ id, e })
        })
    },

    /** 清除所有显示文本 */
    clearAll() {
        this.runMain(() => {
            for (let { id } of this.entities) {
                world.method_2945(id, RemovalReason.field_26999) //net.minecraft.world.entity.Entity$RemovalReason DISCARDED
            }
            this.entities.length = 0
            this.counter = 0
        })
    }
}


// === 主逻辑 ===
main()
function main() {
    if (!GlobalVars.getBoolean(scriptname)) return

    let player = Player.getPlayer()
    let pos = player.getPos()
    //let rot = {yaw: player.getYaw(), pitch: player.getPitch()}



    // 示例
    let component = Component.method_30163("§atest1111111111==============================================")
    TextDisplayManager.spawn(component, pos)

    // 当开关关闭时，清理全部
    while (GlobalVars.getBoolean(scriptname)) {
        Client.waitTick(1)
    }

    TextDisplayManager.clearAll()
}

function flags(alignmentRight, alignmentLeft, defaultBackground, seeThrough, shadow) {
  // 输入类型校验
  for (const v of [alignmentRight, alignmentLeft, defaultBackground, seeThrough, shadow]) {
    if (typeof v !== 'boolean') {
      throw new TypeError('All five arguments must be booleans');
    }
  }

  // 互斥约束：若 alignmentRight 为 true，alignmentLeft 必须为 false
  if (alignmentRight && alignmentLeft) {
    alignmentRight = false
    alignmentLeft = true
  }

  // 构造字节
  const val =
    (shadow ? 1 : 0) |
    ((seeThrough ? 1 : 0) << 1) |
    ((defaultBackground ? 1 : 0) << 2) |
    ((alignmentLeft ? 1 : 0) << 3) |
    ((alignmentRight ? 1 : 0) << 4);

  // 结果在 0..31
  return val & 0x1F;
}