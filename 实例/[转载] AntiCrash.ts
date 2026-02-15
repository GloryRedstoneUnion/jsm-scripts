// 来自jsm discord 作者:Grif

//@ts-check
/// <reference path="../tsc/headers/EnumGen/McIdsAndEnums.d.ts"/>
/// <reference path="../tsc/headers/JsMacros-1.8.5.d.ts"/>
/// <reference path="../tsc/headers/Graal.d.ts"/>
/// <reference no-default-lib = "true"/>
/// <reference lib = "ES2022"/>
JsMacros.assertEvent(event, "Service");

const versionString = Client.mcVersion();
const mappingsUrl = `https://maven.fabricmc.net/net/fabricmc/yarn/${versionString}%2Bbuild.1/yarn-${versionString}+build.1-v2.jar`;
const mappings = Reflection.loadMappingHelper(mappingsUrl);

/**@param {Events.RecvPacket} event */
const RecvPacket = (event) => {
	const { type, packet } = event;
	switch (type) {
		case "ParticleS2CPacket": {
			const maxParticles = 100_000;
			// const now = Time.time();
			const ParticleS2CPacket = mappings.remapClass(packet);
			const count = ParticleS2CPacket.invokeMethod("getCount");
			if (count >= maxParticles) event.cancel();
			// const data = JSON.stringify({
			// 	count,
			// 	// timeSpan: now - Time.time()
			// });
			// Chat.actionbar(`ParticleS2CPacket: ${data}`);
			break;
		}
		case "ExplosionS2CPacket": {
			const maxAffectedBlocks = 100_000;
			const maxVal = 30_000_000;
			const maxRadius = 1_000;
			const ExplosionS2CPacket = mappings.remapClass(packet);
			const Radius = ExplosionS2CPacket.invokeMethod("getRadius");
			const AffectedBlocks = /**@type {JavaList} */ ExplosionS2CPacket.invokeMethod("getAffectedBlocks");
			const x = ExplosionS2CPacket.invokeMethod("getX");
			const y = ExplosionS2CPacket.invokeMethod("getY");
			const z = ExplosionS2CPacket.invokeMethod("getZ");
			const PlayerVelocityX = ExplosionS2CPacket.invokeMethod("getPlayerVelocityX");
			const PlayerVelocityY = ExplosionS2CPacket.invokeMethod("getPlayerVelocityY");
			const PlayerVelocityZ = ExplosionS2CPacket.invokeMethod("getPlayerVelocityZ");
			// safety protections
			if (
				AffectedBlocks.size() > maxAffectedBlocks ||
				Radius > maxRadius ||
				[x, y, z].some((pos) => Math.abs(pos) >= maxVal) ||
				[PlayerVelocityX, PlayerVelocityY, PlayerVelocityZ].some((pos) => Math.abs(pos) >= maxVal)
			) {
				event.cancel();
			}
			// const data = JSON.stringify({
			//     Radius,
			//     AffectedBlocks: AffectedBlocks.size(),
			//     pos: { x, y, z },
			//     Velocity: { PlayerVelocityX, PlayerVelocityY, PlayerVelocityZ },
			// });
			// Chat.log(`ExplosionS2CPacket: ${data}`)
			break
		}
		case "PlayerPositionLookS2CPacket": {
			const maxVal = 30_000_000;
			const PlayerPositionLookS2CPacket = mappings.remapClass(packet);
			const VelocityX = PlayerPositionLookS2CPacket.invokeMethod("getVelocityX");
			const VelocityY = PlayerPositionLookS2CPacket.invokeMethod("getVelocityY");
			const VelocityZ = PlayerPositionLookS2CPacket.invokeMethod("getVelocityZ");
			if ([VelocityX, VelocityY, VelocityZ].some((velocity) => Math.abs(velocity) >= maxVal)) {
				event.cancel();
			}
			break
		}
	}
};
JsMacros.on("RecvPacket", true, JavaWrapper.methodToJava(RecvPacket));

event.stopListener = JavaWrapper.methodToJava(() => {
	Chat.actionbar(`refreshing ${file.getName()}`);
});
