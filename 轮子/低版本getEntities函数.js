const EntityHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper')
const ArrayList = Java.type('java.util.ArrayList')
const ImmutableList = Java.type('com.google.common.collect.ImmutableList')

function getEntities() {
  const entities = Client.getMinecraft().field_71441_e?.field_72996_f
  if (!entities) return null
  const res = new ArrayList()
  for (const e of ImmutableList.copyOf(entities)) {
    res.add(EntityHelper.create(e))
  }
  return res
}
