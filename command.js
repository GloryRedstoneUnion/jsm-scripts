while (true) {
  Chat.say(
    '/summon minecraft:villager ~ ~ ~ {Attributes:[{Name:"minecraft:generic.max_health",Base:1f}]}',
  );
  Time.sleep(100);
  Chat.say("/kill @e[type=minecraft:villager,limit=1,sort=nearest]");
  Time.sleep(900);
}
