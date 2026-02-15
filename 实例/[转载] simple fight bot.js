// 来自jsm discord
// author:tymin 2024.10.26
// kotlin
// 自动战斗机器人

import baritone.api.BaritoneAPI
import baritone.api.pathing.goals.GoalBlock
import xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.PlayerEntityHelper

val blacklistedTarget = mutableSetOf<String>()
var currentTarget: PlayerEntityHelper<net.minecraft.class_1657>? = null

JavaWrapper.methodToJavaAsync<Int, Unit, Unit>(0) {
    while (true) {
        try {
            if (blacklistedTarget.size > 1) blacklistedTarget.retainAll(listOf(blacklistedTarget.last()))

            currentTarget = World.loadedPlayers
                ?.filter { it.name.string == "Ice Walker" && !blacklistedTarget.contains(it.uuid) }
                ?.minByOrNull { it.distanceTo(Player.player) }

            currentTarget?.let {
                val distanceToTarget = it.distanceTo(Player.player)
                
                if (distanceToTarget < 45) Player.player?.lookAt(it.x, it.y + 1.46, it.z)
                if (distanceToTarget < 3) Player.interactionManager?.attack()

                BaritoneAPI.getProvider().primaryBaritone.customGoalProcess.setGoalAndPath(
                    GoalBlock(it.x.toInt(), it.y.toInt(), it.z.toInt())
                )

                if (!it.canTakeDamage()) blacklistedTarget.add(it.uuid.toString())
            }

            Thread.sleep(100)
        } catch (e: Exception) {
            e.printStackTrace()
            Thread.sleep(500)
        }
    }
}.run()