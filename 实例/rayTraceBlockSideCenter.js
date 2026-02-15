let block = Player.detailedRayTraceBlock(4.5,false)
let pos = block.getBlockPos().toPos3D().add(0.5,0.5,0.5).add(block.getSide().getVector().multiply(0.5, 0.5, 0.5))
Player.getPlayer().lookAt(pos.getX(),pos.getY(),pos.getZ())