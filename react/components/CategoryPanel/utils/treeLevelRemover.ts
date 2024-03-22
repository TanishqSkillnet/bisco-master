export const removeChildrenAfter = (treeNodes: any, level: number) => {
  if (!treeNodes) return null
  return treeNodes.map((treeNode: any) => removeChildrenAfterNode(treeNode, 1, level))
}

export const removeChildrenAfterNode = (
  treeNode: any,
  currentLevel: number,
  cutoffLevel: number
) => {
  if (!treeNode) {
    return treeNode
  }
  if (currentLevel == cutoffLevel) {
    treeNode.children = []
  } else if (currentLevel < cutoffLevel) {
    currentLevel++
    for (var i = 0; i < treeNode.children.length; i++) {
      removeChildrenAfterNode(treeNode.children[i], currentLevel, cutoffLevel)
    }
  }
  return treeNode
}
