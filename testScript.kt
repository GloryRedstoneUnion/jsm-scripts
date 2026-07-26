fun main() {
  Chat.say("/setblock 1000555 196 10000603 minecraft:oak_wall_sign[facing=south]")
  val x = 1000555
  val y = 196
  val z = 10000604
  for (i in z..z + 100) {
    Chat.say("/tp ${x} ${y} ${i}")
  }
}
