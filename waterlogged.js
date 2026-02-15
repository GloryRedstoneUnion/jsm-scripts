function parseNBT(nbtElement) {
  if (!nbtElement) return null;
  // 检查null值
  if (nbtElement.isNull()) {
    return null;
  }

  // 解析数字类型
  if (nbtElement.isNumber()) {
    return nbtElement.asNumberHelper().asNumber();
  }

  // 解析字符串类型
  if (nbtElement.isString()) {
    return nbtElement.asString();
  }

  // 解析列表类型
  if (nbtElement.isList()) {
    const list = nbtElement.asListHelper();
    const result = [];

    for (let i = 0; i < list.length(); i++) {
      const element = list.get(i);
      result.push(parseNBT(element));
    }

    return result;
  }

  // 解析复合类型 (Compound)
  if (nbtElement.isCompound()) {
    const compound = nbtElement.asCompoundHelper();
    const result = {};
    const keys = compound.getKeys();

    for (const key of keys) {
      const element = compound.get(key);
      result[key] = parseNBT(element);
    }

    return result;
  }

  // 对于未知类型，尝试返回原始值
  return nbtElement;
}

function isWaterlogged() {
  b = Player.getPlayer().rayTraceBlock(8, false);
  if (b.getId == "minecraft:cherry_leaves" && parseNBT(b.getNBT));
}
