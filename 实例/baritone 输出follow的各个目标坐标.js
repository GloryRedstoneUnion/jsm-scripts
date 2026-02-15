const BaritoneAPI = Java.type("baritone.api.BaritoneAPI");
const baritone = BaritoneAPI.getProvider().getPrimaryBaritone();

const follow = baritone.getFollowProcess();

if (follow.isActive()) {
    const following = follow.following();
    if (!following.isEmpty()) {
        for (let i = 0; i < following.size(); i++) {
            const e = following.get(i).method_23314();
            Chat.log(i + " " + e)
        }
    } else {
        Chat.log("跟随进程有启动，但实体列表为空");
    }
} else {
    Chat.log("当前没有在跟随");
}




// 下面这堆是小鲸鱼(deepseek)写的，我基础不行看不太懂，但有效
// 能把这堆坐标转成jsm的helper，然后用jsm的函数处理，分开输出物品的x y z坐标


// // 导入必要的Java类
// const EntityHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.ItemEntityHelper');
// const ArrayList = Java.type('java.util.ArrayList');
// const ImmutableList = Java.type('com.google.common.collect.ImmutableList');

// /**
//  * 一个用于安全获取Baritone跟随实体及其坐标的包装器/工具类。
//  * 旨在处理不同Minecraft版本中混淆方法名的差异。
//  */
// var EntityHelperWrapper = {

//     /**
//      * 获取Baritone跟随进程中的实体列表。
//      * 参考了您提供的低版本getEntities函数思想，将其应用于Baritone的上下文。
//      * @returns {ArrayList | null} 包装为EntityHelper的实体列表，若获取失败则返回null。
//      */
//     getFollowingEntities: function () {
//         try {
//             const BaritoneAPI = Java.type("baritone.api.BaritoneAPI");
//             const baritone = BaritoneAPI.getProvider().getPrimaryBaritone();
//             const followProcess = baritone.getFollowProcess();

//             if (!followProcess.isActive()) {
//                 Chat.log("Baritone跟随进程未激活。");
//                 return null;
//             }

//             const followingSet = followProcess.following(); // 这是一个Java Set
//             if (followingSet.isEmpty()) {
//                 Chat.log("跟随列表为空。");
//                 return null;
//             }

//             // 将Java Set转换为ArrayList<EntityHelper>
//             const resultList = new ArrayList();
//             const iterator = followingSet.iterator();
//             while (iterator.hasNext()) {
//                 const entity = iterator.next();
//                 resultList.add(EntityHelper.create(entity)); // 核心：将原生实体包装为EntityHelper
//             }
//             return resultList;

//         } catch (e) {
//             Chat.log("在getFollowingEntities中发生错误: " + e.message);
//             return null;
//         }
//     },

//     /**
//      * 安全地获取一个EntityHelper所代表实体的位置（BlockPos）。
//      * 这里使用了JsMacros内置的EntityHelper的getPos()方法，通常比直接调用混淆方法更稳定。
//      * @param {EntityHelper} entityHelper
//      * @returns {Object | null} 包含x, y, z坐标的对象，或失败时返回null。
//      */
//     getEntityPosition: function (entityHelper) {
//         try {
//             // 方案1（推荐）：使用EntityHelper的getPos()方法，这通常是JsMacros提供的稳定API。
//             const blockPos = entityHelper.getPos();
//             if (blockPos) {
//                 return {
//                     x: blockPos.getX(), // 注意：这里getX()是JsMacros对BlockPos的映射，相对稳定
//                     y: blockPos.getY(),
//                     z: blockPos.getZ()
//                 };
//             }
//             return null;

//         } catch (e) {
//             Chat.log("在getEntityPosition中发生错误 (使用EntityHelper.getPos()): " + e.message);
//             return null;
//         }
//     }
// };

// // ------------------- 使用示例 -------------------
// // 在您的脚本中，您可以这样使用上述包装器：

// function main() {
//     const entities = EntityHelperWrapper.getFollowingEntities();
//     if (!entities || entities.isEmpty()) {
//         Chat.log("没有获取到可跟随的实体。");
//         return;
//     }

//     for (var i = 0; i < entities.size(); i++) {
//         const entityHelper = entities.get(i);
//         const pos = EntityHelperWrapper.getEntityPosition(entityHelper);

//         if (pos) {
//             // 成功获取到坐标
//             Chat.log("实体 " + i + " 的坐标: X=" + pos.x + ", Y=" + pos.y + ", Z=" + pos.z);
//             // 您现在可以愉快地使用 pos.x, pos.y, pos.z 了！
//         } else {
//             Chat.log("无法获取实体 " + i + " 的坐标。");
//         }
//     }
// }

// main();
