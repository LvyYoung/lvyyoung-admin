export function toTreeData(srcData, root, pId, id) {
  let result = []
  if (!Array.isArray(srcData)) {
    return result
  }
  let map = {};
  srcData.forEach(item => {
    if (item[pId] === root) {
      map[item[id]] = item;
    } else {
      map[item[pId]].children ? map[item[pId]].children.push(item) : map[item[pId]].children = [item];
    }
  })
  for (let key in map) {
    result.push(map[key])
  }
  return result;
}